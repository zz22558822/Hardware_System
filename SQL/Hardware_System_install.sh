#!/bin/bash

set -e  # 遇到錯誤立即停止腳本

# 獲取使用者名稱
ORIGINAL_USER=$SUDO_USER
if [ -z "$ORIGINAL_USER" ]; then
    echo "無法取得原始使用者名稱。"
    exit 1
fi

# 獲取當前腳本的絕對路徑
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. 讓用戶選擇 Domain、證書效期
echo "--------------------------------------------"
# 讓用戶輸入目標反向代理域名
read -p "請輸入您的目標反向代理域名 (如 IP 或 example.com): " DOMAIN
PROXY_URL="https://$DOMAIN"

# 讓用戶輸入 SSL 證書的有效期限
read -p "請輸入 SSL 證書的有效天數 (默認為 36499): " days
if [[ ! "$days" =~ ^[1-9][0-9]*$ ]] || ((days < 1 || days > 36500)); then
    echo "無效的天數，將使用默認值 36499 天。"
    days=36499
fi

# 2. 更新系統
echo "--------------------------------------------"
echo "--->>> 更新系統..."
echo "--------------------------------------------"
sudo apt update && sudo apt upgrade -y

# 3. 安裝應用
echo "--------------------------------------------"
echo "--->>> 安裝應用..."
echo "--------------------------------------------"
# 安裝 Nginx
sudo apt install -y nginx

# Nginx 開機自動啟動
sudo systemctl start nginx
sudo systemctl enable nginx

# 建立 SSL 憑證目錄並生成自簽證書
sudo mkdir -p /opt/SSL
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/SSL/private.key -out /opt/SSL/certificate.crt -days "$days" -nodes -subj "/CN=$DOMAIN"

# 設置適當的權限
sudo chmod 600 /opt/SSL/private.key
sudo chmod 644 /opt/SSL/certificate.crt

# 安裝 curl
sudo apt install curl -y

# 安裝 Python
sudo apt install python3 python3-pip -y

# 安裝 SQLite 
# sudo apt install sqlite3 libsqlite3-dev
sudo apt install sqlitebrowser -y

# 安裝 FastAPI、uvicorn
sudo apt install uvicorn gunicorn -y
pip install --break-system-packages python-dateutil


# 5. 下載 Hardware System
echo "--------------------------------------------"
echo "--->>> 下載 Hardware System..."
echo "--------------------------------------------"
sudo wget -O "$SCRIPT_DIR/FastAPI.zip" $(curl -s https://api.github.com/repos/zz22558822/Hardware_System/releases/latest | grep "browser_download_url" | grep ".zip" | cut -d '"' -f 4)
sudo chmod -R 777 "$SCRIPT_DIR/FastAPI.zip"


# 6. 解壓縮覆蓋檔案
echo "--------------------------------------------"
echo "--->>> 解壓縮 Hardware System 中..."
echo "--------------------------------------------"
# 建立專案資料夾
mkdir /home/$ORIGINAL_USER/FastAPI
sudo unzip -o "$SCRIPT_DIR/FastAPI.zip" -d "/home/$ORIGINAL_USER/FastAPI"
sudo chmod -R 777 "/home/$ORIGINAL_USER/FastAPI"
sudo rm -f "$SCRIPT_DIR/FastAPI.zip"


# 7. 檔案覆蓋
echo "--------------------------------------------"
echo "--->>> 正在安裝 Hardware System 中..."
echo "--------------------------------------------"
if [ -d "/home/$ORIGINAL_USER/FastAPI" ]; then
    sudo cp "/home/$ORIGINAL_USER/FastAPI/index.html" "/var/www/html/index.html"
    sudo cp -r "/home/$ORIGINAL_USER/FastAPI/css" "/var/www/html/css"
    sudo cp -r "/home/$ORIGINAL_USER/FastAPI/js" "/var/www/html/js"
    sudo cp -r "/home/$ORIGINAL_USER/FastAPI/img" "/var/www/html/img"
    sudo cp -r "/home/$ORIGINAL_USER/FastAPI/SQL/FastAPI" "/etc/nginx/sites-available/FastAPI"
else
    echo "--------------------------------------------"
    echo "--->>> 錯誤：找不到 'FastAPI' 資料夾。請確認腳本所在目錄結構正確。"
    echo "--------------------------------------------"
    exit 1
fi


# 8. 設定反向代理
echo "--------------------------------------------"
echo "--->>> 設定反向代理..."
echo "--------------------------------------------"
# 配置 Nginx
sudo tee /etc/nginx/sites-available/FastAPI <<EOF
# HTTP (80) 端口的設置，將流量重定向到 HTTPS
server {
    listen 80;
    server_name $DOMAIN;  # 替換為你的域名或 IP 地址

    # 將所有流量重定向到 HTTPS
    return 301 https://$host$request_uri;
}

# HTTPS (443) 端口的設置
server {
    listen 443 ssl;
    server_name $DOMAIN;  # 替換為你的域名或 IP 地址

    # SSL 設置
    ssl_certificate /opt/SSL/certificate.crt;  # 替換為你的證書路徑
    ssl_certificate_key /opt/SSL/private.key;  # 替換為你的密鑰路徑

    # SSL 配置（可選，你可以根據需要添加）
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers off;

    # 提供靜態文件 (index.html)
    location / {
        root /var/www/html;  # 靜態文件的根目錄
        index index.html;
    }

    # FastAPI 路由的反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:8000;  # FastAPI 運行的 Port
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 檢查並刪除已存在的符號連結
if [ -L /etc/nginx/sites-enabled/FastAPI ]; then
    echo "檔案已存在，正在刪除舊的符號連結..."
    sudo rm -f /etc/nginx/sites-enabled/FastAPI
fi

# 建立新的符號連結
sudo ln -s /etc/nginx/sites-available/FastAPI /etc/nginx/sites-enabled/

# 刪除預設的符號連結
sudo rm -f /etc/nginx/sites-enabled/default

# 檢查 Nginx 設定並重新啟動
sudo nginx -t
sudo systemctl restart nginx
















echo -e "\\n-----------------------------\\n"
echo "Hardware System 安裝完成"
echo "使用Nginx + FastAPI + uvicorn + gunicorn"
echo
echo "證書效期: $days 天"
echo "反向代理: https://$DOMAIN"
echo -e "\\n-----------------------------"