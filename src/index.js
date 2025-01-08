const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB接続URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

// MongoDB接続
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// ユーザーモデルの定義
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  address: String
});

const User = mongoose.model('User', UserSchema);

// JSONパーサーミドルウェア
app.use(express.json());

// ユーザー作成エンドポイント
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ユーザー取得エンドポイント（全件取得）
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ユーザー取得エンドポイント（ID指定）
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ユーザー更新エンドポイント（ID指定）
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // 更新後のドキュメントを返す
      runValidators: true // 更新時にバリデーションを実行
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ユーザー削除エンドポイント（ID指定）
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// サーバー起動
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
