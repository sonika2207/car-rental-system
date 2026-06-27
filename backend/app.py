from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {
        "message": "Car Rental Backend is Running!",
        "status": "success"
    }
ADMIN_PASSWORD = "1234"

# ─────────────────────────────────────────────
# ADMIN
# ─────────────────────────────────────────────

@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    if data.get("password") == ADMIN_PASSWORD:
        return jsonify({"success": True, "message": "Admin login successful"})
    return jsonify({"success": False, "message": "Invalid password"}), 401


# ─────────────────────────────────────────────
# USER AUTH
# ─────────────────────────────────────────────

@app.route("/user/register", methods=["POST"])
def user_register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Email already registered"}), 409

        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, password)
        )
        conn.commit()
        user_id = cursor.lastrowid
        return jsonify({"success": True, "message": "Registration successful", "user_id": user_id, "name": name})
    finally:
        cursor.close()
        conn.close()


@app.route("/user/login", methods=["POST"])
def user_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"success": False, "message": "Email and password required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()
        if user:
            return jsonify({"success": True, "message": "Login successful", "user_id": user["user_id"], "name": user["name"]})
        return jsonify({"success": False, "message": "Invalid credentials"}), 401
    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# CARS
# ─────────────────────────────────────────────

@app.route("/cars", methods=["GET"])
def get_all_cars():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM cars")
        cars = cursor.fetchall()
        return jsonify(cars)
    finally:
        cursor.close()
        conn.close()


@app.route("/available_cars", methods=["GET"])
def get_available_cars():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM cars WHERE status = 'Available'")
        cars = cursor.fetchall()
        return jsonify(cars)
    finally:
        cursor.close()
        conn.close()


@app.route("/add_car", methods=["POST"])
def add_car():
    data = request.get_json()
    car_id = data.get("car_id")
    car_name = data.get("car_name")
    brand = data.get("brand")
    price_per_day = data.get("price_per_day")
    status = data.get("status", "Available")

    if not all([car_id, car_name, brand, price_per_day]):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM cars WHERE car_id = %s", (car_id,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Car ID already exists"}), 409

        cursor.execute(
            "INSERT INTO cars (car_id, car_name, brand, price_per_day, status) VALUES (%s, %s, %s, %s, %s)",
            (car_id, car_name, brand, price_per_day, status)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Car added successfully"})
    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# RENTALS
# ─────────────────────────────────────────────

@app.route("/rent_car", methods=["POST"])
def rent_car():
    data = request.get_json()
    customer_id = data.get("customer_id")
    name = data.get("name")
    phone = data.get("phone")
    car_id = data.get("car_id")
    days = data.get("days")

    if not all([name, phone, car_id, days]):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Check car availability
        cursor.execute("SELECT * FROM cars WHERE car_id = %s AND status = 'Available'", (car_id,))
        car = cursor.fetchone()
        if not car:
            return jsonify({"success": False, "message": "Car not available"}), 400

        # Insert or get customer
        if customer_id:
            cursor.execute("SELECT * FROM customers WHERE customer_id = %s", (customer_id,))
            existing = cursor.fetchone()
            if not existing:
                cursor.execute(
                    "INSERT INTO customers (customer_id, name, phone) VALUES (%s, %s, %s)",
                    (customer_id, name, phone)
                )
                conn.commit()
                cust_id = customer_id
            else:
                cust_id = existing["customer_id"]
        else:
            cursor.execute("SELECT * FROM customers WHERE phone = %s", (phone,))
            existing = cursor.fetchone()
            if existing:
                cust_id = existing["customer_id"]
            else:
                cursor.execute(
                    "INSERT INTO customers (name, phone) VALUES (%s, %s)",
                    (name, phone)
                )
                conn.commit()
                cust_id = cursor.lastrowid

        # Calculate total price
        total_price = car["price_per_day"] * int(days)

        # Insert rental
        cursor.execute(
            "INSERT INTO rentals (car_id, customer_id, days, total_price) VALUES (%s, %s, %s, %s)",
            (car_id, cust_id, days, total_price)
        )

        # Update car status
        cursor.execute("UPDATE cars SET status = 'Rented' WHERE car_id = %s", (car_id,))
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Car rented successfully",
            "customer_id": cust_id,
            "car_name": car["car_name"],
            "brand": car["brand"],
            "days": days,
            "price_per_day": car["price_per_day"],
            "total_price": total_price
        })
    finally:
        cursor.close()
        conn.close()


@app.route("/return_car", methods=["POST"])
def return_car():
    data = request.get_json()
    car_id = data.get("car_id")

    if not car_id:
        return jsonify({"success": False, "message": "Car ID is required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM cars WHERE car_id = %s", (car_id,))
        car = cursor.fetchone()
        if not car:
            return jsonify({"success": False, "message": "Car not found"}), 404
        if car["status"] == "Available":
            return jsonify({"success": False, "message": "Car is already available (not rented)"}), 400

        cursor.execute("UPDATE cars SET status = 'Available' WHERE car_id = %s", (car_id,))
        conn.commit()
        return jsonify({"success": True, "message": f"Car {car_id} returned successfully"})
    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# REPORTS
# ─────────────────────────────────────────────

@app.route("/rentals", methods=["GET"])
def get_rentals():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT r.rental_id, r.car_id, c.car_name, c.brand,
                   cu.name AS customer_name, cu.phone,
                   r.days, r.total_price
            FROM rentals r
            JOIN cars c ON r.car_id = c.car_id
            JOIN customers cu ON r.customer_id = cu.customer_id
        """)
        rentals = cursor.fetchall()
        return jsonify(rentals)
    finally:
        cursor.close()
        conn.close()


@app.route("/rentals/user/<int:user_id>", methods=["GET"])
def get_user_rentals(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Match rentals via customer phone linked to user email name pattern
        # We join via customer_id that was created for this user
        cursor.execute("""
            SELECT r.rental_id, r.car_id, c.car_name, c.brand,
                   cu.name AS customer_name, cu.phone,
                   r.days, r.total_price, r.customer_id
            FROM rentals r
            JOIN cars c ON r.car_id = c.car_id
            JOIN customers cu ON r.customer_id = cu.customer_id
            WHERE r.customer_id = %s
        """, (user_id,))
        rentals = cursor.fetchall()
        return jsonify(rentals)
    finally:
        cursor.close()
        conn.close()


@app.route("/customers", methods=["GET"])
def get_customers():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM customers")
        customers = cursor.fetchall()
        return jsonify(customers)
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
