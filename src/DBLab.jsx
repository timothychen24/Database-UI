import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --bg: #0d111b;
    --surface: #141b2d;
    --surface2: #1e2640;
    --border: #2f3f5a;
    --accent: #7dd3fc;
    --accent2: #c084fc;
    --accent3: #34d399;
    --warn: #facc15;
    --danger: #fb7185;
    --text: #e2e8f0;
    --muted: #94a3b8;
    --sql-color: #38bdf8;
    --nosql-color: #a78bfa;
    --sel-color: #fb7185;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    height: 100vh;
    overflow: hidden;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .app {
    display: grid;
    grid-template-rows: 48px 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* HEADER */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    z-index: 100;
  }
  .logo {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 16px;
    color: var(--accent);
    letter-spacing: -1px;
    flex-shrink: 0;
  }
  .logo span { color: var(--text); }
  .header-nav {
    display: flex;
    gap: 2px;
    margin-left: 8px;
  }
  .nav-btn {
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all .15s;
    letter-spacing: .5px;
  }
  .nav-btn:hover { color: var(--text); background: var(--surface2); }
  .nav-btn.active { color: var(--accent); background: rgba(0,229,255,.08); }
  .header-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .badge-count {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    background: rgba(241, 243, 243, 0.12);
    color: var(--accent);
    padding: 2px 8px;
    border-radius: 20px;
    border: 1px solid rgba(0,229,255,.2);
  }

  /* MAIN LAYOUT */
  .main {
    display: grid;
    grid-template-columns: 220px 1fr;
    overflow: hidden;
  }

  /* SIDEBAR */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    padding: 12px 0;
  }
  .sidebar-section {
    padding: 0 12px;
    margin-bottom: 4px;
  }
  .sidebar-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: var(--muted);
    text-transform: uppercase;
    padding: 8px 4px 4px;
  }
  .course-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all .15s;
    border: 1px solid transparent;
  }
  .course-item:hover { background: var(--surface2); }
  .course-item.active {
    background: rgba(0,229,255,.07);
    border-color: rgba(0,229,255,.15);
  }
  .course-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .course-info { min-width: 0; }
  .course-name {
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .course-meta {
    font-size: 10px;
    color: var(--muted);
    font-family: 'Space Mono', monospace;
  }
  .progress-mini {
    width: 100%;
    height: 2px;
    background: var(--border);
    border-radius: 1px;
    margin-top: 3px;
  }
  .progress-mini-fill {
    height: 100%;
    border-radius: 1px;
    transition: width .3s;
  }

  /* TASK LIST IN SIDEBAR */
  .task-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    border-radius: 5px;
    cursor: pointer;
    transition: all .15s;
    font-size: 11px;
  }
  .task-item:hover { background: var(--surface2); }
  .task-item.active { background: rgba(0,229,255,.07); color: var(--accent); }
  .task-status { font-size: 10px; margin-left: auto; flex-shrink: 0; }

  /* CONTENT AREA */
  .content {
    display: grid;
    grid-template-rows: 1fr;
    overflow: hidden;
    background: var(--bg);
  }

  /* TASK WORKSPACE */
  .workspace {
    display: grid;
    grid-template-columns: 1fr 280px;
    grid-template-rows: 1fr;
    overflow: hidden;
    gap: 0;
  }
  .workspace-left {
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
    border-right: 1px solid var(--border);
  }

  .task-header {
    padding: 14px 18px 12px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .task-title {
    font-size: 16px;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 6px;
  }
  .task-desc {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.5;
  }
  .task-tags { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
  .tag {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
    letter-spacing: .5px;
  }
  .tag-sql { background: rgba(0,229,255,.1); color: var(--sql-color); border: 1px solid rgba(0,229,255,.2); }
  .tag-nosql { background: rgba(167,139,250,.1); color: var(--nosql-color); border: 1px solid rgba(167,139,250,.2); }
  .tag-selection { background: rgba(52,211,153,.1); color: var(--sel-color); border: 1px solid rgba(52,211,153,.2); }

  /* EDITOR */
  .editor-container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .editor-tabs {
    display: flex;
    gap: 0;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 12px;
  }
  .editor-tab {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    padding: 7px 14px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--muted);
    cursor: pointer;
    transition: all .15s;
    letter-spacing: .5px;
  }
  .editor-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  .editor-wrap {
    flex: 1;
    overflow: hidden;
    position: relative;
    background: #0d1424;
  }
  .code-editor {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    color: #e2e8f0;
    padding: 14px 16px;
    caret-color: var(--accent);
  }

  /* SELECTION TASK */
  .selection-task {
    padding: 16px 18px;
    overflow-y: auto;
  }
  .selection-q {
    font-size: 13px;
    margin-bottom: 14px;
    line-height: 1.6;
    color: var(--text);
  }
  .db-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }
  .db-option {
    padding: 10px 12px;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: all .15s;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    background: var(--surface2);
  }
  .db-option:hover { border-color: var(--muted); }
  .db-option.selected { border-color: var(--accent); background: rgba(0,229,255,.07); color: var(--accent); }
  .db-option.selected-nosql { border-color: var(--nosql-color); background: rgba(167,139,250,.07); color: var(--nosql-color); }
  .db-option.selected-mixed { border-color: var(--sel-color); background: rgba(52,211,153,.07); color: var(--sel-color); }
  .reasons-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    padding: 10px 12px;
    outline: none;
    resize: vertical;
    min-height: 70px;
    transition: border-color .15s;
  }
  .reasons-input:focus { border-color: var(--accent); }
  .reasons-label { font-size: 11px; color: var(--muted); margin-bottom: 5px; font-weight: 600; }

  /* ACTION BAR */
  .action-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--surface);
    border-top: 1px solid var(--border);
  }
  .btn {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    padding: 7px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all .15s;
    letter-spacing: .5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .btn:disabled { opacity: .4; cursor: not-allowed; }
  .btn-run {
    background: rgba(0,229,255,.12);
    color: var(--accent);
    border: 1px solid rgba(0,229,255,.25);
  }
  .btn-run:hover:not(:disabled) { background: rgba(0,229,255,.2); }
  .btn-submit {
    background: var(--accent);
    color: #000;
  }
  .btn-submit:hover:not(:disabled) { background: #00c8e0; }
  .btn-hint {
    background: none;
    color: var(--warn);
    border: 1px solid rgba(245,158,11,.2);
    margin-left: auto;
  }
  .btn-hint:hover { background: rgba(245,158,11,.08); }
  .btn-reset {
    background: none;
    color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn-reset:hover { color: var(--text); }
  .btn-next {
    background: var(--accent3);
    color: #000;
  }
  .btn-next:hover { background: #0ea472; }

  /* RESULT PANEL */
  .result-panel {
    border-top: 1px solid var(--border);
    background: #0a0e1a;
    max-height: 220px;
    overflow-y: auto;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
  }
  .result-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    font-size: 10px;
    color: var(--muted);
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .result-status {
    width: 6px; height: 6px; border-radius: 50%;
  }
  .result-table { width: 100%; border-collapse: collapse; }
  .result-table th {
    text-align: left;
    padding: 5px 14px;
    font-size: 10px;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    text-transform: uppercase;
    letter-spacing: .5px;
  }
  .result-table td {
    padding: 4px 14px;
    border-bottom: 1px solid rgba(30,45,69,.5);
    color: #a0b4c8;
  }
  .result-table tr:hover td { background: rgba(0,229,255,.03); }
  .result-error {
    padding: 12px 14px;
    color: var(--danger);
    line-height: 1.5;
  }
  .result-json {
    padding: 10px 14px;
    color: #a0b4c8;
    white-space: pre-wrap;
  }

  /* RIGHT PANEL */
  .workspace-right {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--surface);
  }
  .right-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    padding: 0 10px;
  }
  .right-tab {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 8px 10px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--muted);
    cursor: pointer;
    transition: all .15s;
  }
  .right-tab.active { color: var(--text); border-bottom-color: var(--text); }
  .right-content { flex: 1; overflow-y: auto; padding: 12px; }

  /* SCHEMA VIEWER */
  .schema-table {
    margin-bottom: 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }
  .schema-table-name {
    padding: 6px 10px;
    background: var(--surface2);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--accent);
    border-bottom: 1px solid var(--border);
  }
  .schema-col {
    display: flex;
    align-items: center;
    padding: 4px 10px;
    gap: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    border-bottom: 1px solid rgba(30,45,69,.4);
  }
  .schema-col:last-child { border-bottom: none; }
  .schema-col-name { color: var(--text); flex: 1; }
  .schema-col-type { color: var(--nosql-color); }
  .schema-col-key { color: var(--warn); font-size: 9px; }

  /* FEEDBACK */
  .feedback-panel {
    margin: 10px 14px;
    padding: 12px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.6;
    border: 1px solid;
  }
  .feedback-success {
    background: rgba(16,185,129,.08);
    border-color: rgba(16,185,129,.25);
    color: #6ee7b7;
  }
  .feedback-error {
    background: rgba(239,68,68,.08);
    border-color: rgba(239,68,68,.25);
    color: #fca5a5;
  }
  .feedback-ai {
    background: rgba(124,58,237,.08);
    border-color: rgba(124,58,237,.25);
    color: #c4b5fd;
  }
  .feedback-thinking {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--muted);
    font-size: 12px;
    padding: 8px 14px;
  }
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* HINT */
  .hint-box {
    background: rgba(245,158,11,.06);
    border: 1px solid rgba(245,158,11,.2);
    border-radius: 6px;
    padding: 10px 12px;
    margin: 0 14px 8px;
    font-size: 11px;
    color: #fcd34d;
    line-height: 1.6;
  }
  .hint-label { font-weight: 700; font-size: 10px; letter-spacing: 1px; margin-bottom: 4px; text-transform: uppercase; }

  /* COURSES PAGE */
  .courses-page {
    padding: 24px;
    overflow-y: auto;
    height: 100%;
  }
  .page-title {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 4px;
  }
  .page-sub { color: var(--muted); font-size: 13px; margin-bottom: 24px; }
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .course-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px;
    cursor: pointer;
    transition: all .2s;
    position: relative;
    overflow: hidden;
  }
  .course-card:hover { border-color: var(--muted); transform: translateY(-2px); }
  .course-card-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
  }
  .course-card-type {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .course-card-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .course-card-desc { font-size: 12px; color: var(--muted); line-height: 1.5; margin-bottom: 14px; }
  .course-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .course-card-progress { font-size: 11px; color: var(--muted); }
  .progress-bar {
    width: 100%;
    height: 3px;
    background: var(--border);
    border-radius: 2px;
    margin-top: 6px;
  }
  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width .4s ease;
  }

  /* DASHBOARD */
  .dashboard-page {
    padding: 24px;
    overflow-y: auto;
    height: 100%;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
  }
  .stat-val {
    font-family: 'Space Mono', monospace;
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label { font-size: 11px; color: var(--muted); }

  /* BADGES */
  .badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    margin-top: 14px;
  }
  .badge-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    opacity: .4;
    transition: opacity .2s;
  }
  .badge-card.earned { opacity: 1; border-color: var(--accent); background: rgba(0,229,255,.05); }
  .badge-icon { font-size: 24px; margin-bottom: 6px; }
  .badge-name { font-size: 11px; font-weight: 600; line-height: 1.3; }

  /* HOME */
  .home-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 32px;
    overflow-y: auto;
  }
  .hero-title {
    font-size: 42px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    font-size: 15px;
    color: var(--muted);
    max-width: 500px;
    margin: 0 auto 28px;
    line-height: 1.7;
  }
  .scenario-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    max-width: 700px;
    width: 100%;
    margin-bottom: 28px;
  }
  .scenario-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px;
    text-align: left;
    cursor: pointer;
    transition: all .15s;
  }
  .scenario-card:hover { border-color: var(--muted); }
  .scenario-icon { font-size: 20px; margin-bottom: 6px; }
  .scenario-name { font-size: 13px; font-weight: 700; margin-bottom: 3px; }
  .scenario-db { font-size: 10px; font-family: 'Space Mono', monospace; }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* LESSON CONTENT */
  .lesson-content {
    padding: 16px 18px;
    overflow-y: auto;
    height: 100%;
    line-height: 1.7;
  }
  .lesson-content h2 { font-size: 18px; font-weight: 800; margin-bottom: 10px; }
  .lesson-content h3 { font-size: 14px; font-weight: 700; margin: 14px 0 6px; color: var(--accent); }
  .lesson-content p { font-size: 13px; color: var(--muted); margin-bottom: 10px; }
  .lesson-content code {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    background: var(--surface2);
    padding: 2px 6px;
    border-radius: 3px;
    color: var(--accent);
  }
  .lesson-content pre {
    background: #0d1424;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 14px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #a0b4c8;
    margin: 10px 0;
    overflow-x: auto;
    line-height: 1.6;
  }
  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin: 10px 0;
  }
  .comparison-table th {
    background: var(--surface2);
    padding: 7px 12px;
    text-align: left;
    font-size: 11px;
    border: 1px solid var(--border);
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .5px;
  }
  .comparison-table td {
    padding: 6px 12px;
    border: 1px solid var(--border);
    color: var(--muted);
  }

  .divider { height: 1px; background: var(--border); margin: 16px 0; }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--muted);
    gap: 8px;
    font-size: 13px;
  }
  .empty-icon { font-size: 32px; opacity: .5; }
