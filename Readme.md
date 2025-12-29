# 🥗 AI Nutritionist

AI Nutritionist is a **React Native mobile application** that acts like a **virtual dietician**, helping users understand their body condition, daily food requirements, and make healthier eating choices using AI-powered insights.

The app mimics a **real-life consultation with a dietician**, from checking body weight status to creating personalized diet plans and scanning food products for suitability.

---

## 📖 Table of Contents

- About the Project
- Problem Statement
- Solution
- Features
- App Workflow
- Tech Stack
- Installation & Setup
- Usage
- Future Enhancements
- License

---

## 📘 About the Project

AI Nutritionist is designed to guide users toward better nutrition and healthier daily habits.  
It helps users:

- Check whether they are **underweight, normal, or overweight**
- Calculate **daily food consumption needs**
- Get **AI-generated personalized diet plans**
- Plan meals
- Scan food products and analyze ingredients

The goal is to make **nutrition guidance simple, accessible, and personalized**.

---

## ❓ Problem Statement

Many people struggle with:

- Understanding their body weight condition
- Knowing how much food they should eat daily
- Choosing the right foods from packaged products
- Following healthy daily habits consistently

Professional dieticians are not always accessible or affordable.

---

## 💡 Solution

AI Nutritionist provides a **digital dietician experience** by:

- Using mathematical calculations to analyze body metrics
- Generating personalized diet prompts for AI
- Helping users plan meals
- Giving AI-based insights on scanned food products
- Offering practical health tips for daily improvement

---

## ✨ Features

### 🧍 Body Weight Analysis

- Determines whether the user is **underweight, normal, or overweight**
- Based on user input and health calculations

### 🍽️ Daily Consumption Calculator

- Calculates **how much food a user should consume daily**
- Uses mathematical formulas for accurate results

### 🤖 Ask AI (Personalized Diet)

- Generates a **simple prompt** based on user data
- User can copy this prompt and ask the in-app AI chatbot
- AI provides a **personalized diet plan**

### 📅 Meal Planner

- Users can choose meals from AI suggestions
- Add selected meals to a **meal planner**

### 💡 Health Tips

- Daily habits and lifestyle tips
- Helps improve overall health and consistency

### 📷 Food Product Scanner

- Scans **barcode of food products**
- Displays product and ingredient information

### 🧠 AI Insight (Product Suitability)

- AI analyzes ingredients
- Tells **who the product is suitable for**
- Warns users based on ingredient composition

---

## 🔄 App Workflow

1. User enters body details
2. App checks weight category
3. Daily food consumption is calculated
4. A prompt is generated for AI
5. AI provides a personalized diet
6. User selects meals and plans them
7. User scans food products for AI insights
8. Health tips help improve daily habits

---

## 🛠️ Tech Stack

**Frontend / Mobile App**

- React Native
- JavaScript

**AI & Logic**

- AI Chatbot Integration
- Mathematical health calculations

**Tools**

- Git & GitHub
- VS Code

---

## ⚙️ Installation & Setup

You can use the AI Nutritionist app in **two ways**:

---

### 🔹 Option 1: Test the App (Release Version)

This option is for users who want to **test the app without setting up the project locally**.

#### 1️⃣ Download the App Release

- Go to the **Releases** section of this GitHub repository
- Download the latest **APK (Android release build)**

#### 2️⃣ Install the App

- Transfer the APK to your Android device
- Enable **Install from Unknown Sources** in device settings
- Install the APK

#### 3️⃣ Run the Provided Server (Web)

- The backend / AI server is hosted on **Render**
- Open the provided **server URL** in your web browser
- Ensure the server status is **running** before opening the app

```bash
https://ai-nutritionist-5axb.onrender.com
```

> 🌐 No local server setup is required

#### 4️⃣ Open the App

- Launch the app on your device
- The app will connect to the online server automatically

> ✅ Best for testers, evaluators, and demo purposes

---

### 🔹 Option 2: Run the App Locally (Development Mode)

This option is for developers who want to **run and modify the app locally**.

#### 1️⃣ Clone the repository

```bash
https://github.com/IrfanSarang/AI-Nutritionist.git
```

#### 2️⃣ Install dependencies

```bash
cd App
npm install

cd..
cd backend
npm install
```

#### 3️⃣ Set Environment Variables in backend

The make a .env file and in backend cpoy the format from .en.template and make set variables value

#### 4️⃣ Run the frontend and backend

```bash
cd App
npm run Android

cd ..
cd backend
npm run dev
```
