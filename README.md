# Car Rental System
MySQL + Flask + React + Tailwind CSS

## Project Structure

car-rental-system/
│
├── setup.sql                  ← Run this first in MySQL
│
├── backend/
│   ├── app.py                 ← Flask API (all routes)
│   ├── db.py                  ← MySQL connection
│   └── requirements.txt       ← Python dependencies
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        └── pages/
            ├── Home.jsx
            ├── AdminLogin.jsx
            ├── AdminDashboard.jsx
            ├── UserLogin.jsx
            ├── UserRegister.jsx
            └── UserDashboard.jsx

Prerequisites

Make sure these are installed:

| Tool | Version |
|------|---------|
| Python | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |
| npm | 9+ |

Step 1 — Database Setup

Open MySQL and run the setup script:

```bash
mysql -u root -p < setup.sql
```

Or manually in MySQL console:

```sql
source /path/to/car-rental-system/setup.sql
```

This creates:
- Database: `car_rental`
- Tables: `users`, `customers`, `cars`, `rentals`
- Sample cars (5 cars pre-loaded)

 Step 2 — Backend Setup (Flask)


# Navigate to backend folder
cd crental/backend

# (Optional) Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py

Flask runs at: **http://localhost:5000**

Step 3 — Frontend Setup (React)

Open a **new terminal**:


# Navigate to frontend folder
cd crental/frontend

# Install dependencies
npm install

# Start React dev server
npm run dev


React runs at: **http://localhost:5173**

 Running the App

| Service | Command | URL |
|---------|---------|-----|
| Backend | `python app.py` | http://localhost:5000 |
| Frontend | `npm run dev` | http://localhost:5173 |

Open **http://localhost:5173** in your browser.


Login Credentials

### Admin
- **Password:** `1234`

### User
- Register a new account via the Register page
- Then login with your email and password



API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/login` | Admin login |
| POST | `/user/register` | Register new user |
| POST | `/user/login` | User login |
| GET | `/cars` | Get all cars |
| GET | `/available_cars` | Get available cars only |
| POST | `/add_car` | Add a new car (admin) |
| POST | `/rent_car` | Rent a car |
| POST | `/return_car` | Return a car |
| GET | `/rentals` | Get all rentals |
| GET | `/rentals/user/<id>` | Get rentals for a user |
| GET | `/customers` | Get all customers |

Features

### Admin
- Login with password (`1234`)
- View all cars with status
- Add new cars to the fleet
- View all rental records
- View all customers

### User
- Register & login
- Browse available cars
- Rent a car (auto-calculates price)
- Return a rented car
- View personal rental history
- See bill popup after renting

