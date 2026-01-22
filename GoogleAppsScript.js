/**
 * Google Apps Script 後端程式
 * 
 * 部署步驟：
 * 1. 開啟 Google Sheets: https://docs.google.com/spreadsheets/d/1x32_JhOr0BTeoiS3gaw48Le8mJtiwd597DOjKyInoeU/edit
 * 2. 點選「擴充功能」→「Apps Script」
 * 3. 將此程式碼貼上
 * 4. 點選「部署」→「管理部署作業」→「編輯」現有部署
 * 5. 版本選擇「新版本」
 * 6. 點選「部署」
 * 7. 使用相同的網址即可
 */

// 試算表ID和工作表名稱
const SPREADSHEET_ID = '1pkd8p9PQ5rLZMt8f0082OslI7IOLkuSQJgUCIuxEo88';
const SHEET_NAME = '財產清單'; // 請確認工作表名稱

/**
 * 處理 GET 請求 - 讀取資料或執行操作
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return createJsonResponse({
        error: '找不到工作表: ' + SHEET_NAME
      }, e);
    }
    
    // 檢查是否有操作請求
    const action = e.parameter && e.parameter.action ? e.parameter.action : 'read';
    
    if (action === 'read') {
      // 讀取所有資料
      const data = sheet.getDataRange().getValues();
      return createJsonResponse({
        success: true,
        data: data
      }, e);
    } else if (action === 'updateAll' || action === 'sync') {
      // 同步或更新整個工作表
      try {
        let dataStr = e.parameter && e.parameter.data ? e.parameter.data : '[]';
        
        const data = JSON.parse(dataStr);
        
        // 檢查數據格式
        if (!Array.isArray(data)) {
          return createJsonResponse({
            error: '無效的數據格式'
          }, e);
        }
        
        // 清除現有資料（保留標題）
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          sheet.deleteRows(2, lastRow - 1);
        }
        
        // 寫入新資料
        if (data.length > 0) {
          // 如果有標題行，跳過；否則添加標題
          const startData = data[0] && data[0].includes('深耕財產編號') ? data.slice(1) : data;
          
          if (startData.length > 0) {
            sheet.getRange(2, 1, startData.length, startData[0].length).setValues(startData);
          }
        }
        
        return createJsonResponse({
          success: true,
          message: '資料更新成功'
        }, e);
        
      } catch (error) {
        return createJsonResponse({
          error: '更新失敗: ' + error.toString()
        }, e);
      }
    } else {
      return createJsonResponse({
        error: '未知的操作: ' + action
      }, e);
    }
    
  } catch (error) {
    return createJsonResponse({
      error: error.toString()
    }, e);
  }
}

/**
 * 處理 POST 請求 - 寫入資料
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return createJsonResponse({
        error: '找不到工作表: ' + SHEET_NAME
      }, e);
    }
    
    // 解析請求資料 - 支援 JSONP 格式
    let requestData;
    
    if (e.postData && e.postData.contents) {
      // JSON 格式
      requestData = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      // JSONP/URL 參數格式
      requestData = JSON.parse(e.parameter.data);
      if (!requestData.action && e.parameter.action) {
        requestData.action = e.parameter.action;
      }
    } else {
      // 嘗試從參數中取得 action
      requestData = {
        action: e.parameter.action || 'updateAll',
        data: e.parameter.data ? JSON.parse(e.parameter.data) : []
      };
    }
    
    const action = requestData.action || 'updateAll';
    let result;
    
    switch (action) {
      case 'updateAll':
        // 更新整個工作表
        result = updateAllData(sheet, requestData.data);
        break;
        
      case 'addRow':
        // 新增一行
        result = addRow(sheet, requestData.row);
        break;
        
      case 'updateRow':
        // 更新特定行
        result = updateRow(sheet, requestData.index, requestData.row);
        break;
        
      case 'deleteRow':
        // 刪除特定行
        result = deleteRow(sheet, requestData.index);
        break;
        
      default:
        result = { error: '未知的操作: ' + action };
    }
    
    return createJsonResponse(result, e);
    
  } catch (error) {
    return createJsonResponse({
      error: error.toString()
    }, e);
  }
}

/**
 * 建立 JSON 回應 - 支援 JSONP 和 CORS
 */
function createJsonResponse(data, e) {
  const callback = e && e.parameter && e.parameter.callback ? e.parameter.callback : null;
  let output;
  
  // 如果有 callback 參數，使用 JSONP
  if (callback && /^[a-zA-Z0-9_.$]+$/.test(callback)) {
    output = ContentService.createTextOutput(callback + '(' + JSON.stringify(data) + ')');
    output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // 否則使用 JSON
    output = ContentService.createTextOutput(JSON.stringify(data));
    output.setMimeType(ContentService.MimeType.JSON);
  }
  
  return output;
}

/**
 * 處理 OPTIONS 請求（CORS preflight）
 */
function doOptions(e) {
  return ContentService.createTextOutput('');
}

/**
 * 更新整個工作表資料
 */
function updateAllData(sheet, data) {
  try {
    // 清除現有資料（保留標題）
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    // 寫入新資料（不包含標題）
    if (data.length > 1) {
      sheet.getRange(2, 1, data.length - 1, data[0].length).setValues(data.slice(1));
    }
    
    return { success: true, message: '資料更新成功' };
  } catch (error) {
    return { error: error.toString() };
  }
}

/**
 * 新增一行
 */
function addRow(sheet, row) {
  try {
    sheet.appendRow(row);
    return { success: true, message: '資料新增成功' };
  } catch (error) {
    return { error: error.toString() };
  }
}

/**
 * 更新特定行
 */
function updateRow(sheet, index, row) {
  try {
    // index 是從 0 開始，但工作表是從 1 開始，且第 1 行是標題
    const rowNumber = index + 2;
    sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
    return { success: true, message: '資料更新成功' };
  } catch (error) {
    return { error: error.toString() };
  }
}

/**
 * 刪除特定行
 */
function deleteRow(sheet, index) {
  try {
    // index 是從 0 開始，但工作表是從 1 開始，且第 1 行是標題
    const rowNumber = index + 2;
    sheet.deleteRow(rowNumber);
    return { success: true, message: '資料刪除成功' };
  } catch (error) {
    return { error: error.toString() };
  }
}
