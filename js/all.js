
// ------------------ 類別選擇框 ------------------
document.getElementById('selectCategoryBtn').addEventListener('click', () => {
    Swal.fire({
        title: '選擇設備類別',
        html: `
            <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-outline-primary btn-category" data-value="CPU"><img src="./img/零組件/CPU.png">CPU</button>
                <button class="btn btn-outline-primary btn-category" data-value="RAM"><img src="./img/零組件/ram.png">RAM</button>
                <button class="btn btn-outline-primary btn-category" data-value="主機板"><img src="./img/零組件/mainboard.png">主機板</button>
                <button class="btn btn-outline-primary btn-category" data-value="顯示卡"><img src="./img/零組件/video-card.png">顯示卡</button>
                <button class="btn btn-outline-primary btn-category" data-value="M.2 SSD"><img src="./img/零組件/M.2 SSD.png">M.2 SSD</button>
                <button class="btn btn-outline-primary btn-category" data-value="2.5吋 SSD"><img src="./img/零組件/2.5 SSD.png">2.5" SSD</button>
                <button class="btn btn-outline-primary btn-category" data-value="HDD"><img src="./img/零組件/hard-disk-drive.png">HDD</button>
                <button class="btn btn-outline-primary btn-category" data-value="電源供應器"><img src="./img/零組件/power-supply.png">電源</button>
                <button class="btn btn-outline-primary btn-category" data-value="不斷電"><img src="./img/周邊設備/uninterrupted-power-supply.png">UPS</button>
                <button class="btn btn-outline-primary btn-category" data-value="塔式散熱器"><img src="./img/零組件/fan.png">塔式散熱</button>
                <button class="btn btn-outline-primary btn-category" data-value="水冷散熱器"><img src="./img/零組件/water-cooler.png">水冷散熱</button>
                <button class="btn btn-outline-primary btn-category" data-value="機殼"><img src="./img/零組件/computer-case.png">機殼</button>
                <button class="btn btn-outline-primary btn-category" data-value="網路卡"><img src="./img/零組件/ethernet.png">網路卡</button>
                <button class="btn btn-outline-primary btn-category" data-value="音效卡"><img src="./img/零組件/sound-card.png">音效卡</button>
                <button class="btn btn-outline-primary btn-category" data-value="滑鼠"><img src="./img/周邊設備/computer-mouse 2.png">滑鼠</button>
                <button class="btn btn-outline-primary btn-category" data-value="鍵盤"><img src="./img/周邊設備/keyboard.png">鍵盤</button>
                <button class="btn btn-outline-primary btn-category" data-value="全罩耳機"><img src="./img/周邊設備/earphone.png">全罩耳機</button>
                <button class="btn btn-outline-primary btn-category" data-value="入耳耳機"><img src="./img/周邊設備/headphone.png">入耳耳機</button>
                <button class="btn btn-outline-primary btn-category" data-value="喇叭"><img src="./img/周邊設備/speaker.png">喇叭</button>
                <button class="btn btn-outline-primary btn-category" data-value="路由器"><img src="./img/網路設備/modem.png">路由器</button>
                <button class="btn btn-outline-primary btn-category" data-value="交換機"><img src="./img/網路設備/network-hub.png">交換機</button>
                <button class="btn btn-outline-primary btn-category" data-value="螢幕"><img src="./img/周邊設備/monitor.png">螢幕</button>
                <button class="btn btn-outline-primary btn-category" data-value="視訊鏡頭"><img src="./img/周邊設備/web-cam.png">視訊鏡頭</button>
                <button class="btn btn-outline-primary btn-category" data-value="DAC"><img src="./img/周邊設備/dac.png">DAC</button>
                <button class="btn btn-outline-primary btn-category" data-value="擴大機"><img src="./img/周邊設備/amplifier.png">擴大機</button>
                <button class="btn btn-outline-primary btn-category" data-value="其他"><img src="./img/question-mark.png">其他</button>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
            popup: 'custom-swal-width'  // 套用 CSS
        },
        didOpen: () => {
            document.querySelectorAll('.btn-category').forEach(button => {
                button.addEventListener('click', function () {
                    const selectedValue = this.getAttribute('data-value');
                    const selectedText = this.innerText.trim();
                    const selectedImg = this.querySelector('img').src; // 取得圖片的 src
                    
                    // 將選擇的圖片和文字設為按鈕的內容
                    const selectCategoryBtn = document.getElementById('selectCategoryBtn');
                    selectCategoryBtn.innerHTML = `<img src="${selectedImg}" alt="${selectedText}">${selectedText}`;
                    
                    // 設定 input 的 value
                    document.getElementById('category').value = selectedValue;

                    // 移除未選擇的紅框
                    selectCategoryBtn.classList.remove("btn-danger", "border", "border-danger");
                    selectCategoryBtn.classList.add("btn-outline-primary");
                    
                    Swal.close();
                });
            });
        }
    });
});

// 清除按鈕
document.querySelector('.resetBTN').addEventListener('click', () => {
    let categoryInput = document.getElementById('category');
    let selectCategoryBtn = document.getElementById('selectCategoryBtn');

    categoryInput.value = ""; // 清除 input 的值
    selectCategoryBtn.innerHTML = "請選擇設備類別";

    // 恢復按鈕原本樣式
    selectCategoryBtn.classList.remove("btn-danger", "border", "border-danger");
    selectCategoryBtn.classList.add("btn-outline-primary");
});

// 伸縮按鈕
document.addEventListener("DOMContentLoaded", () => {
    // 檢查本地儲存中是否有輸入區塊的顯示設定
    let inputDisplay = localStorage.getItem("inputDisplay");
    
    const hardwareForm = document.getElementById("hardwareForm");
    const hideButton = document.querySelector(".hide-btn");

    // 初始狀態：依照 localStorage 設定顯示或隱藏
    if (inputDisplay === "hidden") {
        hardwareForm.style.display = "none";
        hideButton.textContent = "▼"; // 變成向下箭頭
    }

    // 監聽按鈕點擊事件來顯示/隱藏 hardwareForm
    hideButton.addEventListener("click", () => {
        if (hardwareForm.style.display === "none") {
            hardwareForm.style.display = "block";
            hideButton.textContent = "▲"; // 變成向上箭頭
            localStorage.setItem("inputDisplay", "visible");
        } else {
            hardwareForm.style.display = "none";
            hideButton.textContent = "▼"; // 變成向下箭頭
            localStorage.setItem("inputDisplay", "hidden");
        }
    });
});









// ------------------ 黑暗模式 ------------------
document.addEventListener("DOMContentLoaded", () => {
    // 檢查本地儲存中是否有使用者的主題設定
    let currentTheme = localStorage.getItem("theme");
    if (currentTheme === null) {
        // 如果本地儲存沒有主題設定，檢查設備的首選主題
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        // 根據設備偏好設定主題
        currentTheme = prefersDarkScheme ? "dark" : "light";
        // 儲存設定的主題到本地儲存
        localStorage.setItem("theme", currentTheme);
    }
    // 根據當前的主題設置頁面
    document.documentElement.setAttribute("data-bs-theme", currentTheme);
    // 處理主題切換邏輯
    const themeToggleButton = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    // 設定初始圖標
    themeIcon.classList.toggle("fa-sun", currentTheme !== "dark");
    themeIcon.classList.toggle("fa-moon", currentTheme === "dark");
    // 監聽按鈕點擊事件來切換主題
    themeToggleButton.addEventListener("click", () => {
        // 切換主題
        const newTheme = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-bs-theme", newTheme);
        // 切換圖標
        themeIcon.classList.toggle("fa-sun", newTheme !== "dark");
        themeIcon.classList.toggle("fa-moon", newTheme === "dark");
        // 儲存用戶的選擇
        localStorage.setItem("theme", newTheme);
    });
});



// ------------------ 送出按鈕 ------------------
// 提交檢查類別
document.querySelector('.submitBTN').addEventListener('click', function(e) {
    let categoryInput = document.getElementById("category");
    let selectCategoryBtn = document.getElementById("selectCategoryBtn");

    if (!categoryInput.value) {
        e.preventDefault(); // 阻止表單提交
        selectCategoryBtn.classList.add("btn-danger", "border", "border-danger"); // 加上強調樣式
        selectCategoryBtn.classList.remove("btn-outline-primary"); // 移除原本的樣式

        // 按鈕震動
        selectCategoryBtn.style.animation = "shake 0.4s ease-in-out";
        setTimeout(() => {
            selectCategoryBtn.style.animation = "";
        }, 400);
        return; // 不繼續執行，避免表單送出
    } else {
        // 恢復按鈕原本樣式
        selectCategoryBtn.classList.remove("btn-danger", "border", "border-danger");
        selectCategoryBtn.classList.add("btn-outline-primary");
    }
});

// 提交表單的實際邏輯
function submitForm() {
    // 取得表單中的所有值
    let category = document.getElementById("category").value;
    let brand = document.getElementById("brand").value;
    let name = document.getElementById("name").value;
    let spec = document.getElementById("spec").value;
    let batch = document.getElementById("batch").value;
    let serialNumber = document.getElementById("serialNumber").value;
    let trade = document.getElementById("trade").value;
    let warranty = document.getElementById("warranty").value;
    let price = document.getElementById("price").value;
    let purchaseDate = document.getElementById("purchaseDate").value;
    let other = document.getElementById("other").value;

    // 使用 AJAX 發送表單數據到後端 API
    $.ajax({
        url: '/api/add_hardware', // FastAPI 的 API 路徑，請確保這裡是對應的接口
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            category: category,
            brand: brand,
            name: name,
            spec: spec,
            batch: batch,
            serialNumber: serialNumber,
            trade: trade,
            warranty: warranty,
            price: price,
            purchaseDate: purchaseDate,
            recordTime: getNowTime(),
            other: other
        }),
        success: function(response) {
            sweetalert_OK('設備資訊已儲存！');

            // 清空表單
            let categoryInput = document.getElementById("category");
            let selectCategoryBtn = document.getElementById("selectCategoryBtn");
            categoryInput.value = ""; // 清除 input 的值
            selectCategoryBtn.innerHTML = "請選擇設備類別";
            selectCategoryBtn.classList.remove("btn-danger", "border", "border-danger");
            selectCategoryBtn.classList.add("btn-outline-primary");
            document.getElementById('hardwareForm').reset();
            // 更新設備清單
            fetchDataAndRender(); // 呼叫從後端獲取資料並重新渲染表格的函數
        },
        error: function(error) {
            console.error("提交資料時出錯: ", error);
            sweetalert_error("設備資訊儲存失敗！");
        }
    });
}

// 表單提交事件
document.getElementById('hardwareForm').addEventListener('submit', function(e) {
    e.preventDefault(); // 防止默認的提交行為

    submitForm(); // 送出
});



// ------------------ 刪除按鈕 ------------------
function deleteRow(id) {
    Swal.fire({
        title: "確定要刪除嗎？",
        text: "刪除後將無法恢復",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "確定刪除",
        cancelButtonText: "取消",
        customClass: {
            popup: 'custom-swal-color'  // 套用 CSS
        },
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/delete/${id}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    sweetalert_OK("刪除成功");
                    table.row($(`i[onclick="deleteRow(${id})"]`).parents('tr')).remove().draw();
                } else {
                    console.error("刪除資料時出錯: ", data.message);
                    sweetalert_error("刪除資料時出錯", 2500);
                }
            })
            .catch(error => {
                console.error("無法連接伺服器: ", error);
                sweetalert_error("無法連接伺服器", 2500);
            });
        }
    });
}




// ------------------ 圖片預載 ------------------
document.addEventListener("DOMContentLoaded", () => {
    // 防止FOUT/FOUC 初始全畫面隱藏
    document.body.style.visibility = "visible";
    // 取得所有按鈕內的圖片路徑
    const imageUrls = [
        "./img/零組件/CPU.png",
        "./img/零組件/ram.png",
        "./img/零組件/mainboard.png",
        "./img/零組件/video-card.png",
        "./img/零組件/M.2 SSD.png",
        "./img/零組件/2.5 SSD.png",
        "./img/零組件/hard-disk-drive.png",
        "./img/零組件/power-supply.png",
        "./img/周邊設備/uninterrupted-power-supply.png",
        "./img/零組件/fan.png",
        "./img/零組件/water-cooler.png",
        "./img/零組件/computer-case.png",
        "./img/零組件/ethernet.png",
        "./img/零組件/sound-card.png",
        "./img/周邊設備/computer-mouse 2.png",
        "./img/周邊設備/keyboard.png",
        "./img/周邊設備/earphone.png",
        "./img/周邊設備/headphone.png",
        "./img/周邊設備/speaker.png",
        "./img/網路設備/modem.png",
        "./img/網路設備/network-hub.png",
        "./img/周邊設備/monitor.png",
        "./img/周邊設備/web-cam.png",
        "./img/周邊設備/dac.png",
        "./img/周邊設備/amplifier.png"
    ];

    // 預載圖片
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
});


// ------------------ 氣泡對話框 ------------------

// sweetalert2 成功
function sweetalert_OK(params, time=1000) {
	Swal.fire({
		icon: 'success',
		title: '成功',
        text: params,
        confirmButtonText: '確定',
		showConfirmButton: false, // 自動關閉
		timer: time, // 倒數計時
        showCloseButton: true, // 關閉按鈕
        customClass: {
            popup: 'custom-swal-color'  // 套用 CSS
        },
	})
}
// sweetalert2 警告
function sweetalert_NO(params, time=1000) {
	Swal.fire({
		icon: 'warning',
		title: '警告',
        text: params,
        confirmButtonText: '確定',
		showConfirmButton: false, // 自動關閉
		timer: time, // 倒數計時
        showCloseButton: true, // 關閉按鈕
        customClass: {
            popup: 'custom-swal-color'  // 套用 CSS
        },
	})
}
// sweetalert2 錯誤
function sweetalert_error(params, time=1000) {
	Swal.fire({
		icon: 'error',
		title: '錯誤',
        text: params,
        confirmButtonText: '確定',
		showConfirmButton: false, // 自動關閉
		timer: time, // 倒數計時
        showCloseButton: true, // 關閉按鈕
        customClass: {
            popup: 'custom-swal-color'  // 套用 CSS
        },
	})
}


// ------------------ Axios API獲取------------------

function getdata() {
    axios.get('/api/get_hardware_list')
    .then(response => {
        console.log(response.data);
        // 根據獲得的數據更新前端
    })
    .catch(error => {
        console.error("AJAX取得資料錯誤: ", error);
    });
}

// ------------------ 渲染 ------------------

let table;
$(document).ready(function() {
    table = $('.table').DataTable({
        "paging": true,        // 啟用分頁
        "searching": true,     // 啟用搜尋
        "ordering": true,      // 啟用排序
        "info": true,          // 顯示表格資訊
        "fixedHeader": true,  // 固定表頭
        "lengthMenu": [10, 25, 50, 100], // 分頁選項
        "language": {
            "lengthMenu": "顯示 _MENU_ 筆",
            "search": "搜尋：",
            "zeroRecords": "找不到符合的資料",
            "info": "顯示 _START_ 到 _END_ 筆，共 _TOTAL_ 筆",
            "infoEmpty": "沒有相符的數據",
            "infoFiltered": "(共 _MAX_ 筆)",
            "emptyTable": "目前無數據，請檢查伺服器連線。",
            "paginate": {
                "first": "⋘",
                "last": "⋙",
                "next": "≫",
                "previous": "≪"
            }
        },
        // 隱藏相關區塊
        "columnDefs": [
            {
                "targets": [0, 5, 9, 11, 12],  // 隱藏特定欄位
                "visible": false
            }
        ],
        // 匯出按鈕
        layout: {
            topStart: {
                buttons: [
                    {
                        extend: 'pageLength',
                        text: '顯示筆數',
                        className: 'btn btn-primary',
                    },
                    {
                        extend: 'excelHtml5',
                        text: '匯出 Excel',
                        title: `硬體設備清單 ${getNowTime('dayTitle')}`,
                        className: 'btn btn-success', // 綠色
                        exportOptions: {
                            columns: ':not(:last-child)'  // 排除最後一欄（操作欄）
                        }
                    },
                    {
                        extend: 'csvHtml5',
                        text: '匯出 CSV',
                        title: `硬體設備清單 ${getNowTime('dayTitle')}`,
                        className: 'btn btn-success', // 綠色
                        bom: true, // 加入 UTF-8 BOM，防止亂碼
                        exportOptions: {
                            columns: ':not(:last-child)'  // 排除最後一欄（操作欄）
                        }
                    }
                ]
            }
        }
    });
});

// 手動渲染 SQL 資料的函數
function fetchDataAndRender() {
	// 使用 AJAX 從 FastAPI 獲取資料
	$.ajax({
		url: '/api/get_hardware_list',  // FastAPI 的 API 路徑
		method: 'GET',
		success: function(data) {
			// 清空現有表格資料
			table.clear();

            // 將獲取的數據填入表格
            data.forEach(function(item) {
                table.row.add([
                    item.id,
                    item.category,
                    item.brand,
                    item.name,
                    item.spec,
                    item.batch,
                    item.purchaseDate,
                    item.warrantyDate, // 保固日期
                    item.serialNumber, // 序號
                    item.trade,
                    item.price,
                    item.recordTime,
                    item.other,  // 其他
                    `<i class="fa fa-times-circle-o" aria-hidden="true" onclick="deleteRow(${item.id})"></i>` // 按鈕用於刪除操作
                ]);
            });

			// 渲染表格
			table.draw();
		},
		error: function(error) {
			console.error("AJAX取得資料錯誤: ", error);
		}
	});
}

// 呼叫 fetchDataAndRender 函數來手動渲染一次 SQL 資料
fetchDataAndRender();



// 四捨五入函式
function rounding(num, many) {
    return +(Math.round(num + `e+${many}`) + `e-${many}`);
}

// 字數限制函式
function maxText(input, limit) {
    if (input.length > limit) {
        input = input.substring(0, limit);
    }
    if (input.endsWith('.')) {
        input = input.slice(0, -1);
    }
    return input;
}

// 獲取當前時間格式化
function getNowTime(mod = 'full') {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從0開始，所以要+1
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 判斷mod，預設為'full'，可選 full、day、dayTitle
    switch (mod) {
        case 'day':
            return `${year}-${month}-${day}`;
        case 'dayTitle':
            return `${year}${month}${day}`;
        default:
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}