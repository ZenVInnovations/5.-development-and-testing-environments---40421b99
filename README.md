# 🖥️ Application Performance Monitoring (APM) Web App

This project is a lightweight Application Performance Monitoring (APM) web application built using **Flask (Python)**, **HTML/CSS**, and **JavaScript**. It provides a real-time dashboard to monitor system metrics such as **CPU usage**, **RAM usage**, and **Network activity**.

## 🚀 Features

- ✅ Real-time monitoring of system metrics
- ✅ Interactive dashboard with Chart.js
- ✅ Secure user login using Flask-Login
- ✅ Metrics stored in SQLite database
- ✅ Ready for deployment to IBM Cloud (Cloud Foundry)

---

## 📸 Screenshots

> Add screenshots here if available

---

## 🛠️ Tech Stack

| Component        | Technology            |
|------------------|------------------------|
| Backend          | Python, Flask          |
| Frontend         | HTML, CSS, JS, Chart.js|
| Authentication   | Flask-Login            |
| Database         | SQLite                 |
| System Metrics   | psutil (Python lib)    |
| Cloud Platform   | IBM Cloud              |

---

## 🔧 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/apm-dashboard.git
cd apm-dashboard
```

### 2. Create Virtual Environment (Windows)

```bash
python -m venv venv
.env\Scriptsctivate
```

> On macOS/Linux:
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Application

```bash
python app.py
```

### 5. Access in Browser

Visit: [http://127.0.0.1:5000/login](http://127.0.0.1:5000/login)

- **Username:** `admin`  
- **Password:** `admin`

---

## ☁️ Deploying to IBM Cloud

### 1. Prerequisites

- IBM Cloud CLI: [Install Instructions](https://cloud.ibm.com/docs/cli)
- Create a Cloud Foundry App

### 2. Log in and Target Your Org

```bash
ibmcloud login
ibmcloud target --cf
```

### 3. Deploy the App

```bash
ibmcloud cf push
```

> Make sure you have a `manifest.yml` file in your project root.

---

## 📂 Project Structure

```
apm-dashboard/
├── app.py
├── apm.db
├── templates/
│   ├── login.html
│   └── dashboard.html
├── static/
│   └── styles.css
├── requirements.txt
├── manifest.yml
└── README.md
```

---

## 🧠 Future Enhancements

- 🔒 Secure password hashing
- 📈 Historical metrics graphs
- 📧 Email alerts for threshold breaches
- 🧾 Export reports to CSV
- 👥 Multi-user support and roles

 