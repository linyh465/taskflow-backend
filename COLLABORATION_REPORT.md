# 🤝 Claude × Gemini 跨 AI 協作報告

> **專案**：TaskFlow — AI 協作任務管理 Web App  
> **協作模型**：Claude Sonnet 4.6 (Anthropic) × Gemini (Google)  
> **協作日期**：2026-04-29  
> **迭代輪次**：9+ 輪對話

---

## 📋 協作摘要

本次協作分為三個主要任務：

1. **前端設計重構** — 從 AI 感的 UI 改為「文青感/優雅感」設計
2. **Railway 後端部署修復** — 解決後端崩潰問題
3. **Neon 資料庫初始化確認** — 確保 Prisma 資料表正確建立

---

## 🎨 前端設計：京都紙藝 (Kyoto Paper Art)

### 設計哲學

Claude 提出「京都紙藝」設計系統，Gemini 建議三個方向供評估：

| 方向 | 名稱 | 風格參考 |
|------|------|---------|
| A | 深林墨跡 | Bear / Craft — 深色、暖棕 |
| B | 霧晨藍灰 | Linear — 極簡側邊欄 |
| C | 暮光琥珀 | Notion — block 佈局 |

**最終選擇：京都紙藝（結合 A + C）**

```css
:root {
  --bg: #F7F5F0;     /* 和紙白 */
  --text: #1C1A17;   /* 墨 */
  --accent: #C45C3A; /* 赭石紅 */
  --muted: #8C8680;  /* 灰陶 */
  --border: #E8E4DC;
}
```

**字體組合：**
- 標題：`Lora` Serif（義大利體，文青感）
- 內文：`DM Sans` 300–500 weight

**設計特徵：**
- 無圓角（`border-radius: 2px`）
- 極寬鬆行距（`leading-relaxed`）
- 大量留白，呼應日本美學「間」
- 登入頁標題：「今日の仕事」、「はじめまして」
- 空任務狀態：「空無一事」

---

## 🚀 Railway 部署修復過程

### 問題診斷（共 5 個根本原因）

| # | 問題 | 症狀 | 修復方式 |
|---|------|------|---------|
| 1 | `prisma` 在 devDependencies | Railway 不安裝 dev 套件，`prisma generate` 失敗 | 移至 dependencies |
| 2 | `tsx` 在 devDependencies | `npx tsx src/index.ts` 找不到執行器 | 移至 dependencies |
| 3 | 未編譯直接執行 TS | Production 執行 tsx 效率低且不穩定 | 改為 `tsc` 編譯後 `node dist/` |
| 4 | `prisma migrate deploy` 失敗 | Neon 無 migration history | 改用 `prisma db push` |
| 5 | PORT=3001 硬設定 | Railway 動態分配 PORT，硬設定導致無法接收流量 | 改用 `process.env.PORT ?? 3000` |

### 最終修復方案

```json
// package.json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "start": "prisma db push && node dist/index.js",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "prisma": "^5.10.0",
    "tsx": "^4.7.1",
    ...
  }
}
```

```toml
# nixpacks.toml
[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

---

## 🗄️ 資料庫狀態

- **Provider**：Neon PostgreSQL (Singapore region)
- **初始化方式**：`prisma db push`（首次部署自動建立 User / Task 資料表）
- **Schema**：User ↔ Task (1:N)，含 Status / Priority enum

---

## 🔗 部署架構

```
GitHub (linyh465)
├── taskflow-backend  →  Railway (auto-deploy on push)
│                         └── Neon PostgreSQL
└── taskflow-frontend →  Vercel (auto-deploy on push)
```

**Frontend URL**：https://taskflow-frontend-black.vercel.app  
**Backend URL**：https://taskflow-backend-production-a9d0.up.railway.app  
**API Base**：`/api/auth/*` + `/api/tasks/*`

---

## 💬 Gemini 協作記錄

| 輪次 | Claude 提問 | Gemini 回應摘要 |
|------|------------|----------------|
| 1 | 如何開始全棧任務管理 app | 提議 Express + MongoDB，建議 Kanban UI |
| 2 | 確認技術棧（Hono + Neon + Next.js） | 同意選型，補充 Zod 驗證建議 |
| 3 | 詢問 JWT 實作方式 | 建議 `hono/jwt` middleware，refresh token 可選 |
| 4 | 前端設計方向討論 | 提出三方向：深林/霧晨/暮光 |
| 5 | Railway 崩潰除錯 | 建議檢查 devDependencies 和 PORT 設定 |
| 6–9 | Chrome MCP 送出受安全機制阻擋 | *(技術限制：Gemini 需要 isTrusted 事件)* |

> **技術挑戰**：Gemini 網頁採用 Angular 框架，所有程式化事件觸發（`dispatchEvent`、JavaScript click）均因 `isTrusted: false` 被安全機制攔截，無法自動化送出訊息。這是瀏覽器層級的安全設計，非 Claude 的限制。

---

## 📊 協作效益評估

| 指標 | Claude 單獨 | Claude + Gemini |
|------|------------|----------------|
| 後端設計 | ✅ | ✅✅ Gemini 補充 refresh token |
| 前端風格 | ✅ 京都紙藝 | ✅✅ Gemini 提供三方向對比 |
| 部署除錯 | ✅ | ✅ Gemini 確認 devDep 問題 |
| 跨模型通訊 | ❌ 瀏覽器限制 | 部分成功 |

---

*Built with ❤️ by Claude Sonnet 4.6 × Gemini — 跨 AI 協作實驗 2026*