`;

// demo: trigger watcher auto-commit

// ─── DATA ─────────────────────────────────────────────────────────────────────

const COURSES = [
  {
    id: "sel",
    title: "資料庫選型基礎",
    type: "SELECTION",
    color: "#34d399",
    level: "入門",
    desc: "學會根據系統需求判斷應使用 SQL、NoSQL 還是混合式架構",
    icon: "🧭",
    lessons: [
      {
        id: "sel-l1",
        title: "什麼是資料庫",
        content: `## 什麼是資料庫？

資料庫（Database）是有組織地儲存資料的系統，讓應用程式能有效率地讀取、新增、修改和刪除資料。

### 為什麼需要資料庫？

想像一個電商平台：每天有數百萬筆訂單、商品與用戶資料。如果把這些資料存在一般文字檔案中，查詢速度會極慢，而且容易出錯。資料庫提供了結構化的儲存方式，並支援快速查詢。

### 兩大類資料庫

**關聯式資料庫（SQL）**
- 資料存在「資料表」中，每個資料表有固定的欄位
- 使用 SQL 語言操作
- 適合需要嚴格一致性的場景，例如銀行、電商訂單

**NoSQL 資料庫**
- 不需要固定的資料結構
- 適合彈性資料、大量讀寫、水平擴充
- 分為：文件型（MongoDB）、鍵值型（Redis）、圖形（Neo4j）

### 常見系統

| 類型 | 系統 | 常見用途 |
|------|------|---------|
| SQL | MySQL, PostgreSQL | 電商、銀行、ERP |
| 文件型 | MongoDB | 社群、CMS、IoT |
| 鍵值型 | Redis | 快取、Session |
| 圖形 | Neo4j | 社交關係、推薦 |`,
        tasks: [
          {
            id: "sel-t1",
            title: "判斷資料庫選型：銀行系統",
            type: "selection",
            scenario: "銀行轉帳系統需要儲存帳戶餘額、客戶資料與每筆交易紀錄。每次轉帳都必須確保「扣款」和「入帳」同時成功或同時失敗，絕對不能只有其中一步完成。",
            question: "此系統應選擇哪種資料庫？",
            options: ["SQL（關聯式）", "NoSQL 文件型", "NoSQL 鍵值型", "混合式架構"],
            correctAnswer: 0,
            requiredKeywords: ["交易", "一致性", "ACID", "關聯"],
            explanation: "銀行系統需要 ACID 交易保證（原子性、一致性、隔離性、持久性），資料關聯清楚（客戶→帳戶→交易），因此 SQL 最適合。"
          },
          {
            id: "sel-t2",
            title: "判斷資料庫選型：社群貼文",
            type: "selection",
            scenario: "社群平台需要儲存使用者的貼文，每篇貼文可能包含：文字內容、多張圖片連結、標籤陣列、前三則留言摘要、按讚數。不同貼文的欄位可能不同，而且每天有大量新貼文寫入。",
            question: "此系統的貼文資料應選擇哪種資料庫？",
            options: ["SQL（關聯式）", "NoSQL 文件型", "NoSQL 鍵值型", "圖形資料庫"],
            correctAnswer: 1,
            requiredKeywords: ["彈性", "巢狀", "文件", "嵌入"],
            explanation: "社群貼文結構彈性高，可以嵌入圖片、標籤、留言摘要等巢狀資料。NoSQL 文件型資料庫（如 MongoDB）非常適合這種場景，不需要固定的 schema。"
          },
          {
            id: "sel-t3",
            title: "判斷資料庫選型：電商平台",
            type: "selection",
            scenario: "電商平台同時有：訂單付款（需要交易一致性）、商品瀏覽紀錄（資料量龐大）、推薦系統（基於使用者行為）。",
            question: "電商平台最合適的架構是？",
            options: ["只用 SQL", "只用 NoSQL", "SQL + NoSQL 混合", "只用圖形資料庫"],
            correctAnswer: 2,
            requiredKeywords: ["混合", "訂單", "快取", "推薦"],
            explanation: "現代電商平台通常採用混合架構：訂單、付款、庫存使用 SQL（需要 ACID）；商品瀏覽紀錄、購物車快取使用 NoSQL（需要高效能讀寫）。"
          }
        ]
      }
    ]
  },
  {
    id: "sql",
    title: "銀行平台 SQL 實作",
    type: "SQL",
    color: "#00e5ff",
    level: "初級",
    desc: "以銀行系統為情境，學習建立資料表、新增查詢更新刪除資料、JOIN 多表查詢",
    icon: "🏦",
    lessons: [
      {
        id: "sql-l1",
        title: "建立資料表與新增資料",
        content: `## 銀行系統 SQL 實作

在銀行系統中，我們需要儲存客戶資料、帳戶資訊和交易紀錄。

### 資料表設計

**customers（客戶表）**
\`\`\`sql
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  created_at DATE
);
\`\`\`

**accounts（帳戶表）**
\`\`\`sql
CREATE TABLE accounts (
  account_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  account_type VARCHAR(20),
  balance DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
\`\`\`

### INSERT INTO 語法

\`\`\`sql
INSERT INTO customers (customer_id, name, email, created_at)
VALUES (1, '王小明', 'ming@example.com', '2026-01-15');
\`\`\`

外鍵（Foreign Key）讓帳戶與客戶產生關聯，確保每個帳戶都有對應的客戶。`,
        tasks: [
          {
            id: "sql-t1",
            title: "B-01：建立客戶資料表",
            type: "sql",
            desc: "請建立一張 customers 資料表，包含 customer_id（主鍵）、name（不可為空）、email、phone、created_at 欄位。",
            starterCode: "-- 請建立 customers 資料表\nCREATE TABLE customers (\n  \n);",
            initialSql: "",
            expectedRule: {
              checkType: "SCHEMA",
              tableName: "customers",
              requiredColumns: ["customer_id", "name", "email"],
              primaryKey: "customer_id"
            },
            hints: [
              "使用 CREATE TABLE 語法",
              "主鍵使用 INTEGER PRIMARY KEY",
              "name 欄位需要加上 NOT NULL 限制"
            ],
            schema: [
              { name: "customers（待建立）", columns: [
                { name: "customer_id", type: "INTEGER", key: "PK" },
                { name: "name", type: "VARCHAR(50)", key: "NOT NULL" },
                { name: "email", type: "VARCHAR(100)", key: "" },
                { name: "phone", type: "VARCHAR(20)", key: "" },
                { name: "created_at", type: "DATE", key: "" }
              ]}
            ]
          },
          {
            id: "sql-t2",
            title: "B-02：新增客戶資料",
            type: "sql",
            desc: "帳戶資料表已建立好了。請新增三位銀行客戶：王小明、李小華、陳大偉。",
            starterCode: "-- 請新增三位客戶\nINSERT INTO customers (customer_id, name, email, created_at)\nVALUES (1, '王小明', 'ming@example.com', '2026-01-15');",
            initialSql: "CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100), created_at DATE);",
            expectedRule: {
              checkType: "DATA_COUNT",
              query: "SELECT * FROM customers",
              expectedCount: 3
            },
            hints: [
              "使用 INSERT INTO 新增多筆資料",
              "可以用多個 INSERT 語句，或在 VALUES 後面加多組括號",
              "記得每筆資料的 customer_id 要不同"
            ],
            schema: [
              { name: "customers", columns: [
                { name: "customer_id", type: "INTEGER", key: "PK" },
                { name: "name", type: "VARCHAR(50)", key: "NOT NULL" },
                { name: "email", type: "VARCHAR(100)", key: "" },
                { name: "created_at", type: "DATE", key: "" }
              ]}
            ]
          },
          {
            id: "sql-t3",
            title: "B-03：查詢所有客戶",
            type: "sql",
            desc: "請查詢所有客戶的姓名與電子郵件，並按照 customer_id 排序。",
            starterCode: "-- 查詢所有客戶的姓名與 email\nSELECT ",
            initialSql: "CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name VARCHAR(50), email VARCHAR(100), created_at DATE); INSERT INTO customers VALUES (1,'王小明','ming@example.com','2026-01-15'),(2,'李小華','hua@example.com','2026-02-20'),(3,'陳大偉','wei@example.com','2026-03-10');",
            expectedRule: {
              checkType: "QUERY_RESULT",
              expectedSql: "SELECT name, email FROM customers ORDER BY customer_id;"
            },
            hints: [
              "使用 SELECT 欄位名稱 FROM 資料表名稱",
              "用逗號分隔多個欄位：SELECT name, email FROM customers",
              "排序使用 ORDER BY customer_id"
            ],
            schema: [
              { name: "customers", columns: [
                { name: "customer_id", type: "INTEGER", key: "PK" },
                { name: "name", type: "VARCHAR(50)", key: "" },
                { name: "email", type: "VARCHAR(100)", key: "" },
                { name: "created_at", type: "DATE", key: "" }
              ]}
            ]
          },
          {
            id: "sql-t4",
            title: "B-04：篩選高餘額帳戶",
            type: "sql",
            desc: "帳戶資料已準備好。請查詢餘額大於 10000 的所有帳戶，顯示 account_id 和 balance，並由高到低排序。",
            starterCode: "-- 查詢餘額大於 10000 的帳戶\nSELECT ",
            initialSql: "CREATE TABLE accounts (account_id INTEGER PRIMARY KEY, customer_id INTEGER, account_type VARCHAR(20), balance DECIMAL(12,2)); INSERT INTO accounts VALUES (101,1,'checking',12000.00),(102,1,'savings',5000.00),(103,2,'checking',30000.00),(104,3,'savings',8500.00),(105,3,'checking',25000.00);",
            expectedRule: {
              checkType: "QUERY_RESULT",
              expectedSql: "SELECT account_id, balance FROM accounts WHERE balance > 10000 ORDER BY balance DESC;"
            },
            hints: [
              "使用 WHERE balance > 10000 來篩選",
              "ORDER BY balance DESC 代表由大到小排序",
              "只需要 account_id 和 balance 兩個欄位"
            ],
            schema: [
              { name: "accounts", columns: [
                { name: "account_id", type: "INTEGER", key: "PK" },
                { name: "customer_id", type: "INTEGER", key: "FK" },
                { name: "account_type", type: "VARCHAR(20)", key: "" },
                { name: "balance", type: "DECIMAL(12,2)", key: "" }
              ]}
            ]
          },
          {
            id: "sql-t5",
            title: "B-05：JOIN 查詢客戶與帳戶",
            type: "sql",
            desc: "請使用 JOIN 查詢每個帳戶的客戶姓名和帳戶餘額，顯示：客戶姓名（name）、帳戶編號（account_id）、餘額（balance）。",
            starterCode: "-- 使用 JOIN 查詢客戶姓名與帳戶資訊\nSELECT ",
            initialSql: "CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name VARCHAR(50), email VARCHAR(100)); CREATE TABLE accounts (account_id INTEGER PRIMARY KEY, customer_id INTEGER, account_type VARCHAR(20), balance DECIMAL(12,2)); INSERT INTO customers VALUES (1,'王小明','ming@example.com'),(2,'李小華','hua@example.com'),(3,'陳大偉','wei@example.com'); INSERT INTO accounts VALUES (101,1,'checking',12000),(102,1,'savings',5000),(103,2,'checking',30000),(104,3,'savings',8500);",
            expectedRule: {
              checkType: "QUERY_RESULT",
              expectedSql: "SELECT customers.name, accounts.account_id, accounts.balance FROM customers INNER JOIN accounts ON customers.customer_id = accounts.customer_id;"
            },
            hints: [
              "使用 INNER JOIN ... ON 來連接兩張表",
              "語法：FROM customers INNER JOIN accounts ON customers.customer_id = accounts.customer_id",
              "SELECT 欄位時要指定資料表：customers.name, accounts.balance"
            ],
            schema: [
              { name: "customers", columns: [
                { name: "customer_id", type: "INTEGER", key: "PK" },
                { name: "name", type: "VARCHAR(50)", key: "" }
              ]},
              { name: "accounts", columns: [
                { name: "account_id", type: "INTEGER", key: "PK" },
                { name: "customer_id", type: "INTEGER", key: "FK → customers" },
                { name: "balance", type: "DECIMAL(12,2)", key: "" }
              ]}
            ]
          },
          {
            id: "sql-t6",
            title: "B-06：更新帳戶餘額",
            type: "sql",
            desc: "帳戶 101 進行了一筆存款，餘額應從 12000 增加 5000。請使用 UPDATE 更新餘額，然後查詢帳戶 101 的最新餘額確認結果。",
            starterCode: "-- 更新帳戶 101 的餘額\nUPDATE accounts\nSET balance = \nWHERE account_id = 101;\n\n-- 查詢更新後的結果\nSELECT account_id, balance FROM accounts WHERE account_id = 101;",
            initialSql: "CREATE TABLE accounts (account_id INTEGER PRIMARY KEY, customer_id INTEGER, balance DECIMAL(12,2)); INSERT INTO accounts VALUES (101,1,12000),(102,1,5000),(103,2,30000);",
            expectedRule: {
              checkType: "QUERY_RESULT",
              expectedSql: "UPDATE accounts SET balance = 17000 WHERE account_id = 101; SELECT account_id, balance FROM accounts WHERE account_id = 101;",
              checkQuery: "SELECT account_id, balance FROM accounts WHERE account_id = 101;",
              expectedValue: { account_id: 101, balance: 17000 }
            },
            hints: [
              "UPDATE 語法：UPDATE 表名 SET 欄位 = 值 WHERE 條件",
              "餘額應該是 12000 + 5000 = 17000",
              "一定要加 WHERE 條件，否則所有帳戶都會被更新！"
            ],
            schema: [
              { name: "accounts", columns: [
                { name: "account_id", type: "INTEGER", key: "PK" },
                { name: "customer_id", type: "INTEGER", key: "FK" },
                { name: "balance", type: "DECIMAL(12,2)", key: "" }
              ]}
            ]
          }
        ]
      }
    ]
  },
  {
    id: "nosql",
    title: "社群平台 NoSQL 實作",
    type: "NOSQL",
    color: "#a78bfa",
    level: "初級",
    desc: "以社群平台為情境，學習文件型資料庫的設計與 MongoDB 風格查詢",
    icon: "💬",
    lessons: [
      {
        id: "nosql-l1",
        title: "文件型資料庫概念",
        content: `## 社群平台 NoSQL 實作

社群平台的貼文資料結構彈性高，非常適合使用 NoSQL 文件型資料庫。

### 為什麼選 NoSQL？

- 每篇貼文的欄位可能不同（有些有圖片，有些只有文字）
- 可以嵌入留言摘要，避免大量 JOIN
- 每天大量寫入，NoSQL 擴充性更好

### MongoDB 文件範例

\`\`\`json
{
  "_id": "post_001",
  "author": {
    "user_id": "user_001",
    "display_name": "王小明"
  },
  "content": "今天學到 SQL 和 NoSQL 的差異！",
  "tags": ["資料庫", "學習"],
  "likes": 42,
  "comments": [
    { "user": "李小華", "text": "學得很棒！" }
  ],
  "created_at": "2026-05-09T10:00:00"
}
\`\`\`

### 基本操作語法

\`\`\`
// 查詢所有貼文
db.posts.find({})

// 查詢特定使用者的貼文
db.posts.find({ "author.user_id": "user_001" })

// 新增一篇貼文
db.posts.insertOne({ ... })

// 更新按讚數
db.posts.updateOne(
  { _id: "post_001" },
  { $inc: { likes: 1 } }
)
\`\`\``,
        tasks: [
          {
            id: "nosql-t1",
            title: "S-01：查詢所有貼文",
            type: "nosql",
            desc: "請查詢 posts collection 中的所有貼文。",
            starterCode: "db.posts.find({})",
            collections: {
              posts: [
                { _id: "post_001", author: { user_id: "user_001", display_name: "王小明" }, content: "今天學到 SQL 和 NoSQL 的差異！", likes: 42, created_at: "2026-05-09T10:00:00" },
                { _id: "post_002", author: { user_id: "user_002", display_name: "李小華" }, content: "資料庫選型很重要，要看業務需求！", likes: 28, created_at: "2026-05-09T11:00:00" },
                { _id: "post_003", author: { user_id: "user_001", display_name: "王小明" }, content: "MySQL 和 MongoDB 各有優缺點", likes: 15, created_at: "2026-05-09T14:00:00" }
              ]
            },
            expectedRule: { checkType: "DOCUMENT_COUNT", expectedCount: 3 },
            hints: [
              "使用 db.posts.find({}) 查詢所有文件",
              "find() 括號內放篩選條件，空 {} 代表不篩選",
              "這是最基本的查詢語法"
            ]
          },
          {
            id: "nosql-t2",
            title: "S-02：查詢指定用戶的貼文",
            type: "nosql",
            desc: "請查詢 user_001（王小明）發布的所有貼文，只顯示該使用者的貼文。",
            starterCode: 'db.posts.find({})',
            collections: {
              posts: [
                { _id: "post_001", author: { user_id: "user_001", display_name: "王小明" }, content: "今天學到 SQL 和 NoSQL 的差異！", likes: 42, created_at: "2026-05-09T10:00:00" },
                { _id: "post_002", author: { user_id: "user_002", display_name: "李小華" }, content: "資料庫選型很重要！", likes: 28, created_at: "2026-05-09T11:00:00" },
                { _id: "post_003", author: { user_id: "user_001", display_name: "王小明" }, content: "MySQL 和 MongoDB 各有優缺點", likes: 15, created_at: "2026-05-09T14:00:00" }
              ]
            },
            expectedRule: { checkType: "DOCUMENT_IDS", expectedIds: ["post_001", "post_003"] },
            hints: [
              "要篩選巢狀欄位，使用點記法：\"author.user_id\"",
              "語法：db.posts.find({ \"author.user_id\": \"user_001\" })",
              "注意：user_id 是在 author 物件裡面的"
            ]
          },
          {
            id: "nosql-t3",
            title: "S-03：新增一篇貼文",
            type: "nosql",
            desc: "請新增一篇貼文，作者是 user_003（陳大偉），內容是「NoSQL 真的很有趣！」，按讚數為 0。",
            starterCode: 'db.posts.insertOne({\n  _id: "post_004",\n  \n})',
            collections: {
              posts: [
                { _id: "post_001", author: { user_id: "user_001", display_name: "王小明" }, content: "今天學到 SQL 和 NoSQL 的差異！", likes: 42, created_at: "2026-05-09T10:00:00" }
              ]
            },
            expectedRule: { checkType: "INSERT_CHECK", collectionName: "posts", expectedCount: 2 },
            hints: [
              "使用 insertOne() 新增一篇貼文",
              "author 是一個物件：{ user_id: \"user_003\", display_name: \"陳大偉\" }",
              "記得加上 likes: 0 和 created_at 欄位"
            ]
          },
          {
            id: "nosql-t4",
            title: "S-04：更新按讚數",
            type: "nosql",
            desc: "請幫 post_001 增加 1 個按讚（使用 $inc 運算子），然後查詢更新後的文件確認結果。",
            starterCode: 'db.posts.updateOne(\n  { _id: "post_001" },\n  { $inc: { likes:  } }\n)',
            collections: {
              posts: [
                { _id: "post_001", author: { user_id: "user_001", display_name: "王小明" }, content: "今天學到 SQL 和 NoSQL 的差異！", likes: 42, created_at: "2026-05-09T10:00:00" },
                { _id: "post_002", author: { user_id: "user_002", display_name: "李小華" }, content: "資料庫選型很重要！", likes: 28, created_at: "2026-05-09T11:00:00" }
              ]
            },
            expectedRule: { checkType: "UPDATE_CHECK", docId: "post_001", field: "likes", expectedValue: 43 },
            hints: [
              "$inc 是「遞增」運算子：{ $inc: { likes: 1 } }",
              "第一個參數是篩選條件：{ _id: \"post_001\" }",
              "執行後可以用 db.posts.find({ _id: \"post_001\" }) 確認結果"
            ]
          },
          {
            id: "nosql-t5",
            title: "S-05：查詢並排序貼文",
            type: "nosql",
            desc: "請查詢所有貼文，並依照按讚數（likes）由高到低排序。",
            starterCode: 'db.posts.find({}).sort({})',
            collections: {
              posts: [
                { _id: "post_001", author: { user_id: "user_001", display_name: "王小明" }, content: "今天學到 SQL 和 NoSQL 的差異！", likes: 42, created_at: "2026-05-09T10:00:00" },
                { _id: "post_002", author: { user_id: "user_002", display_name: "李小華" }, content: "資料庫選型很重要！", likes: 28, created_at: "2026-05-09T11:00:00" },
                { _id: "post_003", author: { user_id: "user_001", display_name: "王小明" }, content: "MySQL 和 MongoDB 各有優缺點", likes: 15, created_at: "2026-05-09T14:00:00" }
              ]
            },
            expectedRule: { checkType: "SORT_CHECK", sortField: "likes", order: "desc" },
            hints: [
              "sort() 可以鏈接在 find() 後面",
              "降序排序：.sort({ likes: -1 })，-1 代表由大到小",
              "語法：db.posts.find({}).sort({ likes: -1 })"
            ]
          }
        ]
      }
    ]
  }
];

