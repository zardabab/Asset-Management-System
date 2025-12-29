// 財產管理系統主程式
let assetsData = [];
let filteredData = [];
let editingIndex = -1;

// 初始資料
const initialData = [
    ["60702-14", "30*120格板", "D30*W120", "2", "工務", "", "114/10/20", "", "深耕", "宛縈", "深耕辦公室", "院內資材"],
    ["60702-14", "105*120格板", "D105*W120", "1", "工務", "", "114/10/20", "", "深耕", "宛縈", "深耕辦公室", "院內資材"],
    ["60702-14", "100*60桌子", "D60*W100", "1", "工務", "", "114/10/20", "", "深耕", "宛縈", "深耕辦公室", "院內資材"],
    ["60702-14", "45*90格板", "D45*W90", "4", "工務", "", "114/10/1", "", "深耕", "宜泰", "深耕辦公室", "院內資材"],
    ["60702-14", "90*90格板", "D90*W90", "2", "工務", "", "114/10/1", "", "深耕", "宜泰", "深耕辦公室", "院內資材"],
    ["60702-14", "90*45桌子", "D90*W45", "2", "工務", "", "114/10/1", "", "深耕", "宜泰", "深耕辦公室", "院內資材"],
    ["60702-13", "世紀 U型活動櫃高牆(三層鐵櫃)", "D57*W40*H65", "5", "管理課", "", "114/10/23", "", "深耕", "曉慧", "深耕辦公室", "院內資材"],
    ["消耗品", "原廠碳粉夾BRO THER TN-459Y黃色", "THER TN-459Y", "1", "管理課", "", "114/11/7", "", "深耕", "曉慧", "深耕辦公室", "院內資材"],
    ["消耗品", "原廠碳粉夾BRO THER TN-459M紅色", " THER TN-459M", "1", "管理課", "", "114/11/7", "", "深耕", "曉慧", "深耕辦公室", "院內資材"],
    ["消耗品", "原廠碳粉夾BRO THER TN-459C藍色", "THER TN-459C", "1", "管理課", "", "114/11/7", "", "深耕", "曉慧", "深耕辦公室", "院內資材"],
    ["消耗品", "原廠碳粉夾BRO THER TN-459BK黑色", "THER TN-459BK", "1", "管理課", "", "114/11/7", "", "深耕", "曉慧", "深耕辦公室", "院內資材"],
    ["60102-01", "機器8900彩雷一台", "", "1", "管理課", "", "114/11/7", "", "深耕", "曉慧", "深耕辦公室", "院內資材"],
    ["60112-14-01", "KSLTC2513電腦主機", "", "", "長照科", "", "114/11/1", "", "深耕", "宛縈", "深耕辦公室", "院內資材"],
    ["60112-11", "液晶銀幕LCD19吋(4:3)華碩T420LD", "19吋(4:3)華碩T420LD", "1", "人事課", "105/10/26", "114/10/1", "", "深耕", "宛縈", "深耕辦公室", "院內資材"],
    ["60112-30-01", "有線滑鼠", "-", "", "惟剛", "", "114/11/7", "", "深耕", "宛縈", "深耕辦公室", "院內資材"],
    ["60112-30-02", "鍵盤", "", "", "惟剛", "", "114/11/7", "", "深耕", "宛縈", "深耕辦公室", "院內資材"],
    ["60112-30-03", "E-booksWS3高能天線WIFI", "E-PCK003", "1", "惟剛", "", "114/10/1", "299", "深耕", "惟剛", "深耕辦公室", "惟剛"],
    ["60112-30-04", "ASUS有線鍵盤", "PR1101U", "", "長照課", "", "114/10/20", "", "深耕", "憶如(長照心理師)", "深耕辦公室", "院內資材"],
    ["60112-14-01", "ASUS AS電腦主機", "D500TE513500230X", "1", "工務", "", "114/11/1", "", "深耕", "宜泰", "深耕辦公室", "院內資材"],
    ["60112-56-01", "6孔延長線", "3尺", "1", "工務", "", "114/10/20", "", "深耕", "宜泰", "深耕辦公室", "院內資材"],
    ["60112-56-02", "6孔延長線", "6尺", "1", "宜泰", "", "114/10/20", "", "深耕", "宜泰", "深耕辦公室", "宜泰"]
];

// 頁面載入完成後執行
$(document).ready(function() {
    initializeApp();
});

