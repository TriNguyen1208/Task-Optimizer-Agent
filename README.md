# Project Name

> A web application designed to provide analytics and predictions of working time of this tasks. Additionally, it analyzes and identifies the most suitable schedule for different types of tasks. The ultimate goal is to empower users to manage and allocate their time optimally for peak productivity.

---

## 📌 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Overview
> A web application that helps users predict working time and allocate schedules efficiently. In addition to AI-powered features, the platform includes core functionalities such as user authentication (login and registration), dark mode settings, an option to enable or disable automatic scheduling, and user profile input to provide personal data that allows the AI to make more accurate predictions.

---

## 🛠 Tech Stack
- **Language:** JavaScript (ESM), Python
- **Backend:** Node.js, ExpressJS, FastAPI, Langchain, OPIK
- **Frontend** ReactJS
- **Database:** PostgreSQL
- **Authentication:** JWT / Cookies, Bcript
- **Other:** Docker

---

## ✨ Features
- User authentication (login / register)
- CRUD operations
- Role-based access control
- API Gateway support
- Logging & error handling
- AI feature

---

## 📂 Project Structure
```text
Task-Optimizer-Agent/
├── ai-services/
│   ├── ai_services.py
│   ├── data_services.py
│   ├── requirements.txt
│   ├── server.py
│   ├── Dockerfile
│   └── .env.example
├── api-gateway/
│   ├── src/
│   │   ├── configs/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── crud-services/
│   ├── src/
│   │   ├── configs/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── public
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constant/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── slices/
│   │   ├── utils/
│   │   ├── app.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── store.js
│   ├── index.html
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── .env.example
├── README.md
└── docker-compose.yml
```
---

## ⚙️ Installation
### Prerequisites:
```text
Node.js: v20.x or higher (Recommended)
npm: v10.x or higher
Python: v3.10+
Docker & Docker Compose
```
### Setup Steps
1. Clone the repository
```bash
https://github.com/TriNguyen1208/Task-Optimizer-Agent.git
cd Task-Optimizer-Agent
```
2. Install dependencies (Local Development): 
For Node services:
```bash
cd api-gateway && npm install
cd ../crud-services && npm install
cd ../frontend && npm install
```
For AI services:
```bash
cd ../ai-services && pip install -r requirements.txt
```
## 🔑 Environment Variables
Each service requires its own .env file. Copy the provided .env.example files:
```bash
cp .env.example .env # Repeat inside ai-services, api-gateway, crud-services, and frontend folders
```

## 🚀 Running the Project
1. Running using docker compose
```bash
docker-compose up --build
```
Once started:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- CRUD Service: http://localhost:3001
- AI Service: http://localhost:3002

2. Running without docker compose

```bash
cd frontend && npm run dev
cd api-gateway && npm run dev
cd crud-services && npm run dev
cd ai-services && uvicorn server:app --port 3002 --reload
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## 📜 License
This project is licensed under the [MIT](#mit) License.