# 💊 PillPulse: Location-Aware Real-time Medication Locator & Alert Network

PillPulse is a modern, microservices web application that connects patients with nearby pharmacies carrying critically needed medications. Utilizing location-aware radius searching (via Haversine calculations) and real-time event-driven messaging, PillPulse alerts patients immediately via SMS (Twilio) and Email (SMTP) the moment out-of-stock medicines are replenished.

---

## 🚀 Key Features

*   **📍 Location-Aware Search**: Instantly locate medicines within a customizable radius (e.g., 5km to 50km) from your current GPS coordinates.
*   **🔔 Real-Time Stock Alerts**: Subscribe to out-of-stock medications globally or per-store to receive automated SMS (Twilio) and Email (SMTP) alerts upon restock.
*   **🛡️ Enterprise Security**: Secured via Keycloak Identity Provider (OAuth2/OIDC) with role-based access control (`SYSTEM_ADMIN`, `PHARMACY_ADMIN`, and patients).
*   **📊 Sleek Administration Console**: A premium, administrative dashboard with glassmorphism aesthetics for auditing global subscriptions, deactivating stock alerts, and reviewing dispatch histories.
*   **🔌 Event-Driven Microservices**: Dynamic reactive restock events broadcasted asynchronously via a RabbitMQ message broker.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
*   **Framework**: Next.js 14 (App Router, React Hooks)
*   **Styling**: Vanilla CSS with tailored HSL color schemas, premium typography (Outfit/Inter), and modern micro-animations
*   **State Management**: Zustand

### **Backend Microservices (Spring Boot & Cloud)**
*   `eureka-server` (Port `8761`): Centralized Service Discovery & Registry
*   `api-gateway` (Port `8080`): Reactive gateway routing & Keycloak JWT authorization validation
*   `medicine-service` (Port `8082`): Global medication database & catalog
*   `pharmacy-service` (Port `8081`): Profile registration, GPS coordinates, and keycloak synchronization
*   `search-service` (Port `8083`): Radius calculation engines & real-time inventory queries
*   `alert-service` (Port `8084`): Stock watcher registries, Twilio SMS REST client, and Spring Mail SMTP email dispatches

### **Infrastructure**
*   **Database**: PostgreSQL (Multi-schema per microservice)
*   **Identity & Access**: Keycloak Identity Server (Port `8180`)
*   **Message Broker**: RabbitMQ (Port `5672`, admin console on `15672`)
*   **Database Migration**: Flyway

---

## 📦 Getting Started & Setup

### **1. Prerequisites**
Ensure you have the following installed:
*   Java Development Kit (JDK) 21
*   Node.js 18+ & npm
*   PostgreSQL & PgAdmin
*   RabbitMQ Server
*   Keycloak Server

### **2. Setup Environment Variables**
Create a `.env` file inside `backend/` and configure:
```properties
# Keycloak Client Settings
KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret

# Twilio SMS Credentials
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Spring Mail SMTP Configuration (e.g. Mailtrap or Gmail)
SPRING_MAIL_HOST=sandbox.smtp.mailtrap.io
SPRING_MAIL_PORT=25
SPRING_MAIL_USERNAME=your-smtp-username
SPRING_MAIL_PASSWORD=your-smtp-password
```

### **3. Start the Backend Microservices**
Run each service using Maven wrapper in their respective service folders:
```bash
# Compile and package
./mvnw.cmd clean package

# Run Eureka Server first
cd eureka-server && ./mvnw.cmd spring-boot:run

# Run Keycloak, RabbitMQ & database, then run remaining services
cd ../api-gateway && ./mvnw.cmd spring-boot:run
cd ../medicine-service && ./mvnw.cmd spring-boot:run
cd ../pharmacy-service && ./mvnw.cmd spring-boot:run
cd ../search-service && ./mvnw.cmd spring-boot:run
cd ../alert-service && ./mvnw.cmd spring-boot:run
```

### **4. Start the Frontend Client**
Navigate to the `frontend/` directory, install dependencies, and launch the Next.js dev server:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📁 Repository Directory Layout
```text
├── backend/
│   ├── api-gateway/            # Routing, CORS, security gate
│   ├── alert-service/          # Email/SMS notification dispatcher
│   ├── eureka-server/          # Service Discovery server
│   ├── medicine-service/       # Med catalogs & inventory metrics
│   ├── pharmacy-service/       # Store registrations & credentials
│   └── search-service/         # GPS radius math & search engines
├── frontend/
│   ├── src/app/                # Next.js 14 layouts and page screens
│   └── src/services/           # API gateway endpoints integrations
└── README.md                   # Project documentation overview
```
