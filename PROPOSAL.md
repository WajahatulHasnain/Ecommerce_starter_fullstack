# SnapFit: AI-Based Size Recommendation and Body Measurement Estimation System

---

## 1. Project Title

**SnapFit: AI-Based Size Recommendation and Body Measurement Estimation System**

---

## 2. Project Overview

### 2.1 Problem Statement

Online clothing retail suffers from one of the highest return rates among all e-commerce verticals, with size and fit mismatches being the leading cause. Customers cannot try on garments before purchase, and the size labels used by different brands are inconsistent and often unreliable. This results in significant financial losses for retailers, increased logistics costs, and environmental waste from unnecessary shipping cycles. Existing virtual fitting solutions are either prohibitively expensive, limited to specific body demographics, or require specialized hardware not available to mainstream consumers.

### 2.2 Proposed Solution

SnapFit is an AI-powered size recommendation module integrated into a fully functional e-commerce clothing platform. The system allows a customer to upload a single full-body photograph and provide their height. A Python-based AI microservice then extracts key body measurements from the image using pose estimation, classifies the user's body type, and compares the extracted measurements against the garment's size chart to recommend the best-fit size — along with a confidence score and a per-measurement fit breakdown (Tight / Perfect / Loose).

The platform is built on an existing MERN-adjacent stack: React and Tailwind CSS on the frontend, Node.js and Express on the backend, and MongoDB for data persistence. The AI component runs as a separate Python microservice, keeping the two concerns cleanly decoupled. User body profiles are stored persistently, so returning customers receive instant recommendations without re-uploading. A post-purchase feedback loop collects real-world fit outcomes to support ongoing accuracy improvement.

### 2.3 Significance

SnapFit targets a measurable real-world outcome: a reduction in size-based product returns. It is designed to generalize across body types, brand-specific sizing standards, and garment categories, making it applicable beyond any single retailer. The system is privacy-first by design — body images are processed in memory and never stored; only numerical measurements are retained.

---

## 3. Goals and Objectives

### 3.1 Goals

1. Reduce size-based product returns by giving customers AI-driven size guidance before completing a purchase.
2. Build a self-improving recommendation system that refines accuracy over time through post-purchase feedback.
3. Deliver a generalized size engine that works across diverse body types, clothing brands, and regional sizing conventions.

### 3.2 Objectives

| # | Objective | Success Metric |
|---|-----------|----------------|
| O1 | Extract five key body measurements (shoulder width, chest, waist, hip, torso length) from a single front-facing image using a height reference | Mean Absolute Error within acceptable tolerance vs. tape measurements |
| O2 | Classify users into standard body shape categories: Hourglass, Pear, Rectangle, Inverted Triangle, Oval | Classification accuracy ≥ 80% on validation set |
| O3 | Recommend the correct garment size against a product-specific size chart, with fit confidence scoring | Correct size prediction rate ≥ 80% in user study |
| O4 | Display fit prediction (Tight / Perfect / Loose) with per-measurement breakdown on the product page | End-to-end response time < 3 seconds |
| O5 | Collect post-purchase fit feedback linked to the original recommendation record | Feedback data structured and stored for model refinement |
| O6 | Persist user body profiles and recommendation history in a database | All profiles queryable; no re-upload required on return visits |
| O7 | Conduct a user validation study with at least 20 test subjects | Report measurement MAE, size accuracy, user satisfaction (target ≥ 4/5) |

---

## 4. Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 | User interface and routing |
| Backend | Node.js, Express.js | REST API, business logic, AI proxy |
| Database | MongoDB, Mongoose ODM | Data persistence |
| Authentication | JWT (jsonwebtoken), bcryptjs | Secure session management |
| Email | Nodemailer / Resend API | OTP delivery, order notifications |
| AI Microservice | Python 3.10–3.12, FastAPI | Body measurement extraction, recommendation |
| Pose Estimation | MediaPipe Pose (pre-trained) | Body landmark detection from image |
| Numerical Computing | NumPy, SciPy | Pixel-to-cm conversion, ratio calculations |
| Charts & Analytics | Recharts | Admin dashboard visualisations |
| Containerisation | Docker, Docker Compose | Reproducible deployment across environments |

