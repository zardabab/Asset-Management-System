// Google Sheets API 配置
// 請按照以下步驟設置：
// 1. 前往 https://console.cloud.google.com/
// 2. 建立新專案或選擇現有專案
// 3. 啟用 Google Sheets API
// 4. 建立 API 金鑰（憑證）
// 5. 建立 Google Sheets 並設為「知道連結的任何人都可以檢視」
// 6. 將試算表 ID 和 API 金鑰填入下方

const CONFIG = {
    // Google Sheets 試算表 ID（從網址中取得）
    SPREADSHEET_ID: '1pkd8p9PQ5rLZMt8f0082OslI7IOLkuSQJgUCIuxEo88',

    // Google Apps Script Web App URL（需要部署後取得）
    // 請在 Google Sheets 中建立 Apps Script 並部署為網路應用程式
    // 注意：USE_LOCAL_STORAGE = true 時不會使用此 URL
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwcHojuscZbOWU87TXpu_5BftLwYhYNK37VADerc3h_rYo8rjOSH3HSrWyDsQEOZOlA/exec',

    // 工作表 GIDZ
    SHEET_GID: '0',

    // 工作表名稱
    SHEET_NAME: '財產清單'
};

// 如果不想使用 Google Sheets，也可以使用本地儲存
const USE_LOCAL_STORAGE = false; // 設為 true 使用本地儲存，false 使用 Google Sheets
