# 🥗 AI Nutritionist — Your Personal AI-Powered Dietician, In Your Pocket

<div align="center">

**A full-stack AI-powered mobile application built with React Native**  
that acts as a virtual dietician — helping users understand their body,  
calculate daily nutrition needs, scan food products, and get personalized AI-generated diet plans.

[![React Native](https://img.shields.io/badge/React_Native-TypeScript-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-D97757?style=for-the-badge)](https://anthropic.com/)
[![License](https://img.shields.io/badge/License-Open_Source-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Table of Contents

1. [About the Project](#-about-the-project)
2. [Problem Statement](#-problem-statement)
3. [Solution](#-solution)
4. [Features](#-features)
5. [App Workflow](#-app-workflow)
6. [Tech Stack](#-tech-stack)
7. [Installation & Setup](#-installation--setup)
8. [Usage Guide](#-usage-guide)
9. [Future Enhancements](#-future-enhancements)
10. [Developer](#-developer)
11. [License](#-license)

---

## 📘 About the Project

**AI Nutritionist** bridges the gap between complex nutritional science and everyday users.  
Instead of needing an expensive dietician appointment, users can open the app, enter their body details, and instantly receive AI-powered insights about their nutrition needs, meal plans, and food choices.

This project was built as a **complete full-stack mobile application** covering:

- 📱 **React Native** frontend with clean, component-based architecture
- ⚙️ **Node.js + Express** backend with JWT authentication
- 🗄️ **MongoDB** database for user profiles and weight tracking
- 🤖 **Claude AI (Anthropic)** integration for personalized recommendations
- 📷 **Barcode scanning** for real-world food product analysis
- ☁️ **Render deployment** (zero-cost cloud hosting)

---

## ❓ Problem Statement

Millions of people struggle with:

😕 **Not knowing** if they are underweight, normal, or overweight  
😕 **No idea** how many calories, proteins, or carbs they need daily  
😕 **Buying packaged food** without understanding the ingredients  
😕 **Following generic diets** that don't match their body or lifestyle  
😕 **No access** to affordable, professional nutrition guidance

---

## 💡 Solution

AI Nutritionist solves all of the above by:

✅ Calculating **BMI, BMR, and ideal weight range** from user data  
✅ Computing **exact daily targets** for calories, protein, carbs, fats, and water using the Mifflin-St Jeor formula  
✅ **Scanning barcodes** and using AI to analyze product ingredient suitability  
✅ Generating **fully personalized diet plans** via an AI chatbot  
✅ **Tracking weight progress** over time with visual charts  
✅ Providing **daily health tips** categorized by body type

---

## ✨ Features

### 🧍 Body Analysis & BMI Calculator

- Accepts age, gender, height, weight, and activity level
- Calculates BMI and categorizes: **Underweight / Normal / Overweight / Obese**
- Shows the ideal healthy weight range for the user's height

### 🍽 Daily Consumption Calculator

- Uses **Mifflin-St Jeor formula** for Basal Metabolic Rate (BMR)
- Applies activity multiplier for **Total Daily Energy Expenditure (TDEE)**
- Breaks down daily targets: **Calories | Protein | Carbs | Fats | Water**
- Visual macro distribution bar for quick understanding

### 🤖 Nova — AI Chatbot (Personalized Dietician)

- Powered by **Claude AI (Anthropic)** via backend API
- Remembers **conversation history** (last 50 messages)
- Provides personalized diet plans, food swaps, and meal timings
- Persistent chat storage using AsyncStorage

### 📅 Meal Planner

- Browse AI-suggested meals from an Indian food dataset
- Add meals to a daily planner
- Track what you plan to eat throughout the day

### 💧 Water Tracker

- Track daily water intake (**8 glasses / 2000ml goal**)
- Animated bottle fill bar with live % progress
- ml consumed and ml remaining display
- Motivational messages that update as you drink more
- Data persists per day using AsyncStorage

### 💡 Health Tips

- Two modes: **General Tips** & **Personalized Tips**
- Personalized tips tailored to: Underweight / Normal / Overweight
- Swipeable card UI — tap "Next Tip" to browse

### 📷 Food Product Scanner

- Scan any packaged food barcode using the device camera
- Fetches product name, brand, and full ingredient list
- Displays nutritional information per serving

### 🧠 AI Product Insight

- Sends scanned ingredient list to AI for analysis
- AI responds: who the product is good for, who should avoid it
- Highlights allergens, harmful additives, and health benefits

### 🍳 AI Recipe Generator

- Enter ingredients you have at home
- Optionally specify diet type and allergies to avoid
- AI generates **2 complete recipes** with step-by-step instructions

### 📈 Weight Progress Tracker

- Log daily weight entries
- Smooth Bezier line chart (`react-native-chart-kit`)
- Weight history stored in MongoDB via backend API

### 👤 Multi-Profile Support

- One account supports **multiple user profiles** (great for family use)
- Switch active profile with one tap
- Each profile has independent health data and weight history

### 🔐 Authentication

- JWT-based login / signup / forgot password
- **OTP-based password reset** via email (Nodemailer)
- Secure auth token stored in AsyncStorage

---

## 🔄 App Workflow

```
① User signs up / logs in          → JWT token saved
② Creates a profile                → name, age, gender, height, weight
③ Opens Consumption Planner        → enters body stats
④ Gets BMI category + targets      → daily nutrition breakdown
⑤ Chats with Nova AI               → personalized diet plan
⑥ Adds meals to Meal Planner       → tracks planned meals
⑦ Tracks water intake              → hits daily 2L goal
⑧ Scans a food product             → AI analyzes ingredient suitability
⑨ Logs weight daily                → sees progress on chart
⑩ Reads Health Tips                → lifestyle improvements
```

---

## 🛠 Tech Stack

### 📱 Frontend (Mobile App)

| Technology                   | Purpose                       |
| ---------------------------- | ----------------------------- |
| React Native (TypeScript)    | Core mobile framework         |
| React Navigation             | Stack + Bottom Tab navigation |
| react-native-linear-gradient | UI gradients                  |
| react-native-chart-kit       | Weight progress graphs        |
| react-native-vision-camera   | Barcode scanning              |
| AsyncStorage                 | Local data persistence        |
| Animated API                 | Water tracker animations      |

### ⚙️ Backend (REST API)

| Technology                        | Purpose                      |
| --------------------------------- | ---------------------------- |
| Node.js + Express.js (TypeScript) | Server framework             |
| MongoDB + Mongoose                | Database & ODM               |
| JWT (JSON Web Tokens)             | Authentication               |
| Nodemailer                        | OTP email for password reset |
| express-rate-limiter              | API protection               |
| Render                            | Cloud deployment (free tier) |

### 🤖 AI Integration

| Technology            | Purpose                                  |
| --------------------- | ---------------------------------------- |
| Claude AI (Anthropic) | Nova chatbot + product insight           |
| Prompt Engineering    | Diet plans, recipes, ingredient analysis |

### 🧰 Tools & DevOps

| Tool                        | Purpose                  |
| --------------------------- | ------------------------ |
| Git + GitHub                | Version control          |
| VS Code + ESLint + Prettier | Development environment  |
| Android Studio              | Emulator & build testing |

---

## 📦 Installation & Setup

### 🔹 Option 1: Test the App via APK _(Recommended for Evaluators)_

**Step 1 — Download the APK**

- Go to the [Releases](https://github.com/IrfanSarang/AI-Nutritionist/releases) section of this repository
- Download the latest release APK

**Step 2 — Install on Android**

- Transfer the APK to your Android device
- Enable **"Install from Unknown Sources"** in device settings
- Tap the APK to install

**Step 3 — Launch the app**

- Open AI Nutritionist on your device
- Sign up with an email and start exploring

✅ No coding needed — best for testers, evaluators, and recruiters

---

### 🔹 Option 2: Run Locally _(Development Mode)_

**Prerequisites**

- Node.js v18+
- Android Studio with an emulator or a physical Android device
- React Native environment configured:  
  👉 [https://reactnative.dev/docs/set-up-your-environment](https://reactnative.dev/docs/set-up-your-environment)

**Step 1 — Clone the repository**

```bash
git clone https://github.com/IrfanSarang/AI-Nutritionist.git
cd AI-Nutritionist
```

**Step 2 — Install frontend dependencies**

```bash
cd App
npm install
```

**Step 3 — Install backend dependencies**

```bash
cd ../backend
npm install
```

**Step 4 — Configure environment variables**

Create a `.env` file in the `/backend` directory. Copy the format from `.env.template` and fill in your values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

**Step 5 — Run the backend**

```bash
cd backend
npm run dev
```

✓ Server will start on `http://localhost:3000`

**Step 6 — Update the frontend API URL**

Open `App/config.ts` and set:

```ts
export const BASE_URL = "http://10.0.2.2:3000"; // Android emulator
// OR
export const BASE_URL = "http://YOUR_LOCAL_IP:3000"; // Physical device
```

**Step 7 — Run the app**

```bash
cd App
npm run android
```

---

## 🚀 Usage Guide

| Step | Action                                                                 |
| ---- | ---------------------------------------------------------------------- |
| 1    | **Sign Up** → Create an account with your email                        |
| 2    | **Add Profile** → Enter your name and health details                   |
| 3    | **Consumption Planner** → Input body stats for daily targets           |
| 4    | **Chat with Nova** → Ask for diet plans, meal suggestions, food advice |
| 5    | **Scan Products** → Use barcode scanner for AI ingredient analysis     |
| 6    | **Log Water** → Tap glasses throughout the day to hit your 2L goal     |
| 7    | **Track Weight** → Log your weight daily to see your progress chart    |
| 8    | **Health Tips** → Browse tips matched to your body type category       |

---

## 🔮 Future Enhancements

- 🔔 **Push notifications** for water reminders and meal times
- 🍱 **Calorie tracking** — log food and auto-deduct from daily target
- 🌙 **Dark mode** support across all screens
- 🌍 **Multi-language support** (Hindi, Marathi, Tamil, etc.)
- 📊 **Weekly / Monthly** nutrition summary reports
- 🧬 **Wearable integration** (Fitbit, Apple Health, Google Fit)
- 🛒 **Smart grocery list** generator based on meal plan
- 🤝 **Dietician marketplace** — connect with real nutrition professionals

---

## 👨‍💻 Developer

**Built by Irfan Sarang**

- 🐙 GitHub: [github.com/IrfanSarang](https://github.com/IrfanSarang)
- 📁 Project: [github.com/IrfanSarang/AI-Nutritionist](https://github.com/IrfanSarang/AI-Nutritionist)

---

## 📄 License

This project is open source and available for educational and personal use.  
See [LICENSE](LICENSE) for full details.

---

<div align="center">

Made with ❤️ by Irfan Sarang

</div>