---

## 5. System Architecture

SnapFit uses a three-tier architecture with four independently deployable services:

```
Browser (React)
    │
    ▼
Node.js / Express  ──────────►  Python FastAPI (AI Microservice)
    │                               • Pose landmark detection
    │                               • Measurement extraction
    ▼                               • Body type classification
MongoDB                             • Recommendation engine
  • users
  • products (+ size charts)
  • orders
  • bodyprofiles        ◄── measurements saved by Node.js after AI call
  • sizerecommendations
  • fitfeedbacks
```

The Node.js backend acts as the only consumer of the Python AI service. The frontend never calls the AI service directly, which keeps the AI endpoint internal and prevents abuse.

---

## 6. Core Functional Units

### 6.1 Image Upload and Preprocessing

**Input:** Full-body front-facing photo uploaded or captured via browser camera.

**Process:** The frontend validates that a file is selected and that a height value is provided. The image is sent as multipart form data to Node.js, which forwards it to the Python microservice. The microservice resizes and normalises the image before landmark detection.

**Output:** Preprocessed image ready for pose estimation.

**Privacy:** The image is held in memory only during processing and is never written to disk or stored in the database.

---

### 6.2 Body Measurement Extraction (AI Microservice)

**Input:** Full-body image bytes and user-provided height in centimetres.

**Process:**
1. Run MediaPipe Pose to detect 33 body landmarks (pixel coordinates).
2. Compute pixel distances between key landmark pairs: left-to-right shoulder, left-to-right hip, shoulder midpoint to hip midpoint (torso).
3. Derive a pixel-per-centimetre scale factor using the ratio of pixel height (nose to ankle midpoint) to the provided height in cm.
4. Apply scale factor to landmark distances to obtain shoulder width and hip width in cm.
5. Estimate chest circumference and waist circumference using empirically derived regression ratios from width measurements (known limitation: single 2D image).

**Output:** `{ shoulder_cm, chest_cm, waist_cm, hip_cm, torso_length_cm }`

**Stored:** Measurements saved to the user's `bodyprofile` document in MongoDB.

---

### 6.3 Body Type Classification

**Input:** Extracted shoulder, chest, waist, and hip measurements.

**Process:** Ratio-based rules classify the user into one of five standard categories:

| Body Type | Primary Rule |
|---|---|
| Hourglass | Shoulder ≈ Hip (≤ 5 cm difference) AND Waist/Hip < 0.75 |
| Pear | Hip > Shoulder + 5 cm |
| Inverted Triangle | Shoulder > Hip + 5 cm |
| Oval | Waist ≥ Shoulder OR Waist ≥ Hip |
| Rectangle | None of the above |

**Output:** Body type label stored in the user's body profile.

---

### 6.4 Size Recommendation and Fit Prediction Engine

**Input:** User body measurements, and the target product's size chart array.

**Process:**
1. For each available size in the chart, calculate the absolute deviation between the user's measurement and the chart value for each dimension (chest, waist, hip, shoulder).
2. Apply weighted scores: chest (35 %), waist (30 %), hip (20 %), shoulder (15 %).
3. Sum weighted deviations to produce a total score per size; select the size with the lowest score as the recommendation.
4. Assign a per-measurement fit label: deviation within ±3 cm → Perfect; user value below chart → Tight; user value above chart + tolerance → Loose.
5. Compute an overall confidence score (0–100 %) by mapping the best score against a maximum expected deviation.
6. Return the next two lowest-scoring sizes as alternatives.

**Output:** `{ recommended_size, fit_label, confidence_score, breakdown[], alternative_sizes[] }`

**Stored:** Full recommendation record saved to `sizerecommendations` for analytics and feedback linking.

---

### 6.5 Product Size Chart Management

**Input:** Garment measurements per size entered by an administrator (chest, waist, hip, shoulder, length in cm).

