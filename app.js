// 財產管理系統主程式
let assetsData = [];
let filteredData = [];
let editingIndex = -1;

// 初始資料
const initialData = [
    ["60702-14", "60702-14", "30*120格板", "D30*W120", "2", "工務", "", "114/10/20", "", "", "深耕", "宛縈", "深耕辦公室", "院內資材", "", "", ""],
    ["60702-14", "60702-14", "105*120格板", "D105*W120", "1", "工務", "", "114/10/20", "", "", "深耕", "宛縈", "深耕辦公室", "院內資材", "", "", ""],
    ["60702-14", "60702-14", "100*60桌子", "D60*W100", "1", "工務", "", "114/10/20", "", "", "深耕", "宛縈", "深耕辦公室", "院內資材", "", "", ""],
    ["60702-14", "60702-14", "45*90格板", "D45*W90", "4", "工務", "", "114/10/1", "", "", "深耕", "宜泰", "深耕辦公室", "院內資材", "", "", ""],
    ["60702-14", "60702-14", "90*90格板", "D90*W90", "2", "工務", "", "114/10/1", "", "", "深耕", "宜泰", "深耕辦公室", "院內資材", "", "", ""],
    ["60702-14", "60702-14", "90*45桌子", "D90*W45", "2", "工務", "", "114/10/1", "", "", "深耕", "宜泰", "深耕辦公室", "院內資材", "", "", ""],
    ["60702-13", "60702-13", "世紀 U型活動櫃高牆(三層鐵櫃)", "D57*W40*H65", "5", "管理課", "", "114/10/23", "", "", "深耕", "曉慧", "深耕辦公室", "院內資材", "", "", ""],
    ["消耗品", "消耗品", "原廠碳粉夾BRO THER TN-459Y黃色", "THER TN-459Y", "1", "管理課", "", "114/11/7", "", "", "深耕", "曉慧", "深耕辦公室", "院內資材", "", "", ""],
    ["消耗品", "消耗品", "原廠碳粉夾BRO THER TN-459M紅色", " THER TN-459M", "1", "管理課", "", "114/11/7", "", "", "深耕", "曉慧", "深耕辦公室", "院內資材", "", "", ""],
    ["消耗品", "消耗品", "原廠碳粉夾BRO THER TN-459C藍色", "THER TN-459C", "1", "管理課", "", "114/11/7", "", "", "深耕", "曉慧", "深耕辦公室", "院內資材", "", "", ""],
    ["消耗品", "消耗品", "原廠碳粉夾BRO THER TN-459BK黑色", "THER TN-459BK", "1", "管理課", "", "114/11/7", "", "", "深耕", "曉慧", "深耕辦公室", "院內資材", "", "", ""],
    ["60102-01", "60102-01", "機器8900彩雷一台", "", "1", "管理課", "", "114/11/7", "", "", "深耕", "曉慧", "深耕辦公室", "院內資材", "", "", ""],
    ["60112-14-01", "60112-14-01", "KSLTC2513電腦主機", "", "", "長照科", "", "114/11/1", "", "", "深耕", "宛縈", "深耕辦公室", "院內資材", "", "", ""],
    ["60112-11", "60112-11", "液晶銀幕LCD19吋(4:3)華碩T420LD", "19吋(4:3)華碩T420LD", "1", "人事課", "105/10/26", "114/10/1", "", "", "深耕", "宛縈", "深耕辦公室", "院內資材", "", "", ""],
    ["60112-30-01", "60112-30-01", "有線滑鼠", "-", "", "惟剛", "", "114/11/7", "", "", "深耕", "宛縈", "深耕辦公室", "院內資材", "", "", ""],
    ["60112-30-02", "60112-30-02", "鍵盤", "", "", "惟剛", "", "114/11/7", "", "", "深耕", "宛縈", "深耕辦公室", "院內資材", "", "", ""],
    ["60112-30-03", "60112-30-03", "E-booksWS3高能天線WIFI", "E-PCK003", "1", "惟剛", "", "114/10/1", "", "299", "深耕", "惟剛", "深耕辦公室", "惟剛", "", "", ""],
    ["60112-30-04", "60112-30-04", "ASUS有線鍵盤", "PR1101U", "", "長照課", "", "114/10/20", "", "", "深耕", "憶如(長照心理師)", "深耕辦公室", "院內資材", "", "", ""],
    ["60112-14-01", "60112-14-01", "ASUS AS電腦主機", "D500TE513500230X", "1", "工務", "", "114/11/1", "", "", "深耕", "宜泰", "深耕辦公室", "院內資材", "", "", ""],
    ["60112-56-01", "60112-56-01", "6孔延長線", "3尺", "1", "工務", "", "114/10/20", "", "", "深耕", "宜泰", "深耕辦公室", "院內資材", "", "", ""],
    ["60112-56-02", "60112-56-02", "6孔延長線", "6尺", "1", "宜泰", "", "114/10/20", "", "", "深耕", "宜泰", "深耕辦公室", "宜泰", "", "", ""]
];

