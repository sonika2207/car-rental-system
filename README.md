# 🚗 Car Rental System

A full-stack Car Rental System that allows users to browse available cars, register, log in, and rent vehicles. The application also provides an Admin Dashboard to manage cars and customers. The project is built using React, Flask, and MySQL and is deployed online.

## 🌐 Live Demo

**Frontend:** https://car-rental-system-azure-iota.vercel.app/

## 📌 Features

### 👤 User Features
- User Registration
- User Login
- View Available Cars
- Rent Cars
- View Customer Details

### 🔑 Admin Features
- Admin Login
- Add New Cars
- Update Car Details
- Delete Cars
- View All Cars
- Manage Customers

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- CSS
- JavaScript

### Backend
- Flask
- Flask-CORS
- Gunicorn

### Database
- MySQL

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: Railway MySQL

---

## 📂 Project Structure

```
car-rental-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── database.sql
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/sonika2207/car-rental-system.git
cd car-rental-system
```

---

### 2️⃣ Backend Setup

Navigate to backend folder

```bash
cd backend
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create MySQL database

```sql
CREATE DATABASE car_rental;
```

Import the SQL file

```bash
mysql -u root -p car_rental < database.sql
```

Run Flask server

```bash
python app.py
```

Backend runs on

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

Navigate to frontend

```bash
cd frontend
```

Install packages

```bash
npm install
```

Create a `.env` file

```env
VITE_API=http://localhost:5000
```

Run React application

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## 🗄️ Database Tables

- Users
- Customers
- Cars
- Rentals

---

## 🚀 Deployment

### Frontend

- Vercel

### Backend

- Railway

### Database

- Railway MySQL

---

## 📷 Screenshots

You can add screenshots here.

### Home Page

<img width="1918" height="1020" alt="image" src="https://github.com/user-attachments/assets/09149315-f589-4827-90c4-8c826d6d8c49" />


### Admin Dashboard

<img width="1918" height="1022" alt="image" src="https://github.com/user-attachments/assets/439ddaf9-0747-4645-8db9-4bf0575b7d55" />


### User Dashboard

<img width="1917" height="1017" alt="image" src="https://github.com/user-attachments/assets/c61d1ebc-120d-4c13-b7f8-9444d9135363" />


---

## 📚 Future Enhancements

- JWT Authentication
- Online Payment Integration
- Booking History
- Email Notifications
- Search & Filter Cars
- Image Upload for Cars
- Responsive Mobile Design

---

## 👩‍💻 Author

**Sonika**

GitHub:
https://github.com/sonika2207

---

## ⭐ If you like this project

Give this repository a ⭐ on GitHub!