// 初始化應用程式
function initializeApp() {
    loadData();
    setupEventListeners();
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
                assetNo: row[0],
                assetName: row[1],
                specification: row[2],
                quantity: row[3],
                unit: row[4],
                purchaseDate: row[5],
                acquireDate: row[6],
                amount: row[7],
                department: row[8],
                keeper: row[9],
                location: row[10],
                supplier: row[11]
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
    if (!CONFIG.SPREADSHEET_ID || CONFIG.SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID') {
        alert('請先在 config.js 中設定 Google Sheets 的配置！');
        return;
    }

    $.ajax({
        url: CONFIG.API_URL,
        method: 'GET',
        success: function(response) {
            const rows = response.values;
            if (rows && rows.length > 1) {
                // 跳過標題行
                assetsData = rows.slice(1).map(row => ({
                    assetNo: row[0] || '',
                    assetName: row[1] || '',
                    specification: row[2] || '',
                    quantity: row[3] || '',
                    unit: row[4] || '',
                    purchaseDate: row[5] || '',
                    acquireDate: row[6] || '',
                    amount: row[7] || '',
                    department: row[8] || '',
                    keeper: row[9] || '',
                    location: row[10] || '',
                    supplier: row[11] || ''
                }));
                displayData();
            }
        },
        error: function(error) {
            console.error('載入資料失敗:', error);
            alert('無法從 Google Sheets 載入資料。請檢查配置或使用本地儲存模式。');
        }
    });
}

// 儲存資料
function saveData() {
    if (USE_LOCAL_STORAGE) {
        localStorage.setItem('assetsData', JSON.stringify(assetsData));
    } else {
        // 如果使用 Google Sheets，需要使用 Google Sheets API 的寫入功能
        // 這需要 OAuth 認證，建議使用 Google Apps Script 或後端服務
        alert('Google Sheets 寫入功能需要額外設置。目前建議使用本地儲存模式。');
    }
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
        tbody.append('<tr><td colspan="13" class="loading">沒有符合的資料</td></tr>');
        return;
    }

    filteredData.forEach((asset, index) => {
        const row = $(`
            <tr>
                <td>${asset.assetNo}</td>
                <td>${asset.assetName}</td>
                <td>${asset.specification}</td>
                <td>${asset.quantity}</td>
                <td>${asset.unit}</td>
                <td>${asset.purchaseDate}</td>
                <td>${asset.acquireDate}</td>
                <td>${asset.amount ? '$ ' + asset.amount : ''}</td>
                <td>${asset.department}</td>
                <td>${asset.keeper}</td>
                <td>${asset.location}</td>
                <td>${asset.supplier}</td>
                <td>
                    <button class="btn btn-edit" onclick="editAsset(${assetsData.indexOf(asset)})">編輯</button>
                    <button class="btn btn-danger" onclick="deleteAsset(${assetsData.indexOf(asset)})">刪除</button>
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
        const amount = parseFloat(asset.amount) || 0;
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
    $(window).click(function(event) {
        if (event.target.id === 'assetModal') {
            closeModal();
        }
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
    $('#assetNo').val(asset.assetNo);
    $('#assetName').val(asset.assetName);
    $('#specification').val(asset.specification);
    $('#quantity').val(asset.quantity);
    $('#unit').val(asset.unit);
    $('#purchaseDate').val(asset.purchaseDate);
    $('#acquireDate').val(asset.acquireDate);
    $('#amount').val(asset.amount);
    $('#department').val(asset.department);
    $('#keeper').val(asset.keeper);
    $('#location').val(asset.location);
    $('#supplier').val(asset.supplier);
    
    $('#assetModal').show();
}

// 刪除資產
function deleteAsset(index) {
    if (confirm('確定要刪除這筆資產嗎？')) {
        assetsData.splice(index, 1);
        saveData();
        displayData();
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
        assetNo: $('#assetNo').val(),
        assetName: $('#assetName').val(),
        specification: $('#specification').val(),
        quantity: $('#quantity').val(),
        unit: $('#unit').val(),
        purchaseDate: $('#purchaseDate').val(),
        acquireDate: $('#acquireDate').val(),
        amount: $('#amount').val(),
        department: $('#department').val(),
        keeper: $('#keeper').val(),
        location: $('#location').val(),
        supplier: $('#supplier').val()
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
        ['財產編號', '財產名稱', '規格/型號', '數量', '財產單位', '購入/申請日期', '取得日期', '取得金額', '保管單位', '保管人', '所在地點', '供應商'],
        ...assetsData.map(asset => [
            asset.assetNo,
            asset.assetName,
            asset.specification,
            asset.quantity,
            asset.unit,
            asset.purchaseDate,
            asset.acquireDate,
            asset.amount,
            asset.department,
            asset.keeper,
            asset.location,
            asset.supplier
        ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    
    // 設定欄位寬度
    ws['!cols'] = [
        {wch: 15}, {wch: 30}, {wch: 20}, {wch: 8}, {wch: 12},
        {wch: 15}, {wch: 15}, {wch: 12}, {wch: 12}, {wch: 12},
        {wch: 15}, {wch: 15}
    ];

    XLSX.utils.book_append_sheet(wb, ws, '財產清單');
    
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `財產清單_${today}.xlsx`);
}
