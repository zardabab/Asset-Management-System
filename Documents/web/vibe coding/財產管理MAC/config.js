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
    // 例如：https://docs.google.com/spreadsheets/d/【這裡的ID】/edit
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
    
    // Google API 金鑰
    API_KEY: 'YOUR_API_KEY',
    
    // 工作表名稱
    SHEET_NAME: '財產清單',
    
    // API 端點
    get API_URL() {
        return `https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${this.SHEET_NAME}?key=${this.API_KEY}`;
    }
};

// 如果不想使用 Google Sheets，也可以使用本地儲存
const USE_LOCAL_STORAGE = true; // 設為 true 使用本地儲存，false 使用 Google Sheets