**Process:** The admin product form includes a size chart editor grid. Each row is a size label (XS–XXL); each column is a measurement field. On save, the chart is embedded in the product document.

**Output:** Structured size chart stored in the `products` collection and available to the recommendation engine at query time.

---

### 6.6 User Body Profile Management

**Input:** AI-extracted measurements, body type, height, and optional weight from the user.

**Process:** A `BodyProfile` document is created on first analysis and updated on every subsequent analysis. Stored profiles allow instant recommendations on return visits without re-uploading an image.

**Output:** A persistent body profile linked to the user account, accessible across all products on the platform.

---

## 7. Optional Enhancements

The following units are beneficial but non-essential. Development depends on available time and resources.

### 7.1 Post-Purchase Feedback and Refinement Loop

After order delivery, the customer is prompted to rate actual fit (Too Tight / Slightly Tight / Perfect / Slightly Loose / Too Loose) per measurement. Feedback records are linked to the original recommendation. Accumulated data informs periodic adjustment of the circumference estimation ratios and recommendation weights.

**Condition:** Requires sufficient user volume to produce statistically meaningful correction signals.

### 7.2 Admin Return Analytics Dashboard

Provides administrators with per-product return-rate trends, size chart accuracy scores, and body-type distribution of the customer base. AI-generated alerts flag size charts whose recommendations are consistently wrong, prompting manual review.

**Condition:** Requires real order and return data; most valuable in a production environment.

### 7.3 Real-Time Pose Preview

Displays a live body landmark overlay on the user's camera feed before image capture to guide correct positioning. Improves landmark detection reliability, particularly for users unfamiliar with full-body photography.

**Condition:** Dependent on browser WebRTC support and device camera quality.

### 7.4 Asynchronous Job Queue

Queues image analysis requests during high concurrency to prevent timeouts. Supports GPU-accelerated inference nodes if available.

**Condition:** Not required for demonstration or moderate loads; beneficial for production scale.

### 7.5 Containerisation and Cloud Deployment

All four services (frontend, Node.js backend, Python AI microservice, MongoDB) are packaged as Docker containers and orchestrated via Docker Compose. Optionally deployable to any cloud provider.

**Condition:** Local deployment is sufficient for project demonstration. Cloud hosting adds commercial readiness.

---

## 8. Assumptions

- Users upload a clear, full-body front-facing image with reasonably fitted clothing. Baggy or heavily layered garments will degrade measurement accuracy.
- Users provide their accurate height in centimetres. Height is the only external scaling input; inaccurate height produces proportionally inaccurate measurements.
- The pre-trained pose estimation model achieves sufficient 2D landmark detection accuracy for this use case without custom model training.
- Product size charts are entered manually by platform administrators; automated extraction from external sources is not assumed.
- A representative group of test subjects is available for the validation study.

---

## 9. Known Limitations and Mitigations

**Circumference from a 2D Image:** Chest and waist circumferences cannot be directly measured from a single front-facing 2D image. The system estimates them from width measurements using empirical regression ratios. This is a known and documented inaccuracy that will be quantified in the evaluation.
*Mitigation:* Clearly communicate measurement uncertainty to users; present fit ranges rather than absolute values.

**Landmark Detection Failure:** Pose estimation may fail if the image is low resolution, the user is partially occluded, or lighting is poor.
*Mitigation:* Validate image quality client-side and return a clear error message guiding the user to retake the photo.

**Dataset Coverage:** Publicly available labeled body measurement datasets may not represent all target demographics or garment types.
*Mitigation:* Supplement with a self-collected dataset of test subjects; clearly document demographic scope in the final report.

**Privacy Risk from Body Images:** Storing raw body photographs creates significant privacy liability.
*Mitigation:* Images are processed entirely in memory, never written to disk, and discarded immediately after measurement extraction. Only numerical values are persisted.

---

## 10. Exclusions

The following are explicitly out of scope for this project:

