# SnapFit: AI Based Size Recommendation and Body Measurement Estimation System

---

## 1. Project Title

**SnapFit: AI Based Size Recommendation and Body Measurement Estimation System**

---

## 2. Project Overview

Online clothing retail consistently experiences one of the highest product return rates across all e-commerce categories, largely attributed to size and fit mismatches between customers and purchased garments. This problem imposes significant financial, operational, logistical, and environmental costs on businesses and customers alike. Existing commercial solutions are often limited in scope, target specific demographics, and lack adaptive learning mechanisms, leaving a substantial gap for a more intelligent, inclusive, and generalizable fitting system.

SnapFit extends an existing fully functional e-commerce clothing platform — built using React, Tailwind CSS, Node.js, and MongoDB — by integrating an AI-powered size recommendation module designed to measurably reduce size-based product returns. The system employs a hybrid architecture: the web frontend handles user interaction and real-time image preview, while a Python-based backend microservice performs body landmark detection, measurement extraction, body type classification, and intelligent size recommendation with fit confidence scoring.

The core intelligence layer maps user body measurements against product-specific size charts and predicts fitting outcomes (e.g., Tight, Perfect, or Loose) along with a confidence percentage. A feedback-driven learning loop collects post-purchase user feedback to continuously refine recommendation accuracy over time. User body profiles are persistently stored in a database, enabling personalized and progressively improving recommendations with each interaction.

The system is designed with generalizability, scalability, and privacy-consciousness as first-class properties. It is applicable to a broad range of clothing brands, body types, and regional demographics, and is architected for deployment on standard cloud or on-premises infrastructure, making it suitable for real-world adoption by small to mid-scale e-commerce clothing businesses.

---

## 3. Project Goals and Objectives

### Goals

1. To reduce size-based product returns in online clothing retail by providing AI-driven, accurate size recommendations to customers prior to purchase.
2. To build a scalable, intelligent fitting system that continuously improves its recommendation accuracy through user feedback and data-driven refinement.
3. To develop a size recommendation engine that generalizes across diverse body types, clothing brands, and regional sizing standards.

### Objectives

1. Develop a Python-based AI microservice that extracts key body measurements (including shoulder width, chest circumference, waist circumference, hip width, and torso length) from a single user-uploaded image, achieving an accuracy within an acceptable tolerance compared to manual measurements.
2. Implement a body type classification module that categorizes users into standard body shape categories (such as Hourglass, Pear, Rectangle, Inverted Triangle, and Oval) with a classification accuracy of 80% or above.
3. Build a size recommendation engine that maps extracted measurements against brand-specific or product-specific size charts and returns the best-fit size with a fit confidence score, achieving a correct size prediction rate of at least 80% in user validation testing.
4. Integrate fit prediction output (Tight / Perfect / Loose) with per-measurement breakdown displayed on the frontend within a response time of under 3 seconds.
5. Design and implement a feedback collection system that stores post-purchase fit feedback linked to the original recommendation, enabling periodic model refinement and accuracy improvement.
6. Store and manage user body profiles, product size charts, and fit analytics persistently in a database, supporting a meaningful number of concurrent user profiles.
7. Conduct a user validation study with a representative sample of test subjects to measure and report system accuracy, user satisfaction, and simulated return reduction percentage.

---

## 4. High-Level System Components

The system consists of five core functional units essential for fulfilling its primary mission of reducing size-based returns through intelligent size recommendation.

### 4.1 Image Upload and Preprocessing Unit

**Input:** Full-body user image captured via camera or uploaded from a device.

**Process:** Validates image quality (lighting, angle, full body visibility), resizes and normalizes the image for AI processing, and securely transmits it to the backend microservice.

**Output:** Preprocessed image ready for body landmark detection.

**Stored Data:** Temporarily cached image, deleted after processing to preserve user privacy.

---

### 4.2 Body Measurement Extraction Unit (AI Microservice)

**Input:** Preprocessed user image and user-provided height (in a standard unit) as a scaling reference.