// 頁面載入完成後執行
$(document).ready(function () {
    initializeApp();
});

// 初始化應用程式
function initializeApp() {
    loadData();
    setupEventListeners();

    // 如果使用本地儲存，隱藏同步按鈕；否則顯示
    if (USE_LOCAL_STORAGE) {
        $('#syncBtn').hide();
    } else {
        $('#syncBtn').show();
    }
}

// 載入資料
function loadData() {
    if (USE_LOCAL_STORAGE) {
        // 從本地儲存載入
        const savedData = localStorage.getItem('assetsData');
        if (savedData) {
            assetsData = JSON.parse(savedData);
        } else {
            // 如果沒有儲存的資料，使用初始資料
            assetsData = initialData.map(row => ({
                deepAssetNo: row[0],
                hospitalAssetNo: row[1],
                assetName: row[2],
                specification: row[3],
                quantity: row[4],
                unit: row[5],
                purchaseDate: row[6],
                acquireDate: row[7],
                usefulLife: row[8],
                cost: row[9],
                department: row[10],
                keeper: row[11],
                location: row[12],
                supplier: row[13],
                warrantyVendor: row[14],
                warrantyPeriod: row[15],
                notes: row[16]
            }));
            saveData();
        }
        displayData();
    } else {
        // 從 Google Sheets 載入
        loadFromGoogleSheets();
    }
}