- **Virtual Try-On / AR Overlay** — scope is measurement-based recommendation only.
- **Custom AI Model Training from Scratch** — pre-trained pose estimation models will be used as-is.
- **Multi-Angle or 3D Body Scanning** — single front-facing 2D image only.
- **Automated Size Chart Scraping** — size charts are entered manually by administrators.
- **Native Mobile Application** — responsive web application only; no iOS or Android app.
- **Live Payment Processing** — payment gateway integration and order fulfillment are excluded.
- **Multi-Language Support** — English only.
- **ERP or Inventory System Integration** — standalone platform; no third-party system integration.

---

## 11. Project Timeline

**Duration:** 18 Months — March 2026 to August 2027  
**Team:** Member 1 (M1), Member 2 (M2)

| Phase | Key Deliverables | Months | Owner |
|-------|-----------------|--------|-------|
| 1 — Planning & Setup | Requirements, literature review, environment setup, tech stack finalisation | 1–2 | M1, M2 |
| 2 — E-Commerce Backend | REST API design, MongoDB schema, auth, product and order APIs | 2–3 | M1 |
| 3 — AI Microservice | Pose estimation pipeline, measurement extraction, body type classifier | 3–6 | M2 |
| 4 — Recommendation Engine | Size chart data model, fit prediction algorithm, confidence scoring | 5–8 | M1, M2 |
| 5 — Frontend Integration | SnapFit upload page, recommendation widget, fit breakdown UI | 7–10 | M1 |
| 6 — Feedback & Analytics | Feedback collection, body profile management, admin analytics | 9–12 | M2 |
| 7 — Testing & Validation | Unit tests, integration tests, user study with 20+ subjects | 12–15 | M1, M2 |
| 8 — Refinement & Deployment | Model tuning, performance optimisation, Docker deployment | 15–17 | M1, M2 |
| 9 — Documentation & Submission | Final report, presentation slides, codebase documentation | 17–18 | M1, M2 |

---

## 12. Expected Outcomes and Evaluation Criteria

### 12.1 Functional Deliverables

By the end of the project the following artefacts will be produced and submitted:

1. **Working E-Commerce Platform** — a fully functional clothing store with product listings, cart, order management, coupon system, and role-based admin panel.
2. **SnapFit AI Microservice** — a standalone Python/FastAPI service exposing `/analyze` (image → measurements) and `/recommend` (measurements + size chart → recommendation) endpoints.
3. **Integrated Frontend** — a SnapFit page allowing image upload and height entry, plus a per-product recommendation widget showing the recommended size, fit label, confidence score, and per-measurement breakdown.
4. **Body Profile Storage** — persistent user body profiles in MongoDB, enabling instant recommendations on return visits.
5. **Feedback Collection** — a post-purchase fit feedback form linked to the original recommendation record.
6. **Admin Analytics** — a dashboard showing recommendation accuracy trends, return-rate correlation, and body-type distribution.
7. **Docker Deployment** — a `docker-compose.yml` file that brings up all four services (frontend, backend, AI microservice, MongoDB) with a single command.

### 12.2 Evaluation Criteria

| Criterion | Measurement Method | Target |
|---|---|---|
| Measurement accuracy | Mean Absolute Error vs. manual tape measurements on 20+ subjects | Within acceptable tolerance per measurement |
| Body type classification accuracy | Comparison against self-reported body type on test set | ≥ 80 % |
| Size recommendation accuracy | Correct size confirmed by test subject post-trial | ≥ 80 % |
| System response time | End-to-end time from image upload to recommendation display | < 3 seconds |
| User satisfaction | Post-study questionnaire (1–5 scale) | ≥ 4 / 5 |
| Return reduction (simulated) | % of test subjects who would have chosen the wrong size without the system | ≥ 25 % reduction |

### 12.3 Academic Contribution

SnapFit contributes a practical, reproducible pipeline that combines a pre-trained 2D pose estimation model with height-referenced scaling and a lightweight algebraic recommendation engine — demonstrating that meaningful body measurement extraction and size recommendation are achievable without custom model training, large proprietary datasets, or specialised hardware. The user validation study results and documented measurement error analysis constitute the primary empirical contribution of the project.
