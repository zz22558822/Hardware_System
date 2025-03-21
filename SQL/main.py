from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
import datetime
from dateutil.relativedelta import relativedelta

# 初始化 FastAPI 應用
app = FastAPI()

# 設定 CORS 允許跨域請求
origins = [
    "http://你的Domain",
    "https://你的Domain",
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 允許所有 HTTP 方法
    allow_headers=["*"],  # 允許所有標頭
)

# 定義硬體設備資料結構
class Hardware(BaseModel):
    category: str
    brand: str
    name: str
    spec: str
    batch: Optional[str] = None
    serialNumber: str
    trade: str
    warranty: int  # 保固月份
    price: float
    purchaseDate: str  # 購買日期，格式為 "YYYY-MM-DD"
    other: Optional[str] = None

# 連接 SQLite 資料庫
def get_db_connection():
    conn = sqlite3.connect('database.db')  # 使用指定的資料庫文件
    conn.row_factory = sqlite3.Row  # 使得返回的是字典型態資料
    return conn

# 建立資料表
def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Hardware_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            brand TEXT NOT NULL,
            name TEXT NOT NULL,
            spec TEXT NOT NULL,
            batch TEXT,
            serialNumber TEXT NOT NULL UNIQUE,
            trade TEXT NOT NULL,
            warranty INTEGER NOT NULL,
            price REAL NOT NULL,
            purchaseDate TEXT NOT NULL,
            warrantyDate TEXT,  -- 過保日欄位
            recordTime TEXT,
            other TEXT
        )
    ''')
    conn.commit()
    conn.close()

# 呼叫資料庫創建表格
create_table()

# 計算過保日
def calculate_warranty_date(purchase_date: str, warranty_months: int) -> str:
    purchase_date_obj = datetime.datetime.strptime(purchase_date, "%Y-%m-%d")  # 解析日期
    warranty_date_obj = purchase_date_obj + relativedelta(months=warranty_months)  # 使用 relativedelta 來正確處理月份
    return warranty_date_obj.strftime("%Y-%m-%d")  # 返回過保日的字串格式

# API :新增硬體設備
@app.post("/api/add_hardware")
async def add_hardware(hardware: Hardware):
    # 檢查必須的欄位是否提供
    if not hardware.category or not hardware.brand or not hardware.name:
        raise HTTPException(status_code=400, detail="Missing required fields")

    # 計算過保日
    warranty_date = calculate_warranty_date(hardware.purchaseDate, hardware.warranty)

    # 插入資料到資料庫
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 取得當下時間（格式：YYYY-MM-DD HH:MM:SS）
        record_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute('''
            INSERT INTO Hardware_entries (category, brand, name, spec, batch, serialNumber, trade, warranty, price, purchaseDate, warrantyDate, recordTime, other)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (hardware.category, hardware.brand, hardware.name, hardware.spec, hardware.batch, hardware.serialNumber, hardware.trade,
            hardware.warranty, hardware.price, hardware.purchaseDate, warranty_date, record_time, hardware.other))
        conn.commit()
    except sqlite3.IntegrityError:
        # 如果序號已經存在，返回錯誤
        conn.close()
        raise HTTPException(status_code=400, detail="Serial number already exists")

    conn.close()
    return {"message": "Hardware added successfully!"}

# API :查詢硬體資料
@app.get("/api/get_hardware_list")
async def get_hardware_list():
    # 連接數據庫
    conn = get_db_connection()
    cursor = conn.cursor()

    # 查詢數據庫
    cursor.execute("SELECT * FROM Hardware_entries")
    rows = cursor.fetchall()

    # 關閉數據庫連接
    conn.close()

    # 返回資料列表
    return [
        {
            "id": row["id"],
            "category": row["category"],
            "brand": row["brand"],
            "name": row["name"],
            "spec": row["spec"],
            "batch": row["batch"],
            "serialNumber": row["serialNumber"],
            "trade": row["trade"],
            "warranty": row["warranty"],
            "price": row["price"],
            "purchaseDate": row["purchaseDate"],
            "warrantyDate": row["warrantyDate"],  # 返回過保日
            "recordTime": row["recordTime"],
            "other": row["other"]
        }
        for row in rows
    ]

# API :刪除設備
@app.delete("/api/delete/{item_id}")
def delete_item(item_id: int):
    try:
        # 連接數據庫
        conn = get_db_connection()
        cursor = conn.cursor()

        # 檢查資料是否存在 (表名稱應為 Hardware_entries)
        cursor.execute("SELECT * FROM Hardware_entries WHERE id = ?", (item_id,))
        item = cursor.fetchone()
        if item is None:
            conn.close()  # 查無此資料時，應先關閉連線
            raise HTTPException(status_code=404, detail="設備未找到")

        # 執行刪除
        cursor.execute("DELETE FROM Hardware_entries WHERE id = ?", (item_id,))
        conn.commit()
        conn.close()

        return {"success": True}

    except Exception as e:
        if conn:
            conn.close()  # 確保即使出錯，也要關閉連線
        return {"success": False, "message": str(e)}
