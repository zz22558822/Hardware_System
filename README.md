# Hardware System
## 電腦硬體設備管理系統

本專案提供完整的一鍵 Hardware System 佈署腳本，使用 Nginx + FastAPI + Uvicorn + Gunicorn 作為後端併發。


![Hardware_System cover](https://github.com/zz22558822/Hardware_System/blob/main/img/Hardware_System.png)  


Pages: https://zz22558822.github.io/Hardware_System/  

---


## **系統需求**
- Ubuntu 24.04 以上
- Python 3.8 以上
- Nginx
- SQLite
- `sudo` 權限


## **安裝步驟**
### **1. 下載並執行安裝腳本**
若環境僅用於此專案可使用非 venv版本，兩者擇一使用
#### 無venv版本
```bash
sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/zz22558822/Hardware_System/main/SQL/Hardware_System_install.sh)"
```
#### venv版本
```bash
sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/zz22558822/Hardware_System/main/SQL/Hardware_System_install_venv.sh)"
```


### **2. 輸入必要資訊**
執行腳本後，請依照指示輸入：
- **Domain (可輸入 IP 或網址)**
- **SSL 憑證有效天數 (預設 36499 天)**



### **3. 啟動 FastAPI**
安裝完成後，切換至 FastAPI 目錄並啟動虛擬環境：
```bash
cd /home/$(whoami)/FastAPI
source /home/$(whoami)/VM/bin/activate
uvicorn main:app --reload
```

或使用 Gunicorn 啟動：
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### **4. 完成**
開啟 Web 即可使用:  
```bash
https://your-domain
```



<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

---

# 下列若有需還調整時才使用

## **Nginx 反向代理設定**
安裝腳本會自動配置 Nginx，提供 HTTPS 支援。
若需修改 Nginx 設定，請編輯：
```bash
sudo nano /etc/nginx/sites-available/FastAPI
```
修改完成後，重新載入 Nginx：
```bash
sudo systemctl restart nginx
```

## **CORS 設定**
腳本會自動修改 `main.py` 內的 CORS 設定，確保 `http://your-domain` 和 `https://your-domain` 可正常存取 API。

## **常見問題**
### **1. FastAPI 啟動後無法訪問？**
- 確保防火牆允許 8000 和 443 端口：
  ```bash
  sudo ufw allow 8000
  sudo ufw allow 443
  ```
- 檢查 FastAPI 是否有正常執行：
  ```bash
  ps aux | grep uvicorn
  ```

### **2. Nginx 服務未啟動？**
- 測試 Nginx 配置是否正確：
  ```bash
  sudo nginx -t
  ```
- 重新啟動 Nginx：
  ```bash
  sudo systemctl restart nginx
  ```




## **移除安裝**
若需移除 Hardware System，可執行以下命令：
```bash
sudo systemctl stop nginx
sudo rm -rf /home/$(whoami)/FastAPI
sudo rm -rf /home/$(whoami)/VM
sudo rm -f /etc/nginx/sites-available/FastAPI
sudo rm -f /etc/nginx/sites-enabled/FastAPI
sudo systemctl restart nginx
```

## **授權**
本專案基於 MIT License 發布，自由使用與修改。
