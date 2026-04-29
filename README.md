# ✅ TaskFlow — AI 協作任務管理 Web App

> 本專案由 **Claude Sonnet 4.6 (Anthropic)** 與 **Gemini (Google)** 兩個 AI 跨模型協作開發完成。
> 歷經 7 輪對話迭代，從零規劃到完整交付一個全棧 MVP。

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Hono](https://img.shields.io/badge/Hono-4.0-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-teal)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 功能特色

- 🔐 **使用者認證** — JWT + bcryptjs 密碼加密，支援註冊/登入/登出
- 📋 **任務 CRUD** — 建立、讀取、更新、刪除任務，全部帶 Loading 狀態
- 🗂 **雙模式視圖** — Kanban Board 拖拽看板 + List View 清單，頂部一鍵切換
- 🎯 **優先級系統** — LOW / MEDIUM / HIGH 三級，顏色標籤快速辨識
- 📊 **狀態統計卡片** — 首頁顯示 待處理 / 進行中 / 已完成 各自數量
- 📱 **響應式設計** — 桌面與行動端皆可正常操作
- ⚡ **型別安全全棧** — TypeScript + Zod + Prisma，端到端型別保護

---

## 🖥 技術棧

| 層級 | 技術 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| UI 樣式 | Tailwind CSS |
| 狀態管理 | Zustand + TanStack Query v5 |
| 後端框架 | Hono (Node.js) |
| 資料庫 ORM | Prisma 5 |
| 資料庫 | PostgreSQL (Neon Serverless) |
| 認證 | JWT + bcryptjs |
| 資料驗證 | Zod |
| 語言 | TypeScript (全棧) |

---

## 🚀 快速開始

### 後端安裝

```bash
cd taskflow-backend
npm install
cp .env.example .env
# 編輯 .env 填入 DATABASE_URL 和 JWT_SECRET
npm run db:generate
npm run db:migrate
npm run dev
```

### 前端安裝

```bash
cd taskflow-frontend
npm install
cp .env.example .env.local
# 編輯 .env.local 填入 NEXT_PUBLIC_API_URL
npm run dev
```

---

## 📡 API 端點

| Method | Endpoint | 說明 |
|--------|----------|------|
| POST | /api/auth/register | 使用者註冊 |
| POST | /api/auth/login | 使用者登入 |
| GET | /api/auth/me | 取得目前使用者 |
| GET | /api/tasks | 取得所有任務 |
| POST | /api/tasks | 建立任務 |
| PATCH | /api/tasks/:id | 更新任務 |
| DELETE | /api/tasks/:id | 刪除任務 |

---

## ☁️ 部署

- **後端**：Railway + Neon PostgreSQL
- **前端**：Vercel

---

## 🤝 AI 協作紀錄

| AI | 模型 | 負責範圍 |
|----|------|---------|
| Claude | Sonnet 4.6 (Anthropic) | 前端架構、UI 組件、狀態管理 |
| Gemini | Google | 後端 API、資料庫設計、認證邏輯 |

---

*Built with ❤️ by Claude × Gemini — 跨 AI 協作實驗 2025*
