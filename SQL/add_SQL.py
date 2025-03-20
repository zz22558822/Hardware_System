import sqlite3

# 連接到數據庫（如果不存在，則會創建新的數據庫文件）
conn = sqlite3.connect('database.db')

# 創建一個游標對象
cursor = conn.cursor()

# 創建數據表
cursor.execute('''CREATE TABLE IF NOT EXISTS Hardware_entries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category TEXT,
                    brand TEXT,
                    name TEXT,
                    spec TEXT,
                    batch TEXT,
                    serialNumber TEXT,
                    trade DATE,
                    warranty INTEGER,
                    price INTEGER,
                    purchaseDate DATE,
                    warrantyDate DATE,
                    recordTime DATE,
                    other TEXT
                )''')

# # 插入數據
# data_to_insert = (
#     'HDD',             # category
#     'SeaGate',         # brand
#     'Exos X18',       # name
#     '16TB',            # spec
#     'Batch001',        # batch
#     'ST16000NM000J',   # serialNumber
#     '蝦皮',            # trade
#     60,                # warranty
#     16840,             # price
#     '2025/03/06',      # purchaseDate
#     '2030/03/06',      # warrantyDate
#     '2022/03/06 15:00:21',      # recordTime
#     ''        # other
# )
# cursor.execute("""
#     INSERT INTO Hardware_entries(
#         category, brand, name, spec, batch, serialNumber, trade, 
#         warranty, price, purchaseDate, warrantyDate, other
#     ) 
#     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
# """, data_to_insert)

# 提交更改並關閉連接
conn.commit()
conn.close()
