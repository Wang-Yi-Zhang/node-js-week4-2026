const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const initialUsers = require('../fixtures/users.json');

// ⚠️ 寫作業前先 `npm start` 打開 http://localhost:3000/docs 看 Swagger UI 的完整規格。

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
// Input:  body = { email, password }
// Output: 201 / 400（缺欄位）/ 400（email 已存在）
//
// 提示：
// 1. 先驗欄位：email、password 都要有值，否則回傳 400 status
// 2. 用陣列方法檢查 users 裡是否已有相同 email，有的話回傳 400 status
// 3. 用 bcrypt：genSalt 產生 salt → hash 加密密碼
// 4. 把 { id: nextId++, email, password: 加密後的密碼 } 存進 users 陣列
// 5. 成功回傳 201 status
// - handler 是 async function
// - ⚠️ 錯誤回應記得 return

// ───────────────────────────────────────────────────────────
// TODO 任務三：POST /login
// ───────────────────────────────────────────────────────────
// Input:  body = { email, password }
// Output: 200 + { status, token } / 401
//
// 提示：
// 1. 從 users 陣列找出 email 符合的使用者
// 2. bcrypt.compare 比對明文密碼 vs DB hash
// 3. 使用者不存在 或 密碼錯誤 → 回一樣的 401（避免帳號探測）
// 4. 驗過 → jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn:'30d' }) 簽 token
// 5. 成功回傳 { status, token }
// - handler 是 async function
// - ⚠️ 錯誤回應記得 return

// ───────────────────────────────────────────────────────────
// TODO 任務四：GET /me（受保護）
// ───────────────────────────────────────────────────────────
// 提示：
// 1. 路由第二個參數掛上 verifyToken 守門員
// 2. handler 從 req.user 取得使用者資料回傳

module.exports = router;
