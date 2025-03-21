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
read -p "請輸入您的目標反向代理域名 (如 IP 或 example.com): " DOMAIN
PROXY_URL="https://$DOMAIN"

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

# 啟動 Nginx 並設為開機自動啟動
sudo systemctl start nginx
sudo systemctl enable nginx

# 建立 SSL 憑證目錄並生成自簽證書
sudo mkdir -p /opt/SSL
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/SSL/private.key -out /opt/SSL/certificate.crt -days "$days" -nodes -subj "/CN=$DOMAIN"

# 設置適當的權限
sudo chmod 600 /opt/SSL/private.key
sudo chmod 644 /opt/SSL/certificate.crt

# 安裝 curl
sudo apt install curl unzip -y
# 安裝 SQLite 
# sudo apt install sqlite3 libsqlite3-dev
sudo apt install sqlitebrowser -y

# 安裝 Python
sudo apt install python3 python3-pip -y

# 因相依問題須手動安裝 python3-venv_3.12.3-0ubuntu2_amd64
sudo apt install python3.12-venv -y
sudo wget http://launchpadlibrarian.net/742881812/python3-venv_3.12.3-0ubuntu2_amd64.deb
sudo dpkg -i python3-venv_3.12.3-0ubuntu2_amd64.deb



# 4. 建立 Python 虛擬環境
echo "--------------------------------------------"
echo "--->>> 設置 Python 虛擬環境..."
echo "--------------------------------------------"

sudo -u "$ORIGINAL_USER" bash -c "
cd /home/$ORIGINAL_USER
python3 -m venv VM
source VM/bin/activate
pip install --upgrade pip
pip install python-dateutil fastapi uvicorn gunicorn
deactivate
"

# 5. 下載 Hardware System
echo "--------------------------------------------"
echo "--->>> 下載 Hardware System..."
echo "--------------------------------------------"
sudo wget -O "$SCRIPT_DIR/FastAPI.zip" $(curl -s https://api.github.com/repos/zz22558822/Hardware_System/releases/latest | grep "browser_download_url" | grep ".zip" | cut -d '"' -f 4)
sudo chmod -R 777 "$SCRIPT_DIR/FastAPI.zip"

# 6. 解壓縮並設置專案
echo "--------------------------------------------"
echo "--->>> 解壓縮 Hardware System 中..."
echo "--------------------------------------------"
mkdir -p /home/$ORIGINAL_USER/FastAPI
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
    export PYTHONPATH=$PYTHONPATH:/home/$ORIGINAL_USER/FastAPI/SQL
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
sudo tee /etc/nginx/sites-available/FastAPI <<EOF
server {
    listen 80;
    server_name $DOMAIN;  # 替換為你的域名或 IP 地址

    # 將所有流量重定向到 HTTPS
    return 301 https://$host$request_uri;
}

# HTTPS (443) 端口的設置
server {
    listen 443 ssl http2;
    server_name $DOMAIN;  # 替換為你的域名或 IP 地址

    # SSL 設置
    ssl_certificate /opt/SSL/certificate.crt;  # 證書路徑
    ssl_certificate_key /opt/SSL/private.key;  # 密鑰路徑

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers off;

    # 提供靜態文件
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

        # CORS 設置
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";

        # 預檢請求 OPTIONS 直接返回成功
        if (\$request_method = OPTIONS) {
            return 204;
        }
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


# 9. 更新 CORS 設定
echo "--------------------------------------------"
echo "--->>> 更新 CORS 設定..."
echo "--------------------------------------------"

MAIN_PY_PATH="/home/$ORIGINAL_USER/FastAPI/SQL/main.py"

if [ -f "$MAIN_PY_PATH" ]; then
    sudo sed -i "s|\"http://你的Domain\"|\"http://$DOMAIN\"|g" "$MAIN_PY_PATH"
    sudo sed -i "s|\"https://你的Domain\"|\"https://$DOMAIN\"|g" "$MAIN_PY_PATH"
    echo "CORS 設定已更新完成"
else
    echo "錯誤：找不到 main.py，請確認檔案已正確下載並放置到 $MAIN_PY_PATH"
    exit 1
fi



echo -e "\\n-----------------------------\\n"
echo "各檔案位置"
echo "Python 虛擬環境: /home/$ORIGINAL_USER/VM"
echo "Nginx 設定檔: /etc/nginx/sites-available/FastAPI"
echo "Hardware System: /home/$ORIGINAL_USER/FastAPI"
echo "SSL證書: /opt/SSL"
echo -e "\\n-----------------------------\\n"
echo "後端使用以下命令運行"
echo "啟動虛擬環境: source /home/$ORIGINAL_USER/VM/bin/activate"
echo "運行 FastAPI(擇一): uvicorn main:app --reload"
echo "                    gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app"
echo
echo "提示: 需切換至 FastAPI/SQL/  或者使用下列環境變數(會影響DB位置)"
echo "export PYTHONPATH=\$PYTHONPATH:/home/$ORIGINAL_USER/FastAPI/SQL"
echo -e "\\n-----------------------------\\n"
echo "Hardware System 安裝完成"
echo "使用Nginx + FastAPI + uvicorn + gunicorn"
echo
echo "證書效期: $days 天"
echo "反向代理: https://$DOMAIN"
echo -e "\\n-----------------------------"