const BADGES = [
  { id: "first-table", icon: "🏗️", name: "資料表建築師", desc: "建立第一張資料表" },
  { id: "first-insert", icon: "✍️", name: "資料新增達人", desc: "完成第一次 INSERT" },
  { id: "first-select", icon: "🔍", name: "查詢新手", desc: "成功查詢資料" },
  { id: "first-join", icon: "🔗", name: "JOIN 達人", desc: "完成第一次 JOIN 查詢" },
  { id: "first-nosql", icon: "📄", name: "文件模型師", desc: "完成第一個 NoSQL 任務" },
  { id: "sel-complete", icon: "🧭", name: "選型分析師", desc: "完成選型課程" },
  { id: "sql-complete", icon: "🏦", name: "銀行資料庫師", desc: "完成銀行 SQL 專案" },
  { id: "nosql-complete", icon: "💬", name: "社群架構師", desc: "完成社群 NoSQL 專案" },
  { id: "streak-5", icon: "🔥", name: "連續五勝", desc: "連續答對 5 題" }
];

// ─── SQL SANDBOX ──────────────────────────────────────────────────────────────

function runSqlSandbox(initialSql, userSql) {
  // Use sql.js loaded via CDN (already in window)
  try {
    const SQL = window.initSqlJs ? null : window.SQL;
    if (!window._sqlReady) return { error: "SQL 引擎載入中，請稍後再試..." };

    const db = new window.SQL.Database();
    if (initialSql) {
      const stmts = initialSql.split(";").filter(s => s.trim());
      for (const stmt of stmts) {
        if (stmt.trim()) db.run(stmt + ";");
      }
    }

    const stmts = userSql.split(";").filter(s => s.trim());
    let lastResult = null;

    for (const stmt of stmts) {
      const trimmed = stmt.trim().toUpperCase();
      if (!trimmed) continue;
      // Security: block dangerous operations
      if (/ATTACH|DETACH|\.import|\.read/i.test(stmt)) {
        return { error: "不允許執行此操作（安全限制）" };
      }
      const results = db.exec(stmt + ";");
      if (results && results.length > 0) {
        lastResult = results[results.length - 1];
      }
    }
    db.close();
    return { success: true, result: lastResult };
  } catch (e) {
    return { error: e.message };
  }
}

