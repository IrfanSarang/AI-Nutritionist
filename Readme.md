# 🥗 AI Nutritionist — Your Personal AI-Powered Dietician, In Your Pocket

<div align="center">

**A full-stack AI-powered mobile application built with React Native**  
that acts as a virtual dietician — helping users understand their body,  
calculate daily nutrition needs, scan food products, and get personalized AI-generated diet plans.

[![React Native](https://img.shields.io/badge/React_Native-TypeScript-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Open_Source-blue?style=for-the-badge)](LICENSE)

</div>

---

# 📌 Table of Contents

1. About the Project
2. Problem Statement
3. Solution
4. Features
5. App Workflow
6. Tech Stack
7. Installation & Setup
8. Usage Guide
9. Future Enhancements
10. Developer
11. License

---

# 📘 About the Project

AI Nutritionist bridges the gap between complex nutritional science and everyday users.

Instead of needing an expensive dietician appointment, users can open the app, enter their body details, and instantly receive AI-powered insights about their nutrition needs, meal plans, and food choices.

This project was built as a complete full-stack mobile application covering:

- 📱 React Native frontend with clean, component-based architecture
- ⚙️ Node.js + Express backend with JWT authentication
- 🗄️ MongoDB database for user profiles and weight tracking
- 🤖 Google Gemini AI integration for personalized recommendations
- 📷 Barcode scanning for real-world food product analysis
- ☁️ Render deployment (zero-cost cloud hosting)

---

# ❓ Problem Statement

Millions of people struggle with:

😕 Not knowing if they are underweight, normal, or overweight  
😕 No idea how many calories, proteins, or carbs they need daily  
😕 Buying packaged food without understanding the ingredients  
😕 Following generic diets that don't match their body or lifestyle  
😕 No access to affordable, professional nutrition guidance

---

# 💡 Solution

AI Nutritionist solves all of the above by:

✅ Calculating BMI, BMR, and ideal weight range from user data  
✅ Computing exact daily targets for calories, protein, carbs, fats, and water using the Mifflin-St Jeor formula  
✅ Scanning barcodes and using AI to analyze product ingredient suitability  
✅ Generating fully personalized diet plans via an AI chatbot  
✅ Tracking weight progress over time with visual charts  
✅ Providing daily health tips categorized by body type

---

# ✨ Features

## 🧍 Body Analysis & BMI Calculator

- Accepts age, gender, height, weight, and activity level
- Calculates BMI and categorizes:
  - Underweight
  - Normal
  - Overweight
  - Obese
- Shows the ideal healthy weight range for the user's height

---

## 🍽 Daily Consumption Calculator

- Uses Mifflin-St Jeor formula for BMR
- Applies activity multiplier for TDEE
- Calculates:
  - Calories
  - Protein
  - Carbs
  - Fats
  - Water Intake
- Visual macro distribution bar

---

## 🤖 Nova — AI Chatbot (Powered by Gemini AI)

- Powered by Google Gemini AI via backend API
- Provides personalized diet plans
- Gives healthy food swaps and meal timing advice
- Remembers recent conversations
- AsyncStorage-based persistent chat history

---

## 📅 Meal Planner

- Browse AI-suggested meals
- Add meals to a daily planner
- Track planned meals throughout the day

---

## 💧 Water Tracker

- Track daily water intake (2000ml goal)
- Animated water bottle fill UI
- Live progress percentage
- Motivational hydration messages
- Daily persistence using AsyncStorage

---

## 💡 Health Tips

- General Tips mode
- Personalized Tips mode
- Tips based on:
  - Underweight
  - Normal
  - Overweight
- Swipeable card interface

---

## 📷 Food Product Scanner

- Scan packaged food barcodes
- Fetch product name and ingredients
- Display nutritional values per serving

---

## 🧠 AI Product Insight

- Sends ingredients to Gemini AI
- AI explains:
  - Who should consume the product
  - Who should avoid it
  - Harmful additives
  - Allergens
  - Benefits

---

## 🍳 AI Recipe Generator

- Enter ingredients available at home
- Optional allergy filters
- Optional diet preferences
- Generates 2 complete recipes with instructions

---

## 📈 Weight Progress Tracker

- Log daily weight
- Smooth chart visualization
- MongoDB-based history storage

---

## 👤 Multi-Profile Support

- One account supports multiple profiles
- Easy profile switching
- Independent health tracking for each profile

---

## 🔐 Authentication

- JWT-based login/signup
- Forgot password with OTP email verification
- Secure token storage using AsyncStorage

---

# 🔄 App Workflow

```text
① User signs up / logs in
② Creates profile
③ Opens Consumption Planner
④ Gets BMI + nutrition targets
⑤ Chats with Nova AI
⑥ Adds meals to planner
⑦ Tracks water intake
⑧ Scans packaged food
⑨ Logs weight progress
⑩ Reads personalized health tips
```

---

# 🛠 Tech Stack

## 📱 Frontend

| Technology | Purpose |
|---|---|
| React Native (TypeScript) | Mobile app framework |
| React Navigation | Navigation |
| react-native-linear-gradient | UI gradients |
| react-native-chart-kit | Charts |
| react-native-vision-camera | Barcode scanner |
| AsyncStorage | Local storage |
| Animated API | Water tracker animations |

---

## ⚙️ Backend

| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API backend |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Nodemailer | OTP email system |
| express-rate-limit | API protection |
| Render | Cloud deployment |

---

## 🤖 AI Integration

| Technology | Purpose |
|---|---|
| Google Gemini AI | Chatbot + food analysis |
| Prompt Engineering | AI nutrition responses |

---

## 🧰 Tools & DevOps

| Tool | Purpose |
|---|---|
| Git + GitHub | Version control |
| VS Code | Development |
| ESLint + Prettier | Code formatting |
| Android Studio | Emulator/testing |

---

# 📦 Installation & Setup

## 🔹 Option 1 — Install APK

### Step 1 — Download APK

Go to Releases section and download latest APK.

### Step 2 — Install

- Enable Install from Unknown Sources
- Install APK on Android device

### Step 3 — Launch

- Open AI Nutritionist
- Create account
- Start using the app

---

## 🔹 Option 2 — Run Locally

# Prerequisites

- Node.js v18+
- Android Studio
- React Native environment configured

Official setup guide:

https://reactnative.dev/docs/set-up-your-environment

---

# Step 1 — Clone Repository

```bash
git clone https://github.com/IrfanSarang/AI-Nutritionist.git
cd AI-Nutritionist
```

---

# Step 2 — Install Frontend Dependencies

```bash
cd App
npm install
```

---

# Step 3 — Install Backend Dependencies

```bash
cd ../backend
npm install
npm install @google/generative-ai
```

---

# Step 4 — Configure Environment Variables

Create `.env` inside backend folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
GEMINI_API_KEY=your_gemini_api_key
```

Get Gemini API Key:

https://aistudio.google.com/app/apikey

---

# Step 5 — Run Backend

```bash
npm run dev
```

Server runs on:

```text
http://localhost:3000
```

---

# Step 6 — Configure Frontend API URL

Inside `App/config.ts`

```ts
export const BASE_URL = "http://10.0.2.2:3000";
```

For physical device:

```ts
export const BASE_URL = "http://YOUR_LOCAL_IP:3000";
```

---

# Step 7 — Run App

```bash
cd App
npm run android
```

---

# 🚀 Usage Guide

| Step | Action |
|---|---|
| 1 | Sign Up |
| 2 | Add Profile |
| 3 | Calculate Nutrition Targets |
| 4 | Chat with Nova AI |
| 5 | Scan Food Products |
| 6 | Track Water Intake |
| 7 | Log Weight |
| 8 | Read Health Tips |

---

# 🔮 Future Enhancements

- 🔔 Push notifications
- 🌙 Dark mode
- 🌍 Multi-language support
- 📊 Weekly nutrition reports
- 🧬 Wearable integration
- 🛒 Smart grocery list
- 🤝 Dietician marketplace
- 🍱 Calorie tracking

---

# 👨‍💻 Developer

Built by Irfan Sarang

GitHub:
https://github.com/IrfanSarang

Project Repository:
https://github.com/IrfanSarang/AI-Nutritionist

---

# 📄 License

Open source for educational and personal use.

See LICENSE for details.

---

<div align="center">

Made with ❤️ by Irfan Sarang

</div>