**Process:** Uses a pose estimation model to detect body landmarks, calculates pixel distances between key landmark pairs (shoulders, hips, torso, and other relevant points), and converts pixel distances to real-world measurements using a height-based scaling factor.

**Output:** Extracted body measurements — including shoulder width, estimated chest circumference, estimated waist circumference, hip width, and torso length.

**Stored Data:** Extracted measurements saved to the user's body profile in the database.

---

### 4.3 Body Type Classification Unit

**Input:** Extracted body measurements (shoulder, chest, waist, and hip ratios).

**Process:** Applies ratio-based classification logic to categorize the user into one of several standard body shape categories (e.g., Hourglass, Pear, Rectangle, Inverted Triangle, Oval).

**Output:** Body type label assigned to the user profile.

**Stored Data:** Body type classification stored as part of the user body profile in the database.

---

### 4.4 Size Recommendation and Fit Prediction Engine

**Input:** User body measurements, body type, and the relevant product size chart from the database.

**Process:** Compares user measurements against each available size in the product's size chart, calculates deviation scores per measurement, determines the best-fit size, generates a fit prediction label (Tight / Perfect / Loose) with a per-measurement breakdown, and computes an overall fit confidence percentage score.

**Output:** Recommended size, fit prediction label, per-measurement fit breakdown, confidence score, and alternative size suggestions.

**Stored Data:** Recommendation history (user, product, recommended size, confidence score) stored in the database for analytics and refinement.

---

### 4.5 Product Size Chart Management Unit

**Input:** Garment measurements entered by administrators or sellers (chest, waist, hip, length per size per product).

**Process:** Stores and manages structured size chart data linked to individual products, supports multiple brands with varying size standards, and allows garment type tagging (e.g., slim-fit, regular, loose).

**Output:** Structured size chart data accessible by the recommendation engine during prediction.

**Stored Data:** Product size charts persistently stored in the database, linked to the product catalog.

---

### 4.6 User Body Profile Management Unit

**Input:** AI-extracted measurements, body type classification, and user-provided attributes (height, weight).

**Process:** Creates and maintains a persistent body profile for each registered user, updates measurements when a new image is analyzed, and serves stored profiles for future recommendations without requiring re-upload.

**Output:** Complete user body profile available for instant size recommendations across all products.

**Stored Data:** User body metrics, body type, measurement history, and linked recommendation records in the database.

---

## 5. Optional Functional Units

The following functional units enhance system quality and capability but are not essential for the core mission. Their development is subject to available time, expertise, and resources.

### 5.1 Post-Purchase Feedback and Model Refinement Loop

**Description:** Collects user feedback after product delivery (e.g., "Too tight in chest," "Perfect fit," "Loose in waist") and links it to the original recommendation record. Accumulated feedback data is used to periodically adjust measurement estimation biases and recommendation weights.

**Condition:** Requires a sufficient user base to generate meaningful feedback volume for model refinement.

---

### 5.2 Seller Return Analytics Dashboard

**Description:** Provides sellers and administrators with analytics on return rates per product, size chart accuracy scores, customer body type distribution, and AI-driven suggestions for size chart adjustments.

**Condition:** Dependent on availability of sufficient transaction and return data. Full value is realized only in a production environment with real orders.

---

### 5.3 Real-Time Frontend Pose Preview

**Description:** Displays a real-time body landmark overlay on the user's camera feed before image capture, guiding the user to position correctly for optimal measurement accuracy.

**Condition:** Dependent on device camera quality and browser support for the chosen frontend pose estimation SDK.

---

### 5.4 Asynchronous Processing and Queue Management

**Description:** Implements job queuing for image processing requests to handle high concurrent user loads efficiently, with support for accelerated inference where applicable.

**Condition:** Not necessary for demonstration or moderate user loads but beneficial for production-scale deployment.

---

### 5.5 Containerization and Cloud Deployment

**Description:** Containerizes all system components (frontend, backend, AI microservice, database) using container orchestration tools for consistent deployment across environments, with optional cloud hosting.