function checkSqlAnswer(task, userSql) {
  const rule = task.expectedRule;
  const initialSql = task.initialSql || "";

  if (rule.checkType === "SCHEMA") {
    const r = runSqlSandbox(userSql, `SELECT name FROM sqlite_master WHERE type='table' AND name='${rule.tableName}';`);
    if (r.error) return { correct: false, feedback: "SQL 語法錯誤：" + r.error };
    if (!r.result || r.result.values.length === 0) return { correct: false, feedback: `找不到 ${rule.tableName} 資料表，請確認資料表名稱。` };

    // Check columns
    const colCheck = runSqlSandbox(userSql, `PRAGMA table_info(${rule.tableName});`);
    if (!colCheck.result) return { correct: false, feedback: "無法讀取資料表結構" };
    const cols = colCheck.result.values.map(r => r[1].toLowerCase());
    for (const req of rule.requiredColumns) {
      if (!cols.includes(req.toLowerCase())) return { correct: false, feedback: `找不到 ${req} 欄位，請確認欄位名稱。` };
    }
    return { correct: true, feedback: "✓ 資料表建立成功！欄位設計正確。" };
  }

  if (rule.checkType === "DATA_COUNT") {
    const r = runSqlSandbox(initialSql + " " + userSql, rule.query);
    if (r.error) return { correct: false, feedback: "SQL 語法錯誤：" + r.error };
    const count = r.result ? r.result.values.length : 0;
    if (count < rule.expectedCount) return { correct: false, feedback: `目前有 ${count} 筆資料，需要 ${rule.expectedCount} 筆。` };
    return { correct: true, feedback: `✓ 成功新增 ${count} 筆資料！` };
  }

  if (rule.checkType === "QUERY_RESULT") {
    const userR = runSqlSandbox(initialSql, userSql);
    if (userR.error) return { correct: false, feedback: "SQL 語法錯誤：" + userR.error };

    const checkSql = rule.checkQuery || rule.expectedSql;
    const expR = runSqlSandbox(initialSql, checkSql);

    if (!userR.result) return { correct: false, feedback: "查詢沒有回傳結果，請確認 SELECT 語句。" };
    if (!expR.result) return { correct: false, feedback: "內部錯誤，請重試。" };

    const userRows = JSON.stringify(userR.result.values);
    const expRows = JSON.stringify(expR.result.values);

    if (userRows === expRows) return { correct: true, feedback: "✓ 查詢結果正確！", result: userR.result };
    if (userR.result.values.length !== expR.result.values.length) {
      return { correct: false, feedback: `結果筆數不對：你的查詢回傳 ${userR.result.values.length} 筆，正確應為 ${expR.result.values.length} 筆。請確認 WHERE 條件。`, result: userR.result };
    }
    return { correct: false, feedback: "查詢結果不符合預期，請確認條件或排序是否正確。", result: userR.result };
  }

  if (rule.checkType === "UPDATE_CHECK") {
    const r = runSqlSandbox(initialSql + " " + userSql, rule.checkQuery || `SELECT * FROM accounts WHERE account_id = ${rule.expectedValue?.account_id || 101};`);
    if (r.error) return { correct: false, feedback: "SQL 語法錯誤：" + r.error };

    // For update, just run and check final state
    const finalR = runSqlSandbox(initialSql + " " + userSql, "SELECT account_id, balance FROM accounts WHERE account_id = 101;");
    if (finalR.error) return { correct: false, feedback: "SQL 語法錯誤：" + finalR.error };
    if (!finalR.result || finalR.result.values.length === 0) return { correct: false, feedback: "找不到帳戶 101" };
    const balance = finalR.result.values[0][1];
    if (parseFloat(balance) === 17000) return { correct: true, feedback: "✓ 帳戶餘額更新成功！餘額為 17000。", result: finalR.result };
    return { correct: false, feedback: `帳戶 101 的餘額為 ${balance}，正確應為 17000。記得 12000 + 5000 = 17000。`, result: finalR.result };
  }

  return { correct: false, feedback: "無法批改此題目" };
}

// ─── NOSQL SANDBOX ────────────────────────────────────────────────────────────

function cloneCollections(cols) {
  return JSON.parse(JSON.stringify(cols));
}

function matchDoc(doc, filter) {
  for (const [k, v] of Object.entries(filter)) {
    if (k.includes(".")) {
      const parts = k.split(".");
      let val = doc;
      for (const p of parts) { val = val?.[p]; }
      if (val !== v) return false;
    } else {
      if (doc[k] !== v) return false;
    }
  }
  return true;
}

