# SnapFit — From Scratch to Execution
## Complete Development Roadmap: E-Commerce Platform → AI Size Recommendation Module

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Repository & Project Structure](#2-repository--project-structure)
3. [Phase 1 — Environment Setup](#3-phase-1--environment-setup)
4. [Phase 2 — Database Design](#4-phase-2--database-design)
5. [Phase 3 — Backend API (Node.js + Express)](#5-phase-3--backend-api-nodejs--express)
6. [Phase 4 — Frontend (React + Tailwind)](#6-phase-4--frontend-react--tailwind)
7. [Phase 5 — Authentication & Role System](#7-phase-5--authentication--role-system)
8. [Phase 6 — Core E-Commerce Features](#8-phase-6--core-e-commerce-features)
9. [Phase 7 — Admin Panel](#9-phase-7--admin-panel)
10. [Phase 8 — AI Microservice (Python)](#10-phase-8--ai-microservice-python)
11. [Phase 9 — SnapFit Integration into E-Commerce Platform](#11-phase-9--snapfit-integration-into-e-commerce-platform)
12. [Phase 10 — Feedback Loop & Analytics](#12-phase-10--feedback-loop--analytics)
13. [Phase 11 — Testing & Validation](#13-phase-11--testing--validation)
14. [Phase 12 — Deployment](#14-phase-12--deployment)
15. [API Reference Summary](#15-api-reference-summary)

---

## 1. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 | User interface |
| Backend | Node.js, Express.js | REST API server |
| Database | MongoDB, Mongoose ODM | Data persistence |
| Auth | JWT (jsonwebtoken), bcryptjs | Secure authentication |
| Email | Nodemailer / Resend | OTP, notifications |
| AI Microservice | Python 3.10+, FastAPI | Body measurement extraction |
| Pose Estimation | MediaPipe Pose | Body landmark detection |
| Numerical Computing | NumPy, SciPy | Measurement calculations |
| HTTP Client | Axios (frontend), requests (Python) | API communication |
| Charts | Recharts | Admin analytics dashboard |

---

## 2. Repository & Project Structure

```
ecommerce_snapfit/
│
├── backend/                        # Node.js + Express REST API
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Register / Login / OTP
│   │   ├── adminAuthController.js
│   │   ├── customerAuthController.js
│   │   ├── userAuthController.js
│   │   ├── passwordResetController.js
│   │   └── admin/                  # Admin feature controllers
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification middleware
│   │   └── adminAuth.js
│   ├── models/
│   │   ├── User.js                 # Base user schema
│   │   ├── Admin.js
│   │   ├── Customer.js
│   │   ├── Product.js              # Product + size chart data
│   │   ├── Order.js
│   │   ├── Coupon.js
│   │   ├── Notification.js
│   │   ├── BodyProfile.js          # [AI] User body measurements
│   │   ├── SizeRecommendation.js   # [AI] Recommendation history
│   │   └── FitFeedback.js          # [AI] Post-purchase feedback
│   ├── routes/
│   │   ├── auth.js
│   │   ├── adminRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── orders.js
│   │   └── snapfit.js              # [AI] SnapFit routes
│   ├── utils/
│   │   └── email.js
│   ├── .env
│   └── server.js
│
├── frontend/                       # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── AdminNav.jsx
│   │   │   ├── SnapFitWidget.jsx   # [AI] Size recommendation widget
│   │   │   └── BodyProfileCard.jsx # [AI] Saved body profile display
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── customer/
│   │   │   │   ├── CustomerProducts.jsx
│   │   │   │   ├── CustomerCart.jsx
│   │   │   │   ├── CustomerOrders.jsx
│   │   │   │   ├── CustomerProfile.jsx
│   │   │   │   ├── CustomerWishlist.jsx
│   │   │   │   └── SnapFitPage.jsx     # [AI] Full SnapFit flow page
│   │   │   └── Admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminAnalytics.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.mjs
│   └── tailwind.config.cjs
│
└── ai_service/                     # Python FastAPI microservice
    ├── main.py                     # FastAPI app entry point
    ├── routes/
    │   └── measure.py              # /analyze endpoint
    ├── services/
    │   ├── pose_estimation.py      # MediaPipe landmark extraction
    │   ├── measurement.py          # Pixel → cm conversion
    │   ├── body_type.py            # Body shape classification
    │   └── recommendation.py      # Size + fit prediction engine
    ├── models/
    │   └── schemas.py              # Pydantic request/response models
    ├── requirements.txt
    └── Dockerfile
```

---

## 3. Phase 1 — Environment Setup

### 3.1 Prerequisites

```bash
# Required software
node --version      # v18 or later
npm --version       # v9 or later
python --version    # 3.10 or later
mongod --version    # MongoDB 6.x
```

### 3.2 Clone and Bootstrap

```bash
git clone https://github.com/your-org/ecommerce_snapfit.git
cd ecommerce_snapfit
```

### 3.3 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see 3.4)
npm run dev        # starts nodemon on port 5000
```

### 3.4 Backend `.env` Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snapfit_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=re_xxxxxxxxxxxx      # or SMTP credentials for nodemailer
EMAIL_FROM=no-reply@snapfit.com
AI_SERVICE_URL=http://localhost:8000  # Python microservice base URL
```

### 3.5 Frontend Setup

```bash
cd frontend
npm install
npm run dev        # starts Vite dev server on port 5173
```

### 3.6 AI Microservice Setup

```bash
cd ai_service
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3.7 `ai_service/requirements.txt`

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
mediapipe==0.10.14
opencv-python-headless==4.9.0.80
numpy==1.26.4
scipy==1.13.0
Pillow==10.3.0
python-multipart==0.0.9
pydantic==2.7.1
requests==2.31.0
```

---

## 4. Phase 2 — Database Design

### 4.1 Existing Collections

#### `users`
```js
{
  _id, name, email, password (hashed),
  role: "customer" | "admin",
  isVerified, otp, otpExpiry,
  createdAt, updatedAt
}
```

#### `products`
```js
{
  _id, name, description, price,
  category: "clothing" | "electronics" | ...,
  stock, image, onSale, saleStart, saleEnd,
  discountPercent, isActive,
  // [AI addition — Phase 9]
  sizeChart: [{
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL",
    chest_cm, waist_cm, hip_cm, shoulder_cm, length_cm
  }],
  fitType: "slim" | "regular" | "loose",
  createdAt, updatedAt
}
```

#### `orders`
```js
{
  _id, customer (ref: User),
  items: [{ product (ref: Product), quantity, price }],
  totalAmount, status, shippingAddress,
  paymentMethod, paymentStatus,
  createdAt, updatedAt
}
```

#### `coupons`, `notifications` — standard structures

### 4.2 New Collections for AI Module

#### `bodyprofiles` — stores per-user body measurements
```js
{
  _id,
  user: ObjectId (ref: User),
  height_cm: Number,
  weight_kg: Number,
  shoulder_cm: Number,
  chest_cm: Number,
  waist_cm: Number,
  hip_cm: Number,
  torso_length_cm: Number,
  bodyType: "Hourglass" | "Pear" | "Rectangle" | "InvertedTriangle" | "Oval",
  lastAnalyzed: Date,
  createdAt, updatedAt
}
```

#### `sizerecommendations` — recommendation history
```js
{
  _id,
  user: ObjectId (ref: User),
  product: ObjectId (ref: Product),
  recommendedSize: String,
  fitLabel: "Tight" | "Perfect" | "Loose",
  confidenceScore: Number,           // 0–100
  measurementBreakdown: [{
    measurement: String,             // "chest", "waist", etc.
    userValue_cm: Number,
    chartValue_cm: Number,
    deviation_cm: Number,
    fitLabel: String
  }],
  alternativeSizes: [String],
  createdAt
}
```

#### `fitfeedbacks` — post-purchase feedback
```js
{
  _id,
  user: ObjectId (ref: User),
  order: ObjectId (ref: Order),
  product: ObjectId (ref: Product),
  recommendation: ObjectId (ref: SizeRecommendation),
  overallFit: "TooTight" | "SlightlyTight" | "Perfect" | "SlightlyLoose" | "TooLoose",
  measurementFeedback: [{
    measurement: String,
    feedback: "TooTight" | "Perfect" | "TooLoose"
  }],
  comment: String,
  createdAt
}
```

---

## 5. Phase 3 — Backend API (Node.js + Express)

### 5.1 Project Initialization

```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors nodemailer
npm install -D nodemon
```

### 5.2 `backend/config/db.js`

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
};

module.exports = connectDB;
```

### 5.3 `backend/server.js` — Entry Point

```js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/admin",    require("./routes/adminRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/snapfit",  require("./routes/snapfit"));   // AI routes

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
});
```

### 5.4 JWT Auth Middleware

```js
// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
```

### 5.5 Route Structure

```
POST   /api/auth/register            Register new user
POST   /api/auth/login               Login, receive JWT
POST   /api/auth/verify-otp          Verify email OTP
POST   /api/auth/forgot-password     Send reset OTP
POST   /api/auth/reset-password      Reset password with token

GET    /api/customer/products        List all active products
GET    /api/customer/products/:id    Product detail
POST   /api/customer/orders          Place an order
GET    /api/customer/orders          Customer order history
GET    /api/customer/cart            Get cart
POST   /api/customer/cart            Add to cart
DELETE /api/customer/cart/:productId Remove from cart
GET    /api/customer/profile         Get profile
PUT    /api/customer/profile         Update profile

GET    /api/admin/products           List all products
POST   /api/admin/products           Create product
PUT    /api/admin/products/:id       Update product + size chart
DELETE /api/admin/products/:id       Delete product
GET    /api/admin/orders             All orders
PUT    /api/admin/orders/:id         Update order status
GET    /api/admin/users              List all users
GET    /api/admin/analytics          Sales, orders, returns stats
POST   /api/admin/coupons            Create coupon
GET    /api/admin/notifications      All notifications

POST   /api/snapfit/analyze          [AI] Analyze image → measurements
GET    /api/snapfit/profile          [AI] Get saved body profile
PUT    /api/snapfit/profile          [AI] Update body profile
POST   /api/snapfit/recommend/:pid   [AI] Get recommendation for product
GET    /api/snapfit/history          [AI] Recommendation history
POST   /api/snapfit/feedback         [AI] Submit post-purchase feedback
```

---

## 6. Phase 4 — Frontend (React + Tailwind)

### 6.1 Project Initialization

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 6.2 `tailwind.config.cjs`

```js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

### 6.3 `src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### 6.4 `src/App.jsx` — Router Configuration

```jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerProducts from "./pages/customer/CustomerProducts";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerProfile from "./pages/customer/CustomerProfile";
import SnapFitPage from "./pages/customer/SnapFitPage";       // AI page
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Customer routes */}
        <Route path="/shop" element={<ProtectedRoute role="customer"><CustomerLayout /></ProtectedRoute>}>
          <Route index element={<CustomerProducts />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="cart" element={<CustomerCart />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="snapfit" element={<SnapFitPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}
```

### 6.5 Auth Context

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(() =>
    localStorage.getItem("token") || null
  );

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 7. Phase 5 — Authentication & Role System

### 7.1 Registration Flow

```
User fills form → POST /api/auth/register
→ Hash password (bcryptjs, saltRounds=10)
→ Generate 6-digit OTP
→ Save user (isVerified: false)
→ Send OTP via email (Resend / Nodemailer)
→ User submits OTP → POST /api/auth/verify-otp
→ Mark isVerified: true
→ Return JWT
```

### 7.2 Login Flow

```
POST /api/auth/login
→ Find user by email
→ bcrypt.compare(password, hash)
→ Check isVerified
→ Sign JWT: { id, role, email }
→ Return { token, user: { id, name, email, role } }
```

### 7.3 Password Reset Flow

```
POST /api/auth/forgot-password  → Send reset OTP to email
POST /api/auth/verify-reset-otp → Validate OTP, return temp token
POST /api/auth/reset-password   → Hash new password, save, clear OTP
```

### 7.4 JWT Payload Structure

```json
{
  "id": "64f3a...",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1710000000,
  "exp": 1710604800
}
```

---

## 8. Phase 6 — Core E-Commerce Features

### 8.1 Product Catalog

**Backend — `GET /api/customer/products`**
```js
const products = await Product.find({ isActive: true })
  .select("-__v")
  .sort({ createdAt: -1 });
res.json(products);
```

**Frontend — `CustomerProducts.jsx`**
- Fetch products on mount with `useEffect`
- Render product cards with image, name, price, discount badge
- Filter by category (dropdown)
- Search by name (controlled input)
- "Find My Size" button triggers SnapFit widget for clothing category

### 8.2 Cart Management

```
State: stored in localStorage (guest) + MongoDB (logged-in user)
Add to cart   → POST /api/customer/cart
Remove item   → DELETE /api/customer/cart/:productId
Update qty    → PUT /api/customer/cart/:productId
Get cart      → GET /api/customer/cart
Checkout      → POST /api/customer/orders (from cart data)
```

### 8.3 Order Lifecycle

```
pending → processing → shipped → delivered
                  ↘ cancelled
```

Order status updated by admin via `PUT /api/admin/orders/:id`.
Customer sees live status on `CustomerOrders.jsx`.

### 8.4 Coupon System

```
Admin creates coupon: { code, discountType, discountValue, minOrderValue, expiryDate, maxUses }
Customer applies code at checkout → POST /api/customer/validate-coupon
Backend validates: active, not expired, under maxUses, meets minimum order
Apply discount, record usage
```

### 8.5 Notifications

```
System generates notifications for:
  - Order placed (customer)
  - Order status change (customer)
  - New order received (admin)
  - Low stock alert (admin)
GET /api/admin/notifications → list unread
PUT /api/admin/notifications/:id/read → mark read
```

---

## 9. Phase 7 — Admin Panel

### 9.1 Admin Dashboard (`AdminDashboard.jsx`)

Cards showing:
- Total revenue (sum of completed orders)
- Total orders / pending orders
- Total products / low-stock products
- Total customers

Charts (using Recharts):
- Revenue over last 30 days (LineChart)
- Orders by status (PieChart)
- Top-selling products (BarChart)

### 9.2 Product Management with Size Charts

When admin creates/edits a clothing product, the form includes a **Size Chart Editor**:

```jsx
// SizeChartEditor.jsx
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const MEASUREMENTS = ["chest_cm", "waist_cm", "hip_cm", "shoulder_cm", "length_cm"];

// Render a grid: rows = sizes, columns = measurements
// Each cell is an <input type="number" />
// On save: POST/PUT product with sizeChart array
```

### 9.3 Order Management

Table with columns: Order ID, Customer, Items, Total, Status, Date, Actions.
Admin can change status from dropdown. Status change triggers customer notification.

### 9.4 Analytics (`AdminAnalytics.jsx`)

```
/api/admin/analytics returns:
{
  totalRevenue, totalOrders, totalCustomers,
  revenueByDay: [{ date, revenue }],
  ordersByStatus: { pending, processing, shipped, delivered, cancelled },
  topProducts: [{ product, totalSold, revenue }],
  // [AI addition]
  returnRateByProduct: [{ product, returnRate }],
  sizeRecommendationAccuracy: Number,
  bodyTypeDistribution: { Hourglass, Pear, Rectangle, InvertedTriangle, Oval }
}
```

---

## 10. Phase 8 — AI Microservice (Python)

### 10.1 FastAPI App Entry Point

```python
# ai_service/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.measure import router as measure_router

app = FastAPI(title="SnapFit AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # only Node.js backend
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.include_router(measure_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok", "service": "SnapFit AI"}
```

### 10.2 Pydantic Schemas

```python
# ai_service/models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class BodyType(str, Enum):
    hourglass          = "Hourglass"
    pear               = "Pear"
    rectangle          = "Rectangle"
    inverted_triangle  = "InvertedTriangle"
    oval               = "Oval"

class MeasurementResult(BaseModel):
    shoulder_cm:      float
    chest_cm:         float
    waist_cm:         float
    hip_cm:           float
    torso_length_cm:  float
    body_type:        BodyType

class SizeEntry(BaseModel):
    size:          str
    chest_cm:      float
    waist_cm:      float
    hip_cm:        float
    shoulder_cm:   float
    length_cm:     Optional[float] = None

class MeasurementBreakdownItem(BaseModel):
    measurement:   str
    user_value_cm: float
    chart_value_cm:float
    deviation_cm:  float
    fit_label:     str   # "Tight" | "Perfect" | "Loose"

class RecommendationResult(BaseModel):
    recommended_size:      str
    fit_label:             str
    confidence_score:      float        # 0–100
    breakdown:             List[MeasurementBreakdownItem]
    alternative_sizes:     List[str]
    measurements:          MeasurementResult
```

### 10.3 Pose Estimation Service

```python
# ai_service/services/pose_estimation.py
import mediapipe as mp
import cv2
import numpy as np
from PIL import Image
import io

mp_pose = mp.solutions.pose

def extract_landmarks(image_bytes: bytes) -> dict:
    """
    Run MediaPipe Pose on the image, return landmark pixel coordinates.
    Returns dict keyed by landmark name (LEFT_SHOULDER, RIGHT_HIP, etc.)
    """
    image_np = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w = img.shape[:2]

    with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
        results = pose.process(img_rgb)

    if not results.pose_landmarks:
        raise ValueError("No body detected in image. Ensure full body is visible.")

    landmarks = {}
    for lm in mp_pose.PoseLandmark:
        point = results.pose_landmarks.landmark[lm]
        landmarks[lm.name] = {
            "x": point.x * w,
            "y": point.y * h,
            "visibility": point.visibility
        }

    return landmarks, h, w
```

### 10.4 Measurement Extraction Service

```python
# ai_service/services/measurement.py
import numpy as np
from services.pose_estimation import extract_landmarks

def pixel_distance(p1: dict, p2: dict) -> float:
    return np.sqrt((p1["x"] - p2["x"])**2 + (p1["y"] - p2["y"])**2)

def extract_measurements(image_bytes: bytes, height_cm: float) -> dict:
    """
    Extract real-world body measurements from a single front-facing image.
    Uses height_cm as the scaling reference.
    """
    landmarks, img_h, img_w = extract_landmarks(image_bytes)

    # Pixel height of person: top of head (NOSE) to midpoint of ankles
    nose    = landmarks["NOSE"]
    l_ankle = landmarks["LEFT_ANKLE"]
    r_ankle = landmarks["RIGHT_ANKLE"]
    ankle_mid = {"x": (l_ankle["x"] + r_ankle["x"]) / 2,
                 "y": (l_ankle["y"] + r_ankle["y"]) / 2}

    pixel_height = pixel_distance(nose, ankle_mid)
    if pixel_height < 1:
        raise ValueError("Unable to determine body height from image.")

    scale = height_cm / pixel_height   # cm per pixel

    # --- Shoulder width ---
    l_shoulder = landmarks["LEFT_SHOULDER"]
    r_shoulder = landmarks["RIGHT_SHOULDER"]
    shoulder_px = pixel_distance(l_shoulder, r_shoulder)
    shoulder_cm = shoulder_px * scale

    # --- Hip width ---
    l_hip = landmarks["LEFT_HIP"]
    r_hip = landmarks["RIGHT_HIP"]
    hip_px = pixel_distance(l_hip, r_hip)
    hip_cm = hip_px * scale

    # --- Torso length ---
    shoulder_mid = {"x": (l_shoulder["x"] + r_shoulder["x"]) / 2,
                    "y": (l_shoulder["y"] + r_shoulder["y"]) / 2}
    hip_mid = {"x": (l_hip["x"] + r_hip["x"]) / 2,
               "y": (l_hip["y"] + r_hip["y"]) / 2}
    torso_px = pixel_distance(shoulder_mid, hip_mid)
    torso_length_cm = torso_px * scale

    # --- Chest and waist (circumference estimation via regression) ---
    # Based on empirical ratios: chest ≈ shoulder_width × 2.05,
    # waist ≈ hip_width × 1.55  (front-width to circumference factors)
    # These ratios are approximate and should be tuned on a validation dataset.
    chest_cm = shoulder_cm * 2.05
    waist_cm = hip_cm * 1.55

    return {
        "shoulder_cm":     round(shoulder_cm, 1),
        "chest_cm":        round(chest_cm, 1),
        "waist_cm":        round(waist_cm, 1),
        "hip_cm":          round(hip_cm * 2, 1),    # full circumference estimate
        "torso_length_cm": round(torso_length_cm, 1),
    }
```

### 10.5 Body Type Classification

```python
# ai_service/services/body_type.py

def classify_body_type(shoulder_cm: float, chest_cm: float,
                       waist_cm: float, hip_cm: float) -> str:
    """
    Ratio-based body shape classification into 5 standard categories.
    """
    shoulder_hip_diff = abs(shoulder_cm - hip_cm)
    waist_shoulder    = waist_cm / shoulder_cm if shoulder_cm else 1
    waist_hip         = waist_cm / hip_cm if hip_cm else 1

    # Hourglass: shoulders and hips are similar width, waist significantly smaller
    if shoulder_hip_diff <= 5 and waist_hip < 0.75:
        return "Hourglass"

    # Pear: hips noticeably wider than shoulders
    if hip_cm > shoulder_cm + 5:
        return "Pear"

    # Inverted Triangle: shoulders noticeably wider than hips
    if shoulder_cm > hip_cm + 5:
        return "InvertedTriangle"

    # Oval: waist is equal to or wider than shoulders and hips
    if waist_cm >= shoulder_cm or waist_cm >= hip_cm:
        return "Oval"

    # Rectangle: all measurements roughly similar
    return "Rectangle"
```

### 10.6 Recommendation Engine

```python
# ai_service/services/recommendation.py
from models.schemas import SizeEntry, MeasurementBreakdownItem, RecommendationResult

TOLERANCE_PERFECT = 3.0   # ±3 cm → Perfect fit
TOLERANCE_TIGHT   = 0.0   # below chart value → Tight
# above chart value + tolerance → Loose

MEASUREMENT_WEIGHTS = {
    "chest_cm":    0.35,
    "waist_cm":    0.30,
    "hip_cm":      0.20,
    "shoulder_cm": 0.15,
}

def predict_fit_label(user_val: float, chart_val: float) -> tuple[str, float]:
    """Returns (fit_label, deviation)"""
    deviation = user_val - chart_val
    abs_dev = abs(deviation)
    if abs_dev <= TOLERANCE_PERFECT:
        return "Perfect", deviation
    elif deviation < 0:
        return "Tight", deviation
    else:
        return "Loose", deviation

def score_size(user_measurements: dict, size_entry: SizeEntry) -> tuple[float, list]:
    """
    Compute a weighted deviation score for a size entry.
    Lower score = better fit.
    """
    total_score = 0.0
    breakdown = []

    for meas, weight in MEASUREMENT_WEIGHTS.items():
        user_val  = user_measurements.get(meas, 0)
        chart_val = getattr(size_entry, meas, 0)
        fit_label, deviation = predict_fit_label(user_val, chart_val)
        weighted  = abs(deviation) * weight
        total_score += weighted
        breakdown.append(MeasurementBreakdownItem(
            measurement=meas.replace("_cm", ""),
            user_value_cm=round(user_val, 1),
            chart_value_cm=round(chart_val, 1),
            deviation_cm=round(deviation, 1),
            fit_label=fit_label,
        ))

    return total_score, breakdown

def recommend_size(user_measurements: dict, size_chart: list[dict]) -> dict:
    """
    Compare user measurements against each size in the chart.
    Return best size with fit label, confidence, and alternatives.
    """
    entries = [SizeEntry(**s) for s in size_chart]
    scored  = []

    for entry in entries:
        score, breakdown = score_size(user_measurements, entry)
        scored.append((score, entry.size, breakdown))

    scored.sort(key=lambda x: x[0])   # lowest score = best fit
    best_score, best_size, best_breakdown = scored[0]

    # Overall fit label: majority vote across measurements
    labels = [b.fit_label for b in best_breakdown]
    overall_fit = max(set(labels), key=labels.count)

    # Confidence: map score (0 → 100%, higher → lower)
    max_possible_score = sum(MEASUREMENT_WEIGHTS.values()) * 15  # 15 cm max expected
    confidence = max(0, round(100 - (best_score / max_possible_score) * 100, 1))

    # Alternatives: next 1-2 best sizes
    alternatives = [s[1] for s in scored[1:3]]

    return {
        "recommended_size":  best_size,
        "fit_label":         overall_fit,
        "confidence_score":  confidence,
        "breakdown":         best_breakdown,
        "alternative_sizes": alternatives,
    }
```

### 10.7 API Route

```python
# ai_service/routes/measure.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.measurement import extract_measurements
from services.body_type import classify_body_type
from services.recommendation import recommend_size
from models.schemas import MeasurementResult, RecommendationResult
import json

router = APIRouter()

@router.post("/analyze", response_model=MeasurementResult)
async def analyze_image(
    image:      UploadFile = File(...),
    height_cm:  float      = Form(...),
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image.")
    if height_cm < 50 or height_cm > 250:
        raise HTTPException(400, "height_cm must be between 50 and 250.")

    image_bytes = await image.read()
    try:
        measurements = extract_measurements(image_bytes, height_cm)
    except ValueError as e:
        raise HTTPException(422, str(e))

    body_type = classify_body_type(
        measurements["shoulder_cm"],
        measurements["chest_cm"],
        measurements["waist_cm"],
        measurements["hip_cm"],
    )

    return {**measurements, "body_type": body_type}


@router.post("/recommend")
async def get_recommendation(
    image:      UploadFile = File(...),
    height_cm:  float      = Form(...),
    size_chart: str        = Form(...),   # JSON string
):
    image_bytes = await image.read()
    try:
        measurements = extract_measurements(image_bytes, height_cm)
    except ValueError as e:
        raise HTTPException(422, str(e))

    body_type = classify_body_type(
        measurements["shoulder_cm"],
        measurements["chest_cm"],
        measurements["waist_cm"],
        measurements["hip_cm"],
    )

    chart = json.loads(size_chart)
    if not chart:
        raise HTTPException(400, "size_chart cannot be empty.")

    result = recommend_size(measurements, chart)
    result["measurements"] = {**measurements, "body_type": body_type}
    return result
```

---

## 11. Phase 9 — SnapFit Integration into E-Commerce Platform

### 11.1 Node.js SnapFit Routes

```js
// backend/routes/snapfit.js
const express  = require("express");
const router   = express.Router();
const auth     = require("../middleware/auth");
const FormData = require("form-data");
const axios    = require("axios");
const BodyProfile         = require("../models/BodyProfile");
const SizeRecommendation  = require("../models/SizeRecommendation");
const Product             = require("../models/Product");

const AI_URL = process.env.AI_SERVICE_URL;

// POST /api/snapfit/analyze  — proxy to Python, save body profile
router.post("/analyze", auth, async (req, res) => {
  try {
    const { height_cm, weight_kg } = req.body;
    const imageFile = req.file;         // Multer middleware

    const form = new FormData();
    form.append("image", imageFile.buffer, {
      filename: imageFile.originalname,
      contentType: imageFile.mimetype,
    });
    form.append("height_cm", height_cm);

    const { data } = await axios.post(`${AI_URL}/api/analyze`, form, {
      headers: form.getHeaders(),
      timeout: 15000,
    });

    await BodyProfile.findOneAndUpdate(
      { user: req.user.id },
      { ...data, height_cm, weight_kg, user: req.user.id, lastAnalyzed: new Date() },
      { upsert: true, new: true }
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/snapfit/recommend/:productId
router.post("/recommend/:productId", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product || !product.sizeChart?.length)
      return res.status(400).json({ message: "Product has no size chart." });

    const profile = await BodyProfile.findOne({ user: req.user.id });
    if (!profile)
      return res.status(404).json({ message: "No body profile found. Please analyze first." });

    const form = new FormData();
    form.append("height_cm", profile.height_cm);
    form.append("size_chart", JSON.stringify(product.sizeChart));

    // Re-analyze if profile is recent, else use stored measurements
    const measurements = {
      shoulder_cm:     profile.shoulder_cm,
      chest_cm:        profile.chest_cm,
      waist_cm:        profile.waist_cm,
      hip_cm:          profile.hip_cm,
      torso_length_cm: profile.torso_length_cm,
    };

    // Call recommendation endpoint
    const { data } = await axios.post(`${AI_URL}/api/recommend`, {
      measurements,
      size_chart: product.sizeChart,
    });

    // Save recommendation record
    const rec = await SizeRecommendation.create({
      user:                req.user.id,
      product:             product._id,
      recommendedSize:     data.recommended_size,
      fitLabel:            data.fit_label,
      confidenceScore:     data.confidence_score,
      measurementBreakdown:data.breakdown,
      alternativeSizes:    data.alternative_sizes,
    });

    res.json({ ...data, recommendationId: rec._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

### 11.2 Frontend SnapFit Page

```jsx
// frontend/src/pages/customer/SnapFitPage.jsx
import { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SnapFitPage() {
  const { token } = useAuth();
  const [step, setStep] = useState("upload");   // upload | analyzing | results
  const [height, setHeight] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!imageFile || !height) {
      setError("Please upload an image and enter your height.");
      return;
    }
    setStep("analyzing");
    setError("");
    const form = new FormData();
    form.append("image", imageFile);
    form.append("height_cm", height);
    try {
      const { data } = await axios.post(`${API}/api/snapfit/analyze`, form, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setResults(data);
      setStep("results");
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
      setStep("upload");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">SnapFit — Find Your Size</h1>
      <p className="text-gray-500 mb-6">
        Upload a full-body front-facing photo to get AI-powered size recommendations.
      </p>

      {step === "upload" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Height (cm)</label>
            <input
              type="number" min="100" max="220" placeholder="e.g. 175"
              value={height} onChange={(e) => setHeight(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full-Body Photo</label>
            <input type="file" accept="image/*" onChange={handleImageChange}
              className="border rounded px-3 py-2 w-full" />
            {preview && (
              <img src={preview} alt="preview"
                className="mt-3 h-64 object-contain rounded border" />
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={handleAnalyze}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full">
            Analyze My Body
          </button>
        </div>
      )}

      {step === "analyzing" && (
        <div className="text-center py-16">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent
                          rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your body measurements...</p>
        </div>
      )}

      {step === "results" && results && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-semibold text-green-800 mb-2">Body Type: {results.body_type}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Shoulder", results.shoulder_cm],
                ["Chest",    results.chest_cm],
                ["Waist",    results.waist_cm],
                ["Hip",      results.hip_cm],
                ["Torso",    results.torso_length_cm],
              ].map(([label, val]) => (
                <div key={label} className="bg-white rounded p-2 border">
                  <span className="text-gray-500">{label}</span>
                  <span className="float-right font-medium">{val} cm</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Your body profile has been saved. Visit any clothing product to get a size recommendation!
          </p>
          <button onClick={() => setStep("upload")}
            className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded
                       hover:bg-indigo-50 w-full">
            Analyze Again
          </button>
        </div>
      )}
    </div>
  );
}
```

### 11.3 SnapFit Widget on Product Page

On the product detail page, when the product category is `"clothing"` and it has a `sizeChart`:

```jsx
// Embedded in CustomerProducts.jsx or a dedicated ProductDetail page
const [recommendation, setRecommendation] = useState(null);
const [loadingRec, setLoadingRec] = useState(false);

const getRecommendation = async (productId) => {
  setLoadingRec(true);
  try {
    const { data } = await axios.post(
      `${API}/api/snapfit/recommend/${productId}`, {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRecommendation(data);
  } catch (err) {
    alert(err.response?.data?.message || "Could not get recommendation.");
  } finally {
    setLoadingRec(false);
  }
};

// Render recommendation card
{recommendation && (
  <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
    <div className="flex items-center justify-between mb-2">
      <span className="font-semibold text-indigo-800">Recommended Size</span>
      <span className="text-2xl font-bold text-indigo-700">
        {recommendation.recommended_size}
      </span>
    </div>
    <div className="flex items-center gap-2 mb-3">
      <span className={`px-2 py-0.5 rounded text-sm font-medium
        ${recommendation.fit_label === "Perfect" ? "bg-green-100 text-green-700" :
          recommendation.fit_label === "Tight"   ? "bg-red-100 text-red-700"    :
                                                   "bg-yellow-100 text-yellow-700"}`}>
        {recommendation.fit_label}
      </span>
      <span className="text-sm text-gray-500">
        {recommendation.confidence_score}% confidence
      </span>
    </div>
    <div className="space-y-1">
      {recommendation.breakdown.map((b) => (
        <div key={b.measurement} className="flex justify-between text-xs text-gray-600">
          <span className="capitalize">{b.measurement}</span>
          <span>{b.user_value_cm}cm vs {b.chart_value_cm}cm
            ({b.deviation_cm > 0 ? "+" : ""}{b.deviation_cm}cm — {b.fit_label})</span>
        </div>
      ))}
    </div>
    {recommendation.alternative_sizes.length > 0 && (
      <p className="text-xs text-gray-400 mt-2">
        Alternatives: {recommendation.alternative_sizes.join(", ")}
      </p>
    )}
  </div>
)}
```

---

## 12. Phase 10 — Feedback Loop & Analytics

### 12.1 Post-Purchase Feedback

After an order is delivered, the customer sees a "How did it fit?" prompt on `CustomerOrders.jsx`:

```jsx
// FitFeedbackModal.jsx
const submitFeedback = async (orderId, productId, recommendationId, feedbackData) => {
  await axios.post(`${API}/api/snapfit/feedback`, {
    orderId, productId, recommendationId, ...feedbackData
  }, { headers: { Authorization: `Bearer ${token}` } });
};
```

```js
// backend route: POST /api/snapfit/feedback
router.post("/feedback", auth, async (req, res) => {
  const feedback = await FitFeedback.create({ ...req.body, user: req.user.id });
  res.json(feedback);
});
```

### 12.2 Recommendation Accuracy Tracking

```js
// backend/controllers/admin/analyticsController.js (AI additions)

// Accuracy: % of recommendations where user confirmed "Perfect"
const feedbacks = await FitFeedback.find();
const perfectCount = feedbacks.filter(f => f.overallFit === "Perfect").length;
const accuracy = feedbacks.length ? (perfectCount / feedbacks.length) * 100 : null;

// Return rate correlation (future: tag returned orders with fit cause)
```

### 12.3 Model Refinement Strategy

Collected feedback drives refinement in two ways:

1. **Scaling factor adjustment**: If repeated feedback shows measurements are consistently over/under-estimated, adjust the `scale` or circumference estimation ratios in `measurement.py`.

2. **Size chart bias correction**: If a specific product's recommendations are consistently wrong, flag the size chart for admin review (trigger notification).

---

## 13. Phase 11 — Testing & Validation

### 13.1 Backend API Testing (Manual / Postman)

```
Auth:
  ✓ Register → OTP → Verify → Login → receive JWT
  ✓ Invalid OTP rejected
  ✓ Expired token rejected

Products:
  ✓ Admin creates product with size chart
  ✓ Customer fetches product list
  ✓ Search and category filter works

Orders:
  ✓ Place order → stock decremented
  ✓ Admin updates status → customer notification

SnapFit:
  ✓ POST /api/snapfit/analyze with valid image → measurements returned + profile saved
  ✓ Analyze with no body visible → 422 error
  ✓ POST /api/snapfit/recommend/:id with body profile → recommendation returned
  ✓ No body profile → 404 error
  ✓ Product without size chart → 400 error
  ✓ POST /api/snapfit/feedback → saved to DB
```

### 13.2 AI Microservice Testing

```python
# Quick sanity test (run in ai_service/ directory)
import requests

# Test /health
r = requests.get("http://localhost:8000/health")
assert r.json()["status"] == "ok"

# Test /api/analyze
with open("test_images/sample_full_body.jpg", "rb") as f:
    r = requests.post("http://localhost:8000/api/analyze",
                      files={"image": f},
                      data={"height_cm": 175})
    print(r.json())
    # Expected: { shoulder_cm, chest_cm, waist_cm, hip_cm, torso_length_cm, body_type }
    assert r.status_code == 200
    assert "body_type" in r.json()
```

### 13.3 User Validation Study

**Objective:** Validate system accuracy against tape measurements.

**Protocol:**
1. Recruit a minimum of 20 test subjects.
2. Manually measure each subject's shoulder, chest, waist, hip, and torso.
3. Run the system on a full-body image of each subject (at the same height they provide).
4. Compute Mean Absolute Error (MAE) between system and tape measurements.
5. For 10+ clothing products with known size charts, ask subjects to confirm the recommended size.
6. Record: correct recommendation rate, user satisfaction (1–5 scale), simulated return avoidance.

**Target Metrics:**
- Measurement MAE: within acceptable tolerance per measurement
- Size recommendation correct rate: ≥ 80%
- User satisfaction score: ≥ 4 / 5
- Simulated return reduction: ≥ 25%

---

## 14. Phase 12 — Deployment

### 14.1 Docker Compose (Local / Server)

```yaml
# docker-compose.yml
version: "3.9"
services:
  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file: ./backend/.env
    depends_on:
      - mongo

  ai_service:
    build: ./ai_service
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

### 14.2 Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### 14.3 Backend Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### 14.4 AI Service Dockerfile

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 14.5 Environment Variables for Production

```env
# backend/.env (production)
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/snapfit
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=https://snapfit.yourdomain.com
AI_SERVICE_URL=http://ai_service:8000   # Docker service name
RESEND_API_KEY=re_xxxxxxxxxx
```

---

## 15. API Reference Summary

### Authentication

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | `{name, email, password, role}` | — | Register user |
| POST | `/api/auth/login` | `{email, password}` | — | Login, get JWT |
| POST | `/api/auth/verify-otp` | `{email, otp}` | — | Verify email OTP |
| POST | `/api/auth/forgot-password` | `{email}` | — | Send reset OTP |
| POST | `/api/auth/reset-password` | `{email, otp, newPassword}` | — | Reset password |

### Customer

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/customer/products` | JWT | List products |
| GET | `/api/customer/products/:id` | JWT | Product detail |
| GET/POST/DELETE | `/api/customer/cart` | JWT | Cart management |
| POST | `/api/customer/orders` | JWT | Place order |
| GET | `/api/customer/orders` | JWT | Order history |
| GET/PUT | `/api/customer/profile` | JWT | Profile management |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET/POST | `/api/admin/products` | Admin JWT | Products list / create |
| PUT/DELETE | `/api/admin/products/:id` | Admin JWT | Update / delete product |
| GET/PUT | `/api/admin/orders` | Admin JWT | Orders list / update status |
| GET | `/api/admin/users` | Admin JWT | All users |
| GET | `/api/admin/analytics` | Admin JWT | Sales analytics |
| GET/POST | `/api/admin/coupons` | Admin JWT | Coupons management |
| GET | `/api/admin/notifications` | Admin JWT | Notifications |

### SnapFit (AI)

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| POST | `/api/snapfit/analyze` | `form: {image, height_cm, weight_kg}` | JWT | Analyze image, save profile |
| GET | `/api/snapfit/profile` | — | JWT | Get saved body profile |
| PUT | `/api/snapfit/profile` | `{height_cm, weight_kg, ...}` | JWT | Update body profile manually |
| POST | `/api/snapfit/recommend/:productId` | — | JWT | Get size recommendation |
| GET | `/api/snapfit/history` | — | JWT | Recommendation history |
| POST | `/api/snapfit/feedback` | `{orderId, productId, recommendationId, overallFit, ...}` | JWT | Submit fit feedback |

### AI Microservice (Internal — Node.js → Python)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/health` | — | Service health check |
| POST | `/api/analyze` | `form: {image, height_cm}` | Extract measurements + body type |
| POST | `/api/recommend` | `JSON: {measurements, size_chart}` | Get size recommendation |

---

*This document covers the full development journey of SnapFit — from a bare e-commerce platform to a complete AI-powered size recommendation system. Each phase builds on the previous and can be developed and tested independently.*
