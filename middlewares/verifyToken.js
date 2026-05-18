const jwt = require('jsonwebtoken');

// ⚠️ 寫作業前先 `npm start` 打開 http://localhost:3000/docs 看 Swagger UI 的完整規格。

// ───────────────────────────────────────────────────────────
// TODO 任務一：JWT 守門員（verifyToken）
// ───────────────────────────────────────────────────────────
// Input:  req.headers.authorization（格式：'Bearer <token>'）
// Output: 驗過 → req.user + next() / 401 沒帶或格式錯 / 401 驗失敗
//
// 提示：
// 1. 從 req.headers.authorization 讀取 header
// 2. header 沒帶 或 格式不是 'Bearer <token>' → return 401（訊息：請先登入）
// 3. 從 header 中取出 token 的部分
// 4. 用 jwt.verify 搭配環境變數中的 secret 驗 token
// 5. 驗過 → 將 decoded 資料掛到 req.user，再呼叫 next()
// - jwt.verify 失敗會 throw，用 try/catch 接，catch 裡回 401（訊息：Token 無效或已過期）
// - ⚠️ 錯誤回應記得 return

/**
 * JWT 守門員：驗 Authorization header 的 Bearer token
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyToken = function (req, res, next) {
  // TODO: 實作
};

module.exports = verifyToken;