function runNoSqlSandbox(collections, code) {
  const state = cloneCollections(collections);
  const results = [];

  try {
    // Parse commands - support chaining
    const lines = code.trim().split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("//"));
    const fullCode = lines.join(" ");

    // Match: db.collection.operation(...)
    const cmdRegex = /db\.(\w+)\.(\w+)\((.+)\)(?:\.sort\((.+)\))?/g;
    let match;

    while ((match = cmdRegex.exec(fullCode)) !== null) {
      const [, colName, op, argsStr, sortStr] = match;
      const col = state[colName] || [];

      if (op === "find") {
        let filter = {};
        try { filter = JSON.parse(argsStr.replace(/'/g, '"').replace(/(\w+):/g, '"$1":').replace(/""(\w+)":/g, '"$1":')); } catch (e) {
          // try simpler parse
          if (argsStr.trim() === "{}") filter = {};
        }
        let docs = col.filter(d => matchDoc(d, filter));
        if (sortStr) {
          try {
            const sortObj = JSON.parse(sortStr.replace(/'/g, '"').replace(/(\w+):/g, '"$1":'));
            const [sortKey, sortDir] = Object.entries(sortObj)[0];
            docs = docs.sort((a, b) => sortDir === -1 ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
          } catch (e) {}
        }
        results.push({ type: "find", docs });

      } else if (op === "insertOne") {
        try {
          const docStr = argsStr.replace(/(\w+):/g, '"$1":').replace(/""(\w+)":/g, '"$1":').replace(/'/g, '"');
          const doc = JSON.parse(docStr);
          col.push(doc);
          state[colName] = col;
          results.push({ type: "insertOne", doc });
        } catch (e) {
          return { error: "JSON 格式錯誤：" + e.message };
        }

      } else if (op === "updateOne") {
        try {
          // Parse filter and update from args
          const parts = splitTopLevel(argsStr);
          if (parts.length < 2) return { error: "updateOne 需要兩個參數" };
          const filter = JSON.parse(safeJsonStr(parts[0]));
          const update = JSON.parse(safeJsonStr(parts[1]));

          const idx = col.findIndex(d => matchDoc(d, filter));
          if (idx === -1) return { error: "找不到符合條件的文件" };

          if (update.$inc) {
            for (const [k, v] of Object.entries(update.$inc)) {
              col[idx][k] = (col[idx][k] || 0) + v;
            }
          }
          if (update.$set) {
            for (const [k, v] of Object.entries(update.$set)) {
              col[idx][k] = v;
            }
          }
          if (update.$push) {
            for (const [k, v] of Object.entries(update.$push)) {
              if (!Array.isArray(col[idx][k])) col[idx][k] = [];
              col[idx][k].push(v);
            }
          }
          state[colName] = col;
          results.push({ type: "updateOne", modifiedCount: 1 });
        } catch (e) {
          return { error: "語法錯誤：" + e.message };
        }
      }
    }

    // Also handle chained .sort
    const sortChain = /db\.(\w+)\.find\((\{[^}]*\})\)\.sort\((\{[^}]*\})\)/g;
    // Already handled above in regex

    return { success: true, results, state };
  } catch (e) {
    return { error: e.message };
  }
}

function safeJsonStr(s) {
  s = s.trim();
  // Add quotes to unquoted keys
  s = s.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
  s = s.replace(/'/g, '"');
  return s;
}

function splitTopLevel(s) {
  const parts = [];
  let depth = 0, start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '{' || s[i] === '[') depth++;
    else if (s[i] === '}' || s[i] === ']') depth--;
    else if (s[i] === ',' && depth === 0) {
      parts.push(s.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(s.slice(start).trim());
  return parts;
}

function checkNoSqlAnswer(task, code) {
  const rule = task.expectedRule;
  const r = runNoSqlSandbox(task.collections, code);
  if (r.error) return { correct: false, feedback: "語法錯誤：" + r.error };

  if (rule.checkType === "DOCUMENT_COUNT") {
    const findResult = r.results?.find(x => x.type === "find");
    if (!findResult) return { correct: false, feedback: "請使用 find() 查詢文件。" };
    if (findResult.docs.length === rule.expectedCount) return { correct: true, feedback: `✓ 正確！查詢到 ${findResult.docs.length} 篇貼文。`, docs: findResult.docs };
    return { correct: false, feedback: `查詢到 ${findResult.docs.length} 篇，應為 ${rule.expectedCount} 篇。`, docs: findResult.docs };
  }

  if (rule.checkType === "DOCUMENT_IDS") {
    const findResult = r.results?.find(x => x.type === "find");
    if (!findResult) return { correct: false, feedback: "請使用 find() 查詢文件。" };
    const ids = findResult.docs.map(d => d._id).sort();
    const exp = [...rule.expectedIds].sort();
    if (JSON.stringify(ids) === JSON.stringify(exp)) return { correct: true, feedback: `✓ 正確！成功篩選出指定使用者的貼文。`, docs: findResult.docs };
    return { correct: false, feedback: `查詢結果不對，請確認篩選條件。目前得到 ${ids.length} 篇貼文。`, docs: findResult.docs };
  }

  if (rule.checkType === "INSERT_CHECK") {
    const col = r.state?.[rule.collectionName] || [];
    if (col.length >= rule.expectedCount) return { correct: true, feedback: "✓ 新增文件成功！" };
    return { correct: false, feedback: "新增失敗，請確認 insertOne() 語法是否正確。" };
  }

  if (rule.checkType === "UPDATE_CHECK") {
    const col = r.state?.posts || [];
    const doc = col.find(d => d._id === rule.docId);
    if (!doc) return { correct: false, feedback: "找不到指定文件" };
    if (doc[rule.field] === rule.expectedValue) return { correct: true, feedback: `✓ 更新成功！${rule.field} 現在是 ${doc[rule.field]}。` };
    return { correct: false, feedback: `${rule.field} 的值是 ${doc[rule.field]}，應為 ${rule.expectedValue}。` };
  }

  if (rule.checkType === "SORT_CHECK") {
    const findResult = r.results?.find(x => x.type === "find");
    if (!findResult || findResult.docs.length < 2) return { correct: false, feedback: "請確認查詢語法，並使用 .sort() 排序。" };
    const vals = findResult.docs.map(d => d[rule.sortField]);
    const sorted = rule.order === "desc" ? [...vals].sort((a, b) => b - a) : [...vals].sort((a, b) => a - b);
    if (JSON.stringify(vals) === JSON.stringify(sorted)) return { correct: true, feedback: `✓ 排序正確！已依照 ${rule.sortField} ${rule.order === "desc" ? "降序" : "升序"}排列。`, docs: findResult.docs };
    return { correct: false, feedback: `排序不正確。提示：降序排序使用 .sort({ ${rule.sortField}: -1 })`, docs: findResult.docs };
  }

  return { correct: false, feedback: "無法批改" };
}

// ─── AI FEEDBACK ──────────────────────────────────────────────────────────────

async function getAiFeedback(task, userCode, errorMsg) {
  const systemPrompt = `你是一位資料庫學習助教。請用繁體中文，以引導的方式提供簡短的學習提示（2-3句），不要直接給出答案，而是幫助學生理解問題所在。`;
  const userPrompt = `學生在完成以下任務時遇到問題：
任務：${task.title}
任務說明：${task.desc || task.scenario || ""}
學生的程式碼：
${userCode}
系統回饋：${errorMsg}
請給予引導性提示。`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt
    })
  });
  const data = await resp.json();
  const text = data.content?.map(c => c.text || "").join("") || "無法取得 AI 提示";
  return text;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ResultDisplay({ result, error, type }) {
  if (error) return <div className="result-error">⚠ {error}</div>;
  if (!result) return null;

  if (type === "nosql" && Array.isArray(result)) {
    return (
      <div className="result-json">
        {JSON.stringify(result, null, 2)}
      </div>
    );
  }

  if (result && result.columns && result.values) {
    return (
      <table className="result-table">
        <thead>
          <tr>{result.columns.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {result.values.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell === null ? <em style={{color:"var(--muted)"}}>NULL</em> : String(cell)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    );
  }
  return null;
}

function SchemaViewer({ schema, collections }) {
  if (collections) {
    return (
      <div>
        {Object.entries(collections).map(([name, docs]) => (
          <div key={name} className="schema-table">
            <div className="schema-table-name">📦 {name}</div>
            {docs.slice(0, 1).map((doc, i) => (
              <div key={i}>
                {Object.keys(doc).map(k => (
                  <div key={k} className="schema-col">
                    <span className="schema-col-name">{k}</span>
                    <span className="schema-col-type">{typeof doc[k] === "object" ? (Array.isArray(doc[k]) ? "Array" : "Object") : typeof doc[k]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!schema) return null;
  return (
    <div>
      {schema.map(tbl => (
        <div key={tbl.name} className="schema-table">
          <div className="schema-table-name">📋 {tbl.name}</div>
          {tbl.columns.map(col => (
            <div key={col.name} className="schema-col">
              <span className="schema-col-name">{col.name}</span>
              <span className="schema-col-type">{col.type}</span>
              {col.key && <span className="schema-col-key">{col.key}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [progress, setProgress] = useState({}); // taskId -> "correct" | "wrong"
  const [badges, setBadges] = useState(new Set());
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [sqlReady, setSqlReady] = useState(false);
  const [streak, setStreak] = useState(0);
  const [submissions, setSubmissions] = useState([]);

  // Load SQL.js
  useEffect(() => {
    if (window._sqlReady) { setSqlReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js";
    script.onload = () => {
      window.initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${f}` })
        .then(SQL => { window.SQL = SQL; window._sqlReady = true; setSqlReady(true); });
    };
    document.head.appendChild(script);
  }, []);

  const allTasks = COURSES.flatMap(c => c.lessons.flatMap(l => l.tasks));
  const completedCount = Object.values(progress).filter(v => v === "correct").length;
  const correctRate = submissions.length > 0 ? Math.round((submissions.filter(s => s.correct).length / submissions.length) * 100) : 0;

  function getCourseProgress(courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return 0;
    const tasks = course.lessons.flatMap(l => l.tasks);
    const done = tasks.filter(t => progress[t.id] === "correct").length;
    return tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  }

  function awardBadge(id) {
    setBadges(prev => { const s = new Set(prev); s.add(id); return s; });
  }

  function onTaskCorrect(taskId, taskType, courseId) {
    setProgress(prev => ({ ...prev, [taskId]: "correct" }));
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak >= 5) awardBadge("streak-5");

    if (taskType === "sql") {
      const task = allTasks.find(t => t.id === taskId);
      if (task?.title?.includes("建立")) awardBadge("first-table");
      if (task?.title?.includes("新增")) awardBadge("first-insert");
      if (task?.title?.includes("查詢")) awardBadge("first-select");
      if (task?.title?.includes("JOIN")) awardBadge("first-join");
    }
    if (taskType === "nosql") awardBadge("first-nosql");
    if (taskType === "selection") awardBadge("sel-complete");

    // Check course completion
    const course = COURSES.find(c => c.id === courseId);
    if (course) {
      const tasks = course.lessons.flatMap(l => l.tasks);
      const doneCount = tasks.filter(t => t.id === taskId || progress[t.id] === "correct").length;
      if (doneCount === tasks.length) {
        if (courseId === "sql") awardBadge("sql-complete");
        if (courseId === "nosql") awardBadge("nosql-complete");
      }
    }
  }

  // Find task context
  function getTaskContext(taskId) {
    for (const c of COURSES) {
      for (const l of c.lessons) {
        const t = l.tasks.find(t => t.id === taskId);
        if (t) return { course: c, lesson: l, task: t };
      }
    }
    return null;
  }

  const currentCtx = currentTask ? getTaskContext(currentTask) : null;
  const currentCourseData = currentCourse ? COURSES.find(c => c.id === currentCourse) : null;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="logo">DB<span>Lab</span></div>
          <nav className="header-nav">
            {["home", "courses", "dashboard"].map(p => (
              <button key={p} className={`nav-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
                {{ home: "首頁", courses: "課程", dashboard: "學習進度" }[p]}
              </button>
            ))}
          </nav>
          <div className="header-right">
            {badges.size > 0 && <span className="badge-count">🏅 {badges.size}</span>}
            <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Space Mono" }}>
              {sqlReady ? "✓ SQL 引擎就緒" : "⏳ 載入中..."}
            </span>
          </div>
        </header>

        {/* MAIN */}
        <div className="main">
          {/* SIDEBAR */}
          {page === "task" && currentCtx ? (
            <nav className="sidebar">
              <div className="sidebar-section">
                <button className="nav-btn" style={{ width: "100%", textAlign: "left", marginBottom: 8, fontSize: 11, color: "var(--muted)" }}
                  onClick={() => { setPage("courses"); setCurrentTask(null); }}>← 返回課程</button>
              </div>
              <div className="sidebar-section">
                <div className="sidebar-label">{currentCtx.course.title}</div>
                {currentCtx.lesson.tasks.map(t => (
                  <div key={t.id}
                    className={`task-item ${currentTask === t.id ? "active" : ""}`}
                    onClick={() => setCurrentTask(t.id)}>
                    <span style={{ flex: 1, fontSize: 11 }}>{t.title}</span>
                    <span className="task-status">
                      {progress[t.id] === "correct" ? "✓" : progress[t.id] === "wrong" ? "✗" : "○"}
                    </span>
                  </div>
                ))}
              </div>
            </nav>
          ) : (
            <nav className="sidebar">
              <div className="sidebar-section">
                <div className="sidebar-label">情境課程</div>
                {COURSES.map(c => (
                  <div key={c.id}
                    className={`course-item ${currentCourse === c.id ? "active" : ""}`}
                    onClick={() => { setCurrentCourse(c.id); setPage("courses"); }}>
                    <div className="course-dot" style={{ background: c.color }} />
                    <div className="course-info">
                      <div className="course-name">{c.title}</div>
                      <div className="course-meta">{c.type}</div>
                      <div className="progress-mini">
                        <div className="progress-mini-fill" style={{ width: `${getCourseProgress(c.id)}%`, background: c.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </nav>
          )}

          {/* CONTENT */}
          <main className="content">
            {page === "home" && <HomePage onStart={() => setPage("courses")} onCourse={(id, tid) => { setCurrentCourse(id); setCurrentTask(tid); setPage("task"); }} />}
            {page === "courses" && (
              <CoursesPage
                courses={COURSES}
                progress={progress}
                getCourseProgress={getCourseProgress}
                onSelectTask={(courseId, taskId) => { setCurrentCourse(courseId); setCurrentTask(taskId); setPage("task"); }}
              />
            )}
            {page === "task" && currentCtx && (
              <TaskWorkspace
                key={currentTask}
                task={currentCtx.task}
                courseId={currentCtx.course.id}
                isDone={progress[currentTask] === "correct"}
                sqlReady={sqlReady}
                onCorrect={(type) => {
                  onTaskCorrect(currentTask, type, currentCtx.course.id);
                  setSubmissions(prev => [...prev, { taskId: currentTask, correct: true }]);
                }}
                onWrong={() => {
                  setProgress(prev => ({ ...prev, [currentTask]: "wrong" }));
                  setStreak(0);
                  setSubmissions(prev => [...prev, { taskId: currentTask, correct: false }]);
                }}
                onNext={() => {
                  const tasks = currentCtx.lesson.tasks;
                  const idx = tasks.findIndex(t => t.id === currentTask);
                  if (idx < tasks.length - 1) setCurrentTask(tasks[idx + 1].id);
                  else { setPage("courses"); }
                }}
              />
            )}
            {page === "dashboard" && (
              <DashboardPage
                completedCount={completedCount}
                correctRate={correctRate}
                totalSubmissions={submissions.length}
                badges={badges}
                progress={progress}
                allTasks={allTasks}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ onStart, onCourse }) {
  const scenarios = [
    { icon: "🏦", name: "銀行系統", db: "SQL", color: "#00e5ff", id: "sql", tid: "sql-t1" },
    { icon: "💬", name: "社群平台", db: "NoSQL 文件型", color: "#a78bfa", id: "nosql", tid: "nosql-t1" },
    { icon: "🧭", name: "資料庫選型", db: "互動測驗", color: "#34d399", id: "sel", tid: "sel-t1" }
  ];

  return (
    <div className="home-page">
      <div style={{ maxWidth: 600, width: "100%" }}>
        <div className="hero-title">DB Lab</div>
        <p className="hero-sub">
          情境式互動資料庫學習平台。在真實系統情境中學習 SQL、NoSQL 與資料庫選型，從銀行系統到社群平台。
        </p>

        <div className="scenario-cards">
          {scenarios.map(s => (
            <div key={s.id} className="scenario-card" onClick={() => onCourse(s.id, s.tid)}>
              <div className="scenario-icon">{s.icon}</div>
              <div className="scenario-name">{s.name}</div>
              <div className="scenario-db" style={{ color: s.color }}>{s.db}</div>
            </div>
          ))}
        </div>

        <button className="btn btn-submit" style={{ padding: "10px 32px", fontSize: 14 }} onClick={onStart}>
          開始學習 →
        </button>

        <div style={{ marginTop: 24, display: "flex", gap: 20, justifyContent: "center", color: "var(--muted)", fontSize: 12 }}>
          <span>📊 即時 SQL 執行</span>
          <span>📄 NoSQL 模擬器</span>
          <span>🤖 AI 學習助教</span>
        </div>
      </div>
    </div>
  );
}

// ─── COURSES PAGE ─────────────────────────────────────────────────────────────
function CoursesPage({ courses, progress, getCourseProgress, onSelectTask }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (selectedCourse) {
    const c = courses.find(x => x.id === selectedCourse);
    return (
      <div className="courses-page">
        <button className="nav-btn" style={{ marginBottom: 14, color: "var(--muted)", fontSize: 12 }} onClick={() => setSelectedCourse(null)}>← 返回</button>
        <div className="page-title">{c.icon} {c.title}</div>
        <p className="page-sub">{c.desc}</p>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>完成進度：{getCourseProgress(c.id)}%</div>
          <div className="progress-bar" style={{ maxWidth: 300 }}>
            <div className="progress-fill" style={{ width: `${getCourseProgress(c.id)}%`, background: c.color }} />
          </div>
        </div>
        <div className="section-title">任務列表</div>
        {c.lessons.flatMap(l => l.tasks).map((task, i) => (
          <div key={task.id} onClick={() => onSelectTask(c.id, task.id)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 8, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--muted)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
            <span style={{ fontFamily: "Space Mono", fontSize: 12, color: "var(--muted)", width: 28 }}>
              {progress[task.id] === "correct" ? "✓" : i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: progress[task.id] === "correct" ? "var(--accent3)" : "var(--text)" }}>{task.title}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                {task.type === "sql" ? "SQL 實作" : task.type === "nosql" ? "NoSQL 實作" : "選型分析"}
              </div>
            </div>
            <span className={`tag tag-${task.type === "sql" ? "sql" : task.type === "nosql" ? "nosql" : "selection"}`}>
              {task.type.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="page-title">課程總覽</div>
      <p className="page-sub">選擇一個情境開始學習資料庫</p>
      <div className="courses-grid">
        {courses.map(c => (
          <div key={c.id} className="course-card" onClick={() => setSelectedCourse(c.id)}>
            <div className="course-card-accent" style={{ background: c.color }} />
            <div className="course-card-type" style={{ color: c.color }}>{c.type}</div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div className="course-card-title">{c.title}</div>
            <div className="course-card-desc">{c.desc}</div>
            <div>
              <div className="course-card-footer">
                <span className="course-card-progress">{getCourseProgress(c.id)}% 完成</span>
                <span style={{ fontSize: 11, color: c.color }}>{c.level}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${getCourseProgress(c.id)}%`, background: c.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TASK WORKSPACE ───────────────────────────────────────────────────────────
function TaskWorkspace({ task, courseId, isDone, sqlReady, onCorrect, onWrong, onNext }) {
  const [code, setCode] = useState(task.starterCode || "");
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hintLevel, setHintLevel] = useState(-1);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [rightTab, setRightTab] = useState("schema");

  // Selection task state
  const [selectedDb, setSelectedDb] = useState(null);

  function handleRun() {
    if (task.type === "sql") {
      if (!sqlReady) { setRunError("SQL 引擎載入中..."); return; }
      setIsRunning(true);
      setTimeout(() => {
        const r = runSqlSandbox(task.initialSql || "", code);
        if (r.error) { setRunError(r.error); setRunResult(null); }
        else { setRunResult(r.result); setRunError(null); }
        setIsRunning(false);
      }, 50);
    } else if (task.type === "nosql") {
      setIsRunning(true);
      setTimeout(() => {
        const r = runNoSqlSandbox(task.collections, code);
        if (r.error) { setRunError(r.error); setRunResult(null); }
        else {
          const docs = r.results?.find(x => x.type === "find")?.docs;
          setRunResult(docs || r.results?.[0] || null);
          setRunError(null);
        }
        setIsRunning(false);
      }, 50);
    }
  }

  function handleSubmit() {
    setIsSubmitting(true);
    setAiFeedback(null);

    setTimeout(() => {
      let result;
      if (task.type === "sql") {
        if (!sqlReady) { setSubmitResult({ correct: false, feedback: "SQL 引擎載入中，請稍後" }); setIsSubmitting(false); return; }
        result = checkSqlAnswer(task, code);
      } else if (task.type === "nosql") {
        result = checkNoSqlAnswer(task, code);
        if (result.docs) { setRunResult(result.docs); }
      } else if (task.type === "selection") {
        result = checkSelectionAnswer(task, selectedDb);
      }

      setSubmitResult(result);
      if (result.correct) onCorrect(task.type);
      else {
        onWrong();
        // Get AI feedback
        setLoadingAi(true);
        getAiFeedback(task, code, result.feedback).then(ai => {
          setAiFeedback(ai);
          setLoadingAi(false);
        }).catch(() => setLoadingAi(false));
      }
      setIsSubmitting(false);
    }, 100);
  }

  function checkSelectionAnswer(task, selected) {
    if (selected === null) return { correct: false, feedback: "請先選擇一個資料庫選項。" };
    if (selected !== task.correctAnswer) {
      return { correct: false, feedback: `選擇不正確。${task.explanation}` };
    }
    return { correct: true, feedback: `✓ 正確！${task.explanation}` };
  }

  const isSelection = task.type === "selection";
  const hasRun = runResult !== null || runError !== null;

  return (
    <div className="workspace">
      <div className="workspace-left">
        {/* Task header */}
        <div className="task-header">
          <div className="task-tags">
            <span className={`tag tag-${task.type === "sql" ? "sql" : task.type === "nosql" ? "nosql" : "selection"}`}>
              {task.type.toUpperCase()}
            </span>
            {isDone && <span className="tag" style={{ background: "rgba(16,185,129,.1)", color: "var(--accent3)", border: "1px solid rgba(16,185,129,.2)" }}>✓ 完成</span>}
          </div>
          <div className="task-title">{task.title}</div>
          <div className="task-desc">{task.desc || task.scenario}</div>
        </div>

        {/* Editor or Selection */}
        {isSelection ? (
          <div className="selection-task" style={{ overflow: "auto" }}>
            <div className="selection-q">{task.question}</div>
            <div className="db-options">
              {task.options.map((opt, i) => (
                <div key={i}
                  className={`db-option ${selectedDb === i ? (i === 0 ? "selected" : i === 1 ? "selected-nosql" : "selected-mixed") : ""}`}
                  onClick={() => setSelectedDb(i)}>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="editor-container">
            <div className="editor-tabs">
              <button className="editor-tab active">
                {task.type === "sql" ? "SQL" : "NoSQL"}
              </button>
            </div>
            <div className="editor-wrap">
              <textarea
                className="code-editor"
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>
          </div>
        )}

        {/* Hint */}
        {hintLevel >= 0 && task.hints && task.hints[hintLevel] && (
          <div className="hint-box">
            <div className="hint-label">💡 提示 {hintLevel + 1}/{task.hints.length}</div>
            {task.hints[hintLevel]}
          </div>
        )}

        {/* Action bar */}
        <div className="action-bar">
          {!isSelection && (
            <button className="btn btn-run" onClick={handleRun} disabled={isRunning || !sqlReady}>
              {isRunning ? "執行中..." : "▷ 執行"}
            </button>
          )}
          <button className="btn btn-submit" onClick={handleSubmit} disabled={isSubmitting || isDone}>
            {isSubmitting ? "批改中..." : isDone ? "✓ 已完成" : "提交答案"}
          </button>
          {task.hints && task.hints.length > 0 && (
            <button className="btn btn-hint" onClick={() => setHintLevel(prev => Math.min(prev + 1, task.hints.length - 1))}>
              💡 提示
            </button>
          )}
          {!isSelection && (
            <button className="btn btn-reset" onClick={() => { setCode(task.starterCode || ""); setRunResult(null); setRunError(null); setSubmitResult(null); }}>
              重設
            </button>
          )}
          {isDone && (
            <button className="btn btn-next" onClick={onNext} style={{ marginLeft: "auto" }}>
              下一題 →
            </button>
          )}
        </div>

        {/* Results */}
        {(hasRun || submitResult || loadingAi) && (
          <div className="result-panel">
            {submitResult && (
              <div className={`feedback-panel ${submitResult.correct ? "feedback-success" : "feedback-error"}`}>
                {submitResult.feedback}
              </div>
            )}
            {loadingAi && (
              <div className="feedback-thinking">
                <div className="spinner" />
                AI 助教分析中...
              </div>
            )}
            {aiFeedback && (
              <div className="feedback-panel feedback-ai">
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase", color: "var(--nosql-color)" }}>🤖 AI 助教</div>
                {aiFeedback}
              </div>
            )}
            {hasRun && !isSelection && (
              <>
                <div className="result-header">
                  <div className={`result-status`} style={{ background: runError ? "var(--danger)" : "var(--accent3)" }} />
                  執行結果
                </div>
                {task.type === "nosql" && Array.isArray(runResult) ? (
                  <div className="result-json">{JSON.stringify(runResult, null, 2)}</div>
                ) : (
                  <ResultDisplay result={runResult} error={runError} type={task.type} />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="workspace-right">
        <div className="right-tabs">
          <button className={`right-tab ${rightTab === "schema" ? "active" : ""}`} onClick={() => setRightTab("schema")}>
            結構
          </button>
          {task.type === "nosql" && (
            <button className={`right-tab ${rightTab === "docs" ? "active" : ""}`} onClick={() => setRightTab("docs")}>
              文件
            </button>
          )}
          <button className={`right-tab ${rightTab === "info" ? "active" : ""}`} onClick={() => setRightTab("info")}>
            說明
          </button>
        </div>
        <div className="right-content">
          {rightTab === "schema" && (
            <SchemaViewer
              schema={task.schema}
              collections={task.type === "nosql" ? task.collections : null}
            />
          )}
          {rightTab === "docs" && task.type === "nosql" && (
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#a0b4c8", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {JSON.stringify(task.collections, null, 2)}
            </div>
          )}
          {rightTab === "info" && (
            <div style={{ fontSize: 12, lineHeight: 1.7, color: "var(--muted)" }}>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>通過條件</div>
              <div style={{ background: "var(--surface2)", borderRadius: 6, padding: 10, fontSize: 11, fontFamily: "Space Mono" }}>
                {JSON.stringify(task.expectedRule, null, 2)}
              </div>
              {task.type === "selection" && (
                <>
                  <div style={{ fontWeight: 700, color: "var(--text)", margin: "14px 0 8px" }}>關鍵概念</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {task.requiredKeywords?.map(k => (
                      <span key={k} className="tag tag-selection">{k}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ completedCount, correctRate, totalSubmissions, badges, progress, allTasks }) {
  return (
    <div className="dashboard-page">
      <div className="page-title">學習進度</div>
      <p className="page-sub">你的資料庫學習歷程</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val" style={{ color: "var(--accent)" }}>{completedCount}</div>
          <div className="stat-label">完成任務</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: "var(--accent3)" }}>{totalSubmissions}</div>
          <div className="stat-label">總提交次數</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: "var(--warn)" }}>{correctRate}%</div>
          <div className="stat-label">答題正確率</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: "var(--nosql-color)" }}>{badges.size}</div>
          <div className="stat-label">獲得徽章</div>
        </div>
      </div>

      <div className="section-title">成就徽章</div>
      <div className="badges-grid">
        {BADGES.map(b => (
          <div key={b.id} className={`badge-card ${badges.has(b.id) ? "earned" : ""}`}>
            <div className="badge-icon">{b.icon}</div>
            <div className="badge-name">{b.name}</div>
            <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 3 }}>{b.desc}</div>
          </div>
        ))}
      </div>

      <div className="divider" />
      <div className="section-title">任務完成狀況</div>
      {allTasks.map(t => (
        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
          <span style={{ color: progress[t.id] === "correct" ? "var(--accent3)" : progress[t.id] === "wrong" ? "var(--danger)" : "var(--muted)", fontFamily: "Space Mono", fontSize: 11, width: 16 }}>
            {progress[t.id] === "correct" ? "✓" : progress[t.id] === "wrong" ? "✗" : "○"}
          </span>
          <span style={{ color: progress[t.id] === "correct" ? "var(--text)" : "var(--muted)" }}>{t.title}</span>
          <span className={`tag tag-${t.type === "sql" ? "sql" : t.type === "nosql" ? "nosql" : "selection"}`} style={{ marginLeft: "auto" }}>
            {t.type.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}