// 從 Google Sheets 載入資料
function loadFromGoogleSheets() {
    if (!CONFIG.WEB_APP_URL || CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL' || CONFIG.WEB_APP_URL.includes('請貼上')) {
        alert('請先設定 Google Apps Script Web App URL！\n\n步驟：\n1. 開啟試算表\n2. 擴充功能 → Apps Script\n3. 貼上 GoogleAppsScript.js 的程式碼\n4. 部署為網路應用程式\n5. 將網址填入 config.js');
        // 使用本地儲存作為備用
        USE_LOCAL_STORAGE = true;
        loadData();
        return;
    }

    console.log('正在從 Google Sheets 載入資料...');
    console.log('Web App URL:', CONFIG.WEB_APP_URL);

    $.ajax({
        url: CONFIG.WEB_APP_URL,
        method: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 10000, // 10秒超時
        success: function (response) {
            console.log('收到回應:', response);

            if (response.error) {
                console.error('載入失敗:', response.error);
                alert('載入資料失敗: ' + response.error);
                return;
            }

            const rows = response.data;
            if (rows && rows.length > 1) {
                // 跳過標題行
                assetsData = rows.slice(1).map(row => ({
                    deepAssetNo: row[0] || '',
                    hospitalAssetNo: row[1] || '',
                    assetName: row[2] || '',
                    specification: row[3] || '',
                    quantity: row[4] || '',
                    unit: row[5] || '',
                    purchaseDate: row[6] || '',
                    acquireDate: row[7] || '',
                    usefulLife: row[8] || '',
                    cost: row[9] || '',
                    department: row[10] || '',
                    keeper: row[11] || '',
                    location: row[12] || '',
                    supplier: row[13] || '',
                    warrantyVendor: row[14] || '',
                    warrantyPeriod: row[15] || '',
                    notes: row[16] || ''
                }));
                console.log('資料載入成功，共', assetsData.length, '筆');
                displayData();
            } else {
                console.warn('工作表沒有資料或格式不正確');
                // 使用初始資料
                assetsData = initialData.map(row => ({
                    deepAssetNo: row[0],
                    hospitalAssetNo: row[1],
                    assetName: row[2],
                    specification: row[3],
                    quantity: row[4],
                    unit: row[5],
                    purchaseDate: row[6],
                    acquireDate: row[7],
                    usefulLife: row[8],
                    cost: row[9],
                    department: row[10],
                    keeper: row[11],
                    location: row[12],
                    supplier: row[13],
                    warrantyVendor: row[14],
                    warrantyPeriod: row[15],
                    notes: row[16]
                }));
                displayData();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX 錯誤詳情:');
            console.error('Status:', textStatus);
            console.error('Error:', errorThrown);
            console.error('jqXHR:', jqXHR);

            const errorMsg = '無法從 Google Sheets 載入資料\n\n' +
                '可能原因：\n' +
                '1. Apps Script 未正確部署\n' +
                '2. 部署時未選擇「存取權限：所有人」\n' +
                '3. 工作表名稱不是「' + CONFIG.SHEET_NAME + '」\n' +
                '4. 網路連線問題\n\n' +
                '錯誤訊息: ' + textStatus + '\n\n' +
                '建議：先使用本地儲存模式（將 config.js 中的 USE_LOCAL_STORAGE 改為 true）';

            alert(errorMsg);

            // 使用初始資料作為備用
            console.log('使用初始資料作為備用');
            assetsData = initialData.map(row => ({
                deepAssetNo: row[0],
                hospitalAssetNo: row[1],
                assetName: row[2],
                specification: row[3],
                quantity: row[4],
                unit: row[5],
                purchaseDate: row[6],
                acquireDate: row[7],
                usefulLife: row[8],
                cost: row[9],
                department: row[10],
                keeper: row[11],
                location: row[12],
                supplier: row[13],
                warrantyVendor: row[14],
                warrantyPeriod: row[15],
                notes: row[16]
            }));
            displayData();
        }
    });
}

// 儲存資料
function saveData() {
    if (USE_LOCAL_STORAGE) {
        localStorage.setItem('assetsData', JSON.stringify(assetsData));
    } else {
        saveToGoogleSheets();
    }
}

// 儲存到 Google Sheets
function saveToGoogleSheets() {
    if (!CONFIG.WEB_APP_URL || CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL') {
        console.error('未設定 Web App URL');
        // 備用：儲存到本地
        localStorage.setItem('assetsData', JSON.stringify(assetsData));
        return;
    }

    // 先儲存到本地（確保數據安全）
    localStorage.setItem('assetsData', JSON.stringify(assetsData));
    console.log('資料已儲存到本地');

    // 非同步嘗試同步到 Google Sheets（不影響用戶操作）
    // 非同步嘗試同步到 Google Sheets（不影響用戶操作）
    triggerSync(false); // false = auto mode (silent)
}

// 同步資料到 Google Sheets（非同步，可選）
// 觸發同步
function triggerSync(isManual = false) {
    if (!CONFIG.WEB_APP_URL || CONFIG.WEB_APP_URL === 'YOUR_WEB_APP_URL') {
        if (isManual) alert('請先設定 Google Apps Script Web App URL');
        return;
    }

    if (isManual) {
        // 手動模式：顯示確認對話框
        $('#syncModal').show();
    } else {
        // 自動模式：直接執行同步（顯示載入狀態但不需確認）
        executeSync(false);
    }
}

// 主動同步到 Google Sheets（用戶點擊按鈕時）
function manualSyncToGoogleSheets() {
    triggerSync(true);
}

// 執行同步（在確認對話框中點擊確認後）
// 執行同步（在確認對話框中點擊確認後，或自動觸發）
function executeSync(isManual = true) {
    $('#syncModal').hide();

    // 轉換為陣列格式
    const header = ['深耕財產編號', '醫院財產編號', '財產名稱', '規格/型號', '數量', '財產單位',
        '購入/申請日期', '取得日期', '耐用年限', '取得成本', '保管單位', '保管人',
        '所在地點', '供應商', '保固合約-廠商', '保固合約-期間', '備註'];

    // 準備傳送的資料物件
    const requestData = {
        action: 'updateAll',
        data: [header, ...assetsData.map(asset => [
            asset.deepAssetNo || '',
            asset.hospitalAssetNo || '',
            asset.assetName || '',
            asset.specification || '',
            asset.quantity || '',
            asset.unit || '',
            asset.purchaseDate || '',
            asset.acquireDate || '',
            asset.usefulLife || '',
            asset.cost || '',
            asset.department || '',
            asset.keeper || '',
            asset.location || '',
            asset.supplier || '',
            asset.warrantyVendor || '',
            asset.warrantyPeriod || '',
            asset.notes || ''
        ])]
    };

    // 顯示同步中
    const syncBtn = $('#syncBtn');
    const originalText = syncBtn.html();
    const loadingText = '<i class="fa-solid fa-spinner fa-spin"></i> 同步中...';
    syncBtn.prop('disabled', true).html(loadingText);

    // 使用 fetch API 發送 POST 請求
    fetch(CONFIG.WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            syncBtn.prop('disabled', false).html(originalText);

            if (data && data.success) {
                // 成功時，使用自定義 Modal 顯示訊息
                showResultModal(
                    '同步成功',
                    '✅ 資料已成功同步到 Google Sheets',
                    'success'
                );
                console.log('Google Sheets 同步成功:', data);
            } else {
                const errorMsg = data && data.error ? data.error : '未知錯誤';
                showResultModal(
                    '同步失敗',
                    '⚠️ 同步失敗：' + errorMsg + '\n但資料已保存在本地',
                    'error'
                );
                console.warn('Google Sheets 同步失敗:', data);
            }
        })
        .catch(error => {
            syncBtn.prop('disabled', false).html(originalText);
            console.error('Fetch 錯誤:', error);
            showResultModal(
                '連線錯誤',
                '⚠️ 無法連接 Google Sheets\n' + error.message + '\n但資料已保存在本地',
                'error'
            );
        });
}

