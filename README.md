# 🏋️‍♂️ GymTracker AI (CN)

> **智能健身追踪 (Smart Fitness Tracker)**
>
> A lightweight, serverless Progressive Web App (PWA) designed for fitness enthusiasts. It combines rigorous workout logging with the power of Google Gemini AI for coaching and analysis, all while keeping your data 100% in your own Google Drive.

![App Screenshot](https://cdn-icons-png.flaticon.com/512/2548/2548532.png)

## ✨ Features

- **🔒 Privacy First**: No proprietary database. All your workout data is stored in your personal **Google Sheet**.
- **🤖 Gemini AI Coach**: 
  - Integrated AI chat assistant for real-time form checks and advice.
  - **Weekly AI Reports**: Generates personalized progress analysis based on your actual log history.
- **📅 Smart Scheduling**: 
  - 4-Day Upper/Lower Split (Upper A/B, Lower A/B).
  - **Flexible Start Day**: Configure your weekly cycle to start on any day of the week via Settings.
  - Auto-detection of Rest Days vs Training Days.
- **📊 Progress Dashboard**: Visual charts tracking your strength progression over time.
- **📱 PWA Support**: Installable on mobile devices (iOS/Android) for a native-like experience.
- **🇨🇳 Localized**: Fully localized interface for Chinese users.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (`@google/genai` SDK)
- **Database**: Google Sheets API v4
- **Auth**: Google Identity Services (OAuth 2.0)
- **Viz**: Chart.js

## 🚀 Getting Started

### Prerequisites

You need two API keys to run this application:

1.  **Google Cloud Project (for Sheets API)**:
    -   Enable **Google Sheets API**.
    -   Create an OAuth 2.0 Client ID.
    -   Add `http://localhost:5173` (and your production URL) to "Authorized JavaScript origins".
2.  **Google AI Studio (for Gemini API)**:
    -   Get an API key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/gym-tracker-ai.git
    cd gym-tracker-ai
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file (or set them in your environment):
    ```env
    VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
    VITE_API_KEY=your_gemini_api_key
    ```

4.  Run locally:
    ```bash
    npm run dev
    ```

## 📖 Usage Guide

1.  **Login**: Click "Sign in with Google".
2.  **Setup**: The app will automatically create a spreadsheet named `GymTracker AI Logs` in your Google Drive if one doesn't exist.
3.  **Logging**: 
    -   View today's exercises based on the current schedule.
    -   Enter weight and reps, then click "Finish Set".
4.  **AI Coach**: Click the floating button to ask questions like "How do I do a proper squat?" or "Suggest a substitute for Dips".
5.  **Settings**: Click the gear icon in the header to change which day your workout week starts (e.g., if you start your "Upper A" day on Tuesday instead of Monday).

## 📦 Deployment

This project is configured for **GitHub Pages**.

1.  Go to your GitHub Repository **Settings** -> **Secrets and variables** -> **Actions**.
2.  Add the following Repository Secrets:
    -   `VITE_GOOGLE_CLIENT_ID`
    -   `VITE_API_KEY`
3.  Push to the `main` branch. The included GitHub Action (`deploy.yml`) will build and deploy the app.

## 🛡 Privacy Policy

This application is **serverless**. It runs entirely in your browser.
- **Data**: Stored exclusively in your Google Sheets.
- **Auth**: Handled directly by Google; the app never sees your password.
- **AI**: Anonymized prompts are sent to Google Gemini for processing only when you interact with the Coach.

## 📄 License

MIT
