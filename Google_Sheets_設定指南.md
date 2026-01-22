# Google Sheets 連動設定指南

## 步驟 1: 準備 Google Sheets

1. 開啟你的 Google Sheets：
   https://docs.google.com/spreadsheets/d/1x32_JhOr0BTeoiS3gaw48Le8mJtiwd597DOjKyInoeU/edit

2. 確認工作表名稱為 "Sheet2" (或在 GoogleAppsScript.js 中修改對應的名稱)

3. 確保第一行是標題行，包含以下欄位：
   - 深耕財產編號
   - 醫院財產編號
   - 財產名稱
   - 規格/型號
   - 數量
   - 財產單位
   - 購入/申請日期
   - 取得日期
   - 耐用年限
   - 取得成本
   - 保管單位
   - 保管人
   - 所在地點
   - 供應商
   - 保固合約-廠商
   - 保固合約-期間
   - 備註

## 步驟 2: 建立 Google Apps Script

1. 在 Google Sheets 中，點選「擴充功能」→「Apps Script」

2. 刪除預設的程式碼

3. 複製 `GoogleAppsScript.js` 的所有內容並貼上

4. 點選「儲存」(磁碟圖示)

## 步驟 3: 部署為網路應用程式

1. 點選「部署」→「新增部署作業」

2. 在「選取類型」中選擇「網路應用程式」

3. 設定說明：輸入「財產管理系統後端」

4. **執行身分**：選擇「我」

5. **存取權限**：選擇「所有人」

6. 點選「部署」

7. **重要**：複製「網路應用程式網址」
   - 格式類似：https://script.google.com/macros/s/xxx.../exec

8. 如果出現權限警告：
   - 點選「審查權限」
   - 選擇你的 Google 帳號
   - 點選「進階」
   - 點選「前往[專案名稱] (不安全)」
   - 點選「允許」

## 步驟 4: 更新 config.js

1. 開啟 `config.js` 檔案

2. 將複製的網路應用程式網址填入：
   ```javascript
   WEB_APP_URL: 'https://script.google.com/macros/s/你的網址/exec',
   ```

3. 將 `USE_LOCAL_STORAGE` 改為 `false`：
   ```javascript
   const USE_LOCAL_STORAGE = false;
   ```

## 步驟 5: 測試連動

1. 開啟 `index.html` (用瀏覽器開啟)

2. 點選「重新整理」按鈕，確認能載入 Google Sheets 的資料

3. 測試新增一筆資料，然後到 Google Sheets 確認是否同步

4. 測試編輯和刪除功能

## 常見問題

### Q: 顯示「未設定 Web App URL」

A: 請確認已完成步驟 3 和步驟 4

### Q: 載入資料失敗

A: 檢查以下項目：
- Apps Script 是否正確部署
- WEB_APP_URL 是否正確填入
- Google Sheets 的工作表名稱是否為 "Sheet2"
- 瀏覽器控制台是否有錯誤訊息

### Q: 權限錯誤

A: 重新部署 Apps Script，並確保「存取權限」選擇「所有人」

### Q: 資料沒有同步

A: 
1. 開啟瀏覽器開發者工具 (F12)
2. 查看 Console 是否有錯誤訊息
3. 確認網路請求是否成功

### Q: 想要改回本地儲存模式

A: 在 `config.js` 中將 `USE_LOCAL_STORAGE` 改為 `true`

## 注意事項

1. **首次載入時間**：Apps Script 冷啟動可能需要 5-10 秒
2. **配額限制**：Google Apps Script 有每日使用配額限制
3. **資料安全**：部署時選擇「所有人」可存取，請注意資料安全
4. **同步延遲**：寫入 Google Sheets 後需要約 1-2 秒才會完成

## 如何更新 Apps Script

如果需要修改後端邏輯：

1. 在 Google Sheets 中開啟「擴充功能」→「Apps Script」
2. 修改程式碼
3. 儲存
4. 點選「部署」→「管理部署作業」
5. 點選現有部署旁的「編輯」(鉛筆圖示)
6. 版本選擇「新版本」
7. 點選「部署」
