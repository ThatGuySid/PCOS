# 🌸 HerFlow — PCOS Wellness & Care Platform

HerFlow is a mobile-first wellness application designed for women managing Polycystic Ovary Syndrome (PCOS). It combines cycle tracking, AI-powered personalized guidance, medicine reminders, and secure health report storage into a single unified platform.

---

## ✨ Features

### 🗓 Menstrual Cycle Tracking
- Log period start and end dates
- Automatic cycle length calculation
- Menstrual phase detection — menstrual, follicular, ovulatory, luteal
- Ovulation window estimation
- Automated reminders for upcoming periods and ovulation

### 😔 Mood & Symptom Logging
- Daily mood tracking (happy, anxious, irritable, etc.)
- Physical symptom logging (cramps, bloating, fatigue, pain intensity)
- Calendar-linked entries for historical trend observation

### 🥗 Smart Food Guidance
- AI-generated Indian diet–friendly food suggestions
- Personalized based on current cycle phase, mood, and reported symptoms
- Powered by Gemini API with controlled prompt engineering
- Educational explanations for each suggestion — no medical diagnosis

### 🧘 Yoga & Exercise Recommendations
- Phase and mood based yoga pose suggestions
- Beginner-friendly routines focused on stress relief and hormonal balance
- Web-grounded AI responses via Gemini API

### 💊 Medicine & Reminder System
- Add medicines with name and dosage timing
- Mark medicines as taken and track adherence history
- Automated reminders for medicine, hydration, period prediction, and ovulation

### 📁 Health Report Vault
- Securely upload and store medical reports (PDF/images)
- Per-user document isolation via Firebase Storage
- Easy retrieval and management from within the app

### 🤖 AI Chat Assistant
- Context-aware PCOS wellness Q&A
- Lifestyle and dietary guidance
- Operates strictly in an educational, non-diagnostic capacity

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| File Storage | Firebase Storage |
| AI & Chat | Gemini API (`gemini-1.5-flash`) |
| Notifications | Expo Notifications |

---

## 🏗 Architecture Overview

HerFlow follows a **client-cloud-AI hybrid architecture** with three primary layers:

- **Client Layer** — React Native app handling UI, user input, local notifications, and API communication
- **Backend Layer** — Firebase services managing authentication, structured data storage (Firestore), and file storage
- **AI Layer** — Gemini API integration using structured prompt engineering to generate contextual, evidence-informed wellness guidance

AI prompts are dynamically constructed from the user's current cycle phase, logged mood, and reported symptoms. The AI system is explicitly constrained to avoid clinical diagnosis or prescription recommendations.

---

## 📱 Screens & Flow

```
Onboarding (3 slides)
    ↓
Profile Setup (name, cycle length, dietary preference)
    ↓
Home / Calendar
    ↓
Log Symptoms & Mood → Food Guidance Card
                     → Yoga Recommendations
    ↓
Medicine Tracker
    ↓
Health Report Vault
    ↓
AI Chat Assistant
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Firebase project with Firestore, Authentication, and Storage enabled
- Gemini API key from [Google AI Studio](https://ai.google.dev)

### Installation

```bash
git clone https://github.com/your-username/herflow.git
cd herflow
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key
```

### Run the App

```bash
npx expo start
```

Scan the QR code with the Expo Go app on your Android device, or run on an emulator.

### Build APK

```bash
npx expo build:android
```

---

## 📂 Project Structure

```
herflow/
├── app/
│   ├── (auth)/          # Login, Register screens
│   ├── (onboarding)/    # 3 onboarding slides + profile setup
│   ├── (tabs)/          # Main app tabs
│   │   ├── home/        # Calendar & cycle tracking
│   │   ├── log/         # Mood & symptom logging
│   │   ├── guidance/    # Food & yoga recommendations
│   │   ├── medicine/    # Medicine tracker & reminders
│   │   ├── vault/       # Health report storage
│   │   └── chat/        # AI assistant
├── components/          # Reusable UI components
├── services/
│   ├── firebase.js      # Firebase config & helpers
│   └── gemini.js        # Gemini API prompt handlers
├── utils/
│   └── cycleLogic.js    # Phase calculation, ovulation estimation
├── assets/
└── .env
```

---

## 👥 Team


| Siddhant Giri 
| Anchal Lingwal 
---

## ⚠️ Disclaimer

HerFlow is an academic project developed for educational purposes. The AI-generated content within the app is for informational and wellness support only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical guidance.

---

## 📄 License

This project is developed for academic submission and is not currently licensed for commercial use.
