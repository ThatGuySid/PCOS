# 🌸 HerFlow — PCOS Wellness & Care Platform

HerFlow is a mobile-first wellness application designed for women managing Polycystic Ovary Syndrome (PCOS). It combines intelligent cycle tracking, AI-powered personalized guidance, medicine reminders, symptom logging, and secure health report storage into a single unified platform.

---

## ✨ Features

### 🗓 Intelligent Cycle Tracking

- Log period start and end dates with an interactive calendar
- Adaptive cycle length calculation — learns from logged history over time
- Automatic phase detection — Menstrual, Follicular, Ovulation, Luteal
- Confidence-based next period prediction with dynamic windows
  - New users: broad range estimate (e.g. "Expected Jun 1 – Jun 8")
  - Consistent users: narrow estimate (e.g. "Likely Jun 4")
- Ovulation day and fertile window estimation
- Automatic cycle regularity reclassification based on logged data
- Colour-coded calendar — period days, predicted days, fertile window, ovulation

### 😔 Mood & Symptom Logging

- Daily mood tracking (happy, anxious, irritable, sad, calm)
- Physical symptom logging (cramps, bloating, fatigue, spotting, acne, headache)
- AI-powered symptom prediction from free-text input
- Calendar-linked entries for historical trend observation
- Pattern tracking — detects recurring symptoms and cycle-phase correlations
- Symptom frequency analytics with monthly filtering

### 🥗 Phase-Based Food & Diet Guidance

- Personalised food recommendations based on current cycle phase
- Symptom-aware adjustments (e.g. bloating → low-FODMAP suggestions)
- Foods to favour and foods to avoid per phase
- Powered by cycle data — not generic advice
- Educational explanations for every suggestion

### 🧘 Phase-Based Workout Recommendations

- Workout routines tailored to current cycle phase and energy level
- Symptom-aware filtering (e.g. cramps → removes high-intensity options)
- Step-by-step exercise instructions with expandable cards
- Mark workouts as done
- Rest day recommendations when symptoms suggest it

### 💊 Medicine & Reminder System

- Add medicines with name, dosage, and exact reminder times
- Mark medicines as taken with adherence tracking
- Missed medicine notification if not marked taken within 1 hour
- Full notification system for period reminders, ovulation, symptom logging windows, and daily wellness nudges

### 📁 Health Report Vault

- Upload and store medical reports (PDF and images)
- Per-user isolated storage — each account only sees their own files
- Files persist across sessions and app restarts
- Export reports directly from the app

### 🤖 AI Chat Assistant

- Context-aware PCOS wellness Q&A powered by Gemini API
- Personalised responses using current cycle phase, symptoms, and cycle history
- Request lock — prevents overlapping responses
- Quick question suggestions
- Strictly educational — no medical diagnosis or prescription

### 🔔 Smart Notifications

- Period reminder — 1 and 2 days before predicted period
- Ovulation reminder — on predicted ovulation day
- Symptom log nudge — during period and fertile windows at a random daily time
- Medicine reminders at exact scheduled times
- Missed medicine follow-up 1 hour after scheduled time
- Daily motivational wellness notifications

---

## 🛠 Tech Stack

|
 Layer 
|
 Technology 
|
|
---
|
---
|
|
 Frontend 
|
 React Native (Expo) 
|
|
 Auth 
|
 Firebase Authentication 
|
|
 Database 
|
 Cloud Firestore 
|
|
 Local Storage 
|
 AsyncStorage v2 
|
|
 AI & Chat 
|
 Gemini API (
`gemini-1.5-flash`
) 
|
|
 Notifications 
|
 Expo Notifications 
|
|
 File System 
|
 Expo FileSystem 
|

---

## 🏗 Architecture Overview

HerFlow follows a **client-server-AI architecture** with four primary layers:

- **Client Layer** — React Native (Expo) app handling UI, local state, notifications, and file storage
- **Auth Layer** — Firebase Authentication with AsyncStorage persistence for session management
- **Data Layer** — Cloud Firestore for cross-device sync, AsyncStorage as offline fallback
- **AI Layer** — Gemini API with structured context-aware prompt engineering

User data is synced to Firestore in real time with a debounced write strategy. Critical fields (e.g. profile completion) are written immediately. The app falls back to AsyncStorage when offline.

AI prompts are dynamically constructed from the user's cycle phase, logged symptoms, recent history, and cycle statistics. The assistant is explicitly constrained to educational wellness guidance only.

---

## 📱 Screens & Flow

```
Splash Screen
    ↓
Onboarding (3 slides)
    ↓
Login / Sign Up
    ↓
Profile Setup (name, avatar, cycle length, period length, flow, regularity)
    ↓
Home — live phase, cycle day, next period prediction, quick actions
    ↓
Health Hub
    ├── Period Log — calendar, mark start/end/ovulation, symptom chips
    ├── Workout — phase + symptom aware routines
    ├── Food & Diet — phase + symptom aware nutrition
    └── AI Assistant — Gemini-powered chat with cycle context
    ↓
Profile — view and edit all profile and cycle settings
    ↓
Settings — notifications, sign out, data reset
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Firebase project with Authentication and Firestore enabled
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
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Run in Development

```bash
npx expo start
```

### Build APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

### Download APK

Download the APK directly from this repository:

- [herflow.apk](herflow.apk)

After downloading on your Android device, open the file and allow installation from unknown sources if prompted.

---

## 📂 Project Structure

```
herflow/
├── app/
│   ├── onboarding.tsx       # Onboarding flow
│   ├── login.tsx            # Login screen
│   ├── signup.tsx           # Sign up screen
│   ├── profile-setup.tsx    # First-time profile setup
│   ├── healthreport.tsx     # Health report vault
│   ├── period-log.tsx       # Period and symptom logging
│   ├── workout.tsx          # Phase-based workouts
│   ├── food-diet.tsx        # Phase-based nutrition
│   ├── ai-assistant.tsx     # Gemini chat assistant
│   └── (tabs)/
│       ├── index.tsx        # Home screen
│       ├── health.tsx       # Health hub menu
│       ├── profile.tsx      # Profile screen
│       └── settings.tsx     # Settings screen
├── components/
│   ├── home/                # Home screen components
│   ├── health/              # Calendar, chat components
│   ├── onboarding/          # Onboarding slides
│   ├── profile/             # Profile edit components
│   ├── workout/             # Workout card components
│   ├── food/                # Food card components
│   └── settings/            # Settings row components
├── context/
│   └── UserContext.tsx      # Global user state, Firebase sync, cycle snapshot
├── services/
│   ├── firebase.ts          # Firebase app initialization
│   ├── firebaseConfig.ts    # Auth and Firestore setup
│   ├── authService.ts       # Sign in, sign up, sign out
│   ├── userProfileService.ts# Firestore read/write
│   ├── cycleService.ts      # Adaptive prediction engine
│   ├── dateService.ts       # Date utilities
│   ├── symptomService.ts    # Symptom helpers
│   ├── notificationService.ts# All notification scheduling
│   └── aiservice.ts         # Gemini API integration
├── assets/
│   └── images/              # App images and avatars
└── .env
```

---

## 👥 Team

| Name |
|---|
| Siddhant Giri |
| Anchal Lingwal |

---

## ⚠️ Disclaimer

HerFlow is an academic project developed for educational purposes. The AI-generated content within the app is for informational and wellness support only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical guidance.

---

## 📄 License

This project is developed for academic submission and is not currently licensed for commercial use.
