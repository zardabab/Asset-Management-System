# 財產管理系統 (Asset Management System)

## 專案概述 (Project Overview)
這是一個基於 Web 的財產管理系統，旨在協助管理組織內部的資產庫存。系統支援透過瀏覽器 **LocalStorage** 進行單機管理，或透過 **Google Sheets API** 進行多人協作與雲端同步。

**版本**: 1.0.0
**更新日期**: 2025年12月29日

## 技術堆疊 (Tech Stack)
- **Frontend Core**: HTML5, CSS3 (Modern/Responsive), JavaScript (ES6+).
- **Libraries**:
  - **jQuery 3.6.0**: DOM 操作、事件處理、AJAX 請求。
  - **SheetJS (XLSX)**: 用於將資產清單匯出為 Excel 檔案。
- **Backend / Storage**:
  - **Local Mode**: 瀏覽器 LocalStorage (JSON 格式)。
  - **Cloud Mode**: Google Sheets (作為資料庫) + Google Apps Script (作為 API 介面)。

## 檔案結構 (File Structure)
```
/
├── index.html                  # 應用程式主頁面 (UI 結構)
├── styles.css                  # 樣式表 (CSS Grid/Flexbox, 變數定義)
├── app.js                      # 核心應用程式邏輯 (CRUD, 同步, 渲染)
├── config.js                   # 全域設定檔 (API URL, 儲存模式切換)
├── GoogleAppsScript.js         # Google Apps Script 原始碼 (部署於 GAS 端)
├── data.csv                    # (可選) 原始資料備份或範例
├── Google_Sheets_設定指南.md     # Google Sheets 整合教學
├── GEMINI.md                   # 本文件 (專案說明)
└── README.md                   # 專案一般說明
```

## 資料模型 (Data Model)
系統主要管理 `assetsData` 陣列，每筆資產包含以下欄位：

| 欄位名稱 (Key) | 顯示名稱 (Label) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| `deepAssetNo` | 深耕財產編號 | String | 主要識別碼之一 |
| `hospitalAssetNo` | 醫院財產編號 | String | 次要識別碼 |
| `assetName` | 財產名稱 | String | 資產名稱 |
| `specification` | 規格/型號 | String | 詳細規格 |
| `quantity` | 數量 | Integer | |
| `unit` | 財產單位 | String | e.g., 工務, 管理課 |
| `purchaseDate` | 購入/申請日期 | Date String | YYYY/MM/DD |
| `acquireDate` | 取得日期 | Date String | |
| `usefulLife` | 耐用年限 | String | |
| `cost` | 取得成本 | Number | |
| `department` | 保管單位 | String | |
| `keeper` | 保管人 | String | 負責人姓名 |
| `location` | 所在地點 | String | |
| `supplier` | 供應商 | String | |
| `warrantyVendor`| 保固合約-廠商 | String | |
| `warrantyPeriod`| 保固合約-期間 | String | |
| `notes` | 備註 | String | 其他說明 |

## 設定與部署 (Configuration)

### 1. 本地模式 (Local Mode)
適合單人使用，資料僅存在當前瀏覽器。
- 修改 `config.js`:
  ```javascript
  const USE_LOCAL_STORAGE = true;
  ```

### 2. Google Sheets 雲端模式 (Cloud Mode)
適合多人檢視與管理。
1. 建立 Google Sheet 並依據 `data` 格式設定標題列。
2. 建立 Google Apps Script 專案，貼上 `GoogleAppsScript.js` 內容。
3. 部署 GAS 為「網路應用程式 (Web App)」，權限設為「任何人 (Anyone)」。
4. 修改 `config.js`:
   ```javascript
   const CONFIG = {
       SPREADSHEET_ID: 'YOUR_SHEET_ID',
       WEB_APP_URL: 'YOUR_GAS_WEB_APP_URL'
   };
   const USE_LOCAL_STORAGE = false;
   ```

## 核心功能說明 (Key Features)

- **資料載入 (`loadData`)**: 根據模式從 LocalStorage 或 GAS API 獲取資料。
- **渲染與篩選 (`renderTable`, `filterData`)**: 支援關鍵字搜尋 (`searchInput`) 與多條件下拉篩選 (單位、保管人、地點)。
- **同步機制 (`syncToGoogleSheets`)**: 
  - 透過 AJAX (JSONP) 與 GAS 溝通。
  - 支援 `action=sync` (單向同步) 或 `action=updateAll` (完整覆蓋)。
- **Excel 匯出 (`exportToExcel`)**: 使用 XLSX 套件將當前資產列表打包下載。

## 開發指南 (Development)
- 若要修改欄位，需同步更新 `index.html` (表格與 Modal 表單)、`app.js` (資料對顯與初始值) 及 `GoogleAppsScript.js` (後端處理)。
- 樣式修改集中於 `styles.css`，採用 CSS Variables 管理主題色。