**Condition:** Time-dependent. Local deployment is sufficient for demonstration; cloud deployment adds professional and commercial value if time permits.

---

## 6. Assumptions

- Users will upload a clear, full-body front-facing image wearing reasonably fitted clothing; accuracy may degrade with very baggy or heavily layered clothing.
- Users will provide their accurate height, which serves as the primary scaling reference for all measurement conversions.
- The pre-trained pose estimation model provides sufficiently accurate 2D landmark detection for the scope of this project without requiring custom model training from scratch.
- Product size charts will be manually entered by administrators; automated extraction or scraping of size charts is not assumed.
- A representative sample of test subjects will be available for the user validation study.

---

## 7. Known Limitations and Risk Mitigations

**Single 2D Image Depth Limitation:** Estimating circumference measurements (chest, waist) from a single front-facing 2D image introduces inherent inaccuracy. Mitigation involves using regression-based estimation from width measurements, but this remains a known and documented limitation.

**Dataset Availability:** Publicly available labeled body measurement datasets may not cover all target demographics or garment types. A self-collected or augmented dataset will be used, which may limit generalizability; this will be clearly documented in the final evaluation.

**Privacy Sensitivity:** Processing body images raises privacy concerns. The system must ensure images are processed and immediately deleted after measurement extraction, with only numerical measurements retained and stored.

---

## 8. Exclusions

The following items will not be developed or addressed at any point during this project due to time constraints, resource limitations, or scope boundaries.

- **Virtual Try-On / Augmented Reality Clothing Overlay:** The system scope is limited to measurement-based size recommendation, not visual garment rendering or AR try-on experiences.
- **Custom AI Model Training from Scratch:** The project will utilize pre-trained pose estimation models and regression-based estimation. Training a custom deep learning model from scratch is excluded due to computational and data requirements.
- **Multi-Angle or 3D Body Scanning:** The system processes only a single front-facing 2D image. Multi-angle capture, depth sensor integration, or 3D body reconstruction are excluded.
- **Automated Size Chart Extraction/Scraping:** Product size charts will be entered manually by administrators. Automated scraping or extraction from external sources is not within scope.
- **Mobile Application Development:** The system will be developed and deployed as a responsive web application only. Native mobile applications are excluded.
- **Live Payment Processing and Order Fulfillment:** The focus remains on the AI recommendation module. Live payment gateway integration and actual order fulfillment/shipping are excluded.
- **Multi-Language and Localization Support:** The system interface and documentation will be in English only.
- **Integration with External ERP or Inventory Systems:** The system operates as a standalone platform. Integration with third-party enterprise resource planning, warehouse management, or inventory systems is not included.

---

## 9. Gantt Chart

**Work Breakdown Structure and Timeline (18 Months)**

**Project Duration:** March 2026 – August 2027  
**Team:** Member 1 (M1), Member 2 (M2)

| Phase | Task | Duration | Owner |
|-------|------|----------|-------|
| Phase 1: Planning & Setup | Requirements gathering, literature review, environment setup | Month 1–2 | M1, M2 |
| Phase 2: Core Backend | E-commerce platform review, API design, database schema design | Month 2–3 | M1 |
| Phase 3: AI Microservice | Pose estimation integration, measurement extraction, body type classification | Month 3–6 | M2 |
| Phase 4: Recommendation Engine | Size chart management, fit prediction engine, confidence scoring | Month 5–8 | M1, M2 |
| Phase 5: Frontend Integration | UI for image upload, recommendation display, fit breakdown view | Month 7–10 | M1 |
| Phase 6: Feedback System | Post-purchase feedback collection, profile management, analytics | Month 9–12 | M2 |
| Phase 7: Testing & Validation | Unit testing, integration testing, user validation study (20+ subjects) | Month 12–15 | M1, M2 |
| Phase 8: Refinement & Deployment | Model refinement, performance optimization, deployment preparation | Month 15–17 | M1, M2 |
| Phase 9: Documentation & Submission | Final report, presentation, documentation | Month 17–18 | M1, M2 |