// 顯示結果 Modal
function showResultModal(title, message, type) {
    $('#resultTitle').text(title);
    $('#resultMessage').text(message);

    const iconDiv = $('#resultIcon');
    iconDiv.empty();

    if (type === 'success') {
        iconDiv.html('<i class="fa-solid fa-circle-check" style="color: var(--success);"></i>');
    } else {
        iconDiv.html('<i class="fa-solid fa-circle-exclamation" style="color: var(--danger);"></i>');
    }

    $('#resultModal').show();
}

// 顯示資料
function displayData() {
    filteredData = assetsData;
    renderTable();
    updateStats();
    updateFilters();
}

// 渲染表格
function renderTable() {
    const tbody = $('#assetsTableBody');
    tbody.empty();

    if (filteredData.length === 0) {
        tbody.append('<tr><td colspan="6" class="loading">沒有符合的資料</td></tr>');
        return;
    }

    filteredData.forEach((asset, index) => {
        // 格式化金額
        const cost = asset.cost ? '$ ' + parseFloat(asset.cost).toLocaleString() : '-';

        const row = $(`
            <tr>
                <!-- 資產資訊 -->
                <td>
                    <span class="cell-title">${asset.assetName}</span>
                    <span class="cell-subtitle">${asset.specification || '-'}</span>
                    ${asset.notes ? `<div class="cell-subtitle" style="margin-top:4px; font-style:italic; color:#9CA3AF">📝 ${asset.notes}</div>` : ''}
                </td>

                <!-- 編號資訊 -->
                <td>
                    <span class="cell-id">${asset.hospitalAssetNo}</span>
                    ${asset.deepAssetNo ? `<span class="cell-id-secondary">深耕: ${asset.deepAssetNo}</span>` : ''}
                </td>

                <!-- 保管狀態 -->
                <td>
                    <div>
                        <span class="badge badge-purple">${asset.keeper || '未指定'}</span>
                        <span class="badge badge-gray">${asset.department || '-'}</span>
                    </div>
                    ${asset.location ? `<div class="location-text"><i class="fa-solid fa-location-dot"></i> ${asset.location}</div>` : ''}
                </td>

                <!-- 取得資訊 -->
                <td>
                    <div class="cost-text">${cost}</div>
                    <div class="date-text">取得: ${asset.acquireDate || '-'}</div>
                    ${asset.usefulLife ? `<div class="date-text">年限: ${asset.usefulLife}</div>` : ''}
                </td>

                <!-- 狀態 -->
                <td>
                    <span class="quantity-badge">${asset.quantity} ${asset.unit}</span>
                </td>

                <!-- 操作 -->
                <td class="text-right">
                    <button class="btn btn-icon-only" onclick="editAsset(${assetsData.indexOf(asset)})" title="編輯">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-icon-only danger" onclick="deleteAsset(${assetsData.indexOf(asset)})" title="刪除">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
        tbody.append(row);
    });
}

// 更新統計資訊
function updateStats() {
    const totalQuantity = filteredData.reduce((sum, asset) => {
        const qty = parseInt(asset.quantity) || 0;
        return sum + qty;
    }, 0);

    const totalAmount = filteredData.reduce((sum, asset) => {
        const amount = parseFloat(asset.cost) || 0;
        return sum + amount;
    }, 0);

    $('#totalAssets').text(totalQuantity);
    $('#totalValue').text(totalAmount > 0 ? `$ ${totalAmount.toLocaleString()}` : '0');
    $('#totalItems').text(filteredData.length);
}

// 更新篩選器
function updateFilters() {
    const units = [...new Set(assetsData.map(a => a.unit).filter(u => u))];
    const keepers = [...new Set(assetsData.map(a => a.keeper).filter(k => k))];
    const locations = [...new Set(assetsData.map(a => a.location).filter(l => l))];

    updateSelectOptions('#filterUnit', units);
    updateSelectOptions('#filterKeeper', keepers);
    updateSelectOptions('#filterLocation', locations);
}

// 更新下拉選單選項
function updateSelectOptions(selector, options) {
    const select = $(selector);
    const currentValue = select.val();
    select.find('option:not(:first)').remove();

    options.sort().forEach(option => {
        select.append(`<option value="${option}">${option}</option>`);
    });

    if (currentValue) {
        select.val(currentValue);
    }
}

// 設置事件監聽器
function setupEventListeners() {
    // 重新整理按鈕
    $('#refreshBtn').click(loadData);

    // 新增按鈕
    $('#addBtn').click(openAddModal);

    // 同步按鈕
    $('#syncBtn').click(manualSyncToGoogleSheets);

    // 匯出按鈕
    $('#exportBtn').click(exportToExcel);

    // 搜尋
    $('#searchInput').on('input', filterData);

    // 篩選器
    $('#filterUnit, #filterKeeper, #filterLocation').change(filterData);

    // 對話框關閉
    $('.close, #cancelBtn').click(closeModal);

    // 表單提交
    $('#assetForm').submit(handleFormSubmit);

    // 點擊對話框外部關閉
    $(window).click(function (event) {
        if (event.target.id === 'assetModal') {
            closeModal();
        }
        if (event.target.id === 'syncModal') {
            $('#syncModal').hide();
        }
        if (event.target.id === 'resultModal') {
            // 禁止點擊背景關閉結果視窗，強制用戶點擊確認
            // $('#resultModal').hide();
        }
    });

    // 同步確認對話框按鈕
    $('#confirmSyncBtn').click(function () {
        executeSync(true);
    });

    // 結果對話框按鈕
    $('#resultOkBtn').click(function () {
        $('#resultModal').hide();
    });

    $('.close-modal').click(function () {
        $('#syncModal').hide();
        $('#resultModal').hide();
    });
}

// 篩選資料
function filterData() {
    const searchTerm = $('#searchInput').val().toLowerCase();
    const unitFilter = $('#filterUnit').val();
    const keeperFilter = $('#filterKeeper').val();
    const locationFilter = $('#filterLocation').val();

    filteredData = assetsData.filter(asset => {
        const matchSearch = !searchTerm ||
            Object.values(asset).some(val =>
                String(val).toLowerCase().includes(searchTerm)
            );

        const matchUnit = !unitFilter || asset.unit === unitFilter;
        const matchKeeper = !keeperFilter || asset.keeper === keeperFilter;
        const matchLocation = !locationFilter || asset.location === locationFilter;

        return matchSearch && matchUnit && matchKeeper && matchLocation;
    });

    renderTable();
    updateStats();
}

// 開啟新增對話框
function openAddModal() {
    editingIndex = -1;
    $('#modalTitle').text('新增資產');
    $('#assetForm')[0].reset();
    $('#assetModal').show();
}

// 編輯資產
function editAsset(index) {
    editingIndex = index;
    const asset = assetsData[index];

    $('#modalTitle').text('編輯資產');
    $('#deepAssetNo').val(asset.deepAssetNo || '');
    $('#hospitalAssetNo').val(asset.hospitalAssetNo || '');
    $('#assetName').val(asset.assetName);
    $('#specification').val(asset.specification);
    $('#quantity').val(asset.quantity);
    $('#unit').val(asset.unit);
    $('#purchaseDate').val(asset.purchaseDate);
    $('#acquireDate').val(asset.acquireDate);
    $('#usefulLife').val(asset.usefulLife || '');
    $('#cost').val(asset.cost || '');
    $('#department').val(asset.department);
    $('#keeper').val(asset.keeper);
    $('#location').val(asset.location);
    $('#supplier').val(asset.supplier);
    $('#warrantyVendor').val(asset.warrantyVendor || '');
    $('#warrantyPeriod').val(asset.warrantyPeriod || '');
    $('#notes').val(asset.notes || '');

    $('#assetModal').show();
}

// 刪除資產
function deleteAsset(index) {
    if (confirm('確定要刪除這筆資產嗎？')) {
        assetsData.splice(index, 1);
        saveData();
        displayData();
        triggerSync(false); // 自動同步
    }
}

// 關閉對話框
function closeModal() {
    $('#assetModal').hide();
    $('#assetForm')[0].reset();
    editingIndex = -1;
}

// 處理表單提交
function handleFormSubmit(e) {
    e.preventDefault();

    const asset = {
        deepAssetNo: $('#deepAssetNo').val(),
        hospitalAssetNo: $('#hospitalAssetNo').val(),
        assetName: $('#assetName').val(),
        specification: $('#specification').val(),
        quantity: $('#quantity').val(),
        unit: $('#unit').val(),
        purchaseDate: $('#purchaseDate').val(),
        acquireDate: $('#acquireDate').val(),
        usefulLife: $('#usefulLife').val(),
        cost: $('#cost').val(),
        department: $('#department').val(),
        keeper: $('#keeper').val(),
        location: $('#location').val(),
        supplier: $('#supplier').val(),
        warrantyVendor: $('#warrantyVendor').val(),
        warrantyPeriod: $('#warrantyPeriod').val(),
        notes: $('#notes').val()
    };

    if (editingIndex >= 0) {
        // 編輯現有資產
        assetsData[editingIndex] = asset;
    } else {
        // 新增資產
        assetsData.push(asset);
    }

    saveData();
    displayData();
    closeModal();
}

// 匯出為 Excel
function exportToExcel() {
    const exportData = [
        ['深耕財產編號', '醫院財產編號', '財產名稱', '規格/型號', '數量', '財產單位', '購入/申請日期', '取得日期', '耐用年限', '取得成本', '保管單位', '保管人', '所在地點', '供應商', '保固合約-廠商', '保固合約-期間', '備註'],
        ...assetsData.map(asset => [
            asset.deepAssetNo || '',
            asset.hospitalAssetNo || '',
            asset.assetName,
            asset.specification,
            asset.quantity,
            asset.unit,
            asset.purchaseDate,
            asset.acquireDate,
            asset.usefulLife || '',
            asset.cost || '',
            asset.department,
            asset.keeper,
            asset.location,
            asset.supplier,
            asset.warrantyVendor || '',
            asset.warrantyPeriod || '',
            asset.notes || ''
        ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);

    // 設定欄位寬度
    ws['!cols'] = [
        { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 8 }, { wch: 12 },
        { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, '財產清單');

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `財產清單_${today}.xlsx`);
}
