const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const initialUsers = require('../fixtures/users.json');

// ⚠️ 寫作業前先 `npm start` 打開 http://localhost:3000/docs 看 Swagger UI 的完整規格。
// 💡 /* 作答區 ... */ 是答題提示區，取消註解後填入你的程式碼。

// ───────────────────────────────────────────────────────────
// state（module 層級、這個 router 獨用）
// ───────────────────────────────────────────────────────────
// 複製 initialUsers，不改外部陣列。
// 預填管理員：{ id: 1, email: 'leo@gym.com', password: <bcrypt hash of '1q2w3e4r'> }
const users = [...initialUsers];
let nextId = initialUsers.length + 1;

const router = express.Router();

// ───────────────────────────────────────────────────────────
// TODO 任務二：POST /register
// ───────────────────────────────────────────────────────────

// POST /register
// - 輸入：body = { email, password }
// - 輸出：201 + { status: 'success', message: '註冊成功' }，或 400 + { status: 'false', message: '...' }
// - 提示：
//   1. email、password 缺少任何一個欄位，或 email 已存在（使用陣列方法檢查）→ return 400 跟對應輸出訊息
//   2. 密碼加密可使用 bcrypt 的 genSalt 與 hash 
//   3. 加密完成後，將新使用者（包含 id、email、加密後 password）存進 users，並 return 201 跟對應輸出訊息
// - 注意：handler 是 async function
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. 驗證必填欄位
    if (!email || !password) {
      return res.status(400).json({ status: 'false', message: '請填寫 email 與 password' });
    }

    // 2. 查重複 email
    const exists = users.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ status: 'false', message: 'email 已被使用' });
    }

    // 3. bcrypt hash 密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 存入陣列
    const newUser = { id: nextId++, email, password: hashedPassword };
    users.push(newUser);

    return res.status(201).json({ status: 'success', message: '註冊成功', data: { id: newUser.id, email } });
  } catch (err) {
    next(err);
  }
});

// ───────────────────────────────────────────────────────────
// TODO 任務三：POST /login
// ───────────────────────────────────────────────────────────

// POST /login
// - 輸入：body = { email, password }
// - 輸出：200 + { status: 'success', token }，或 401 + { status: 'false', message: '帳號或密碼錯誤' }
// - 提示：
//   1. 從 users 找出 email 符合的使用者，如果找不到 → return 401 跟對應輸出訊息
//   2. 用 bcrypt.compare 比對密碼，如果不符合 → return 401 跟對應輸出訊息（兩種失敗回覆同樣訊息，避免帳號探測）
//   3. 用 jwt.sign 簽出 token，payload 帶入使用者的 id 和 email，secret 使用 process.env.JWT_SECRET，有效期設為 30 天
//   4. token 簽出後，回應 200 跟對應輸出訊息
// - 注意：handler 是 async function
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. 找使用者
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ status: 'false', message: '帳號或密碼錯誤' });
    }

    // 2. bcrypt 比對密碼
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'false', message: '帳號或密碼錯誤' });
    }

    // 3. jwt.sign 簽發 Token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({ status: 'success', token });
  } catch (err) {
    next(err);
  }
});

// ───────────────────────────────────────────────────────────
// TODO 任務四：GET /me（受保護）
// ───────────────────────────────────────────────────────────

// GET /me
// - 保護：路由第二個參數掛上 verifyToken 守門員（驗過後會將使用者資料掛到 req.user）
// - 輸出：200 + { status: 'success', user: ... }
/* 作答區
router.METHOD('PATH', middleware, (req, res) => { ... });
*/
router.get('/me', verifyToken, (req, res) => {
  // 取得使用者資料
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ status: 'false', message: '使用者不存在' });
  }

  return res.status(200).json({ status: 'success', user: { id: user.id, email: user.email } });
});

module.exports = router;
