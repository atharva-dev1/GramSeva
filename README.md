# 🌾 GramSeva

### AI-Powered Village Services Portal

**अपनी आवाज़, अपना अधिकार**
**Bridging Bharat's Digital Divide, One Voice at a Time**

**Team:** NexAura
**College:** PSIT, Kanpur
**Hackathon:** HackStreet 4
**Theme:** Build for Bharat
**Version:** 1.0.0 — MVP
**Date:** April 2026

---

# 📚 Table of Contents

1. Project Overview
2. Problem Statement
3. Our Solution — GramSeva
4. Key Features
5. Tech Stack & Architecture
6. App Screens & User Flow
7. Data Sources
8. Target Audience
9. Impact & Scale
10. Setup & Installation
11. How to Run the Demo
12. File Structure
13. Team Members
14. Future Roadmap
15. Acknowledgements

---

# 📋 1. Project Overview

**GramSeva** is a voice-first, multilingual, offline-capable web application built for rural and underserved communities across India.

It enables villagers to:

* Discover government welfare schemes
* Check live mandi prices
* Access health guidance
* Understand legal rights

—all by simply **speaking in their own language**.

Built using **100% free and open-source tools**, GramSeva:

✅ Requires no reading ability
✅ Works on 2G networks
✅ Functions offline
✅ Runs on low-end Android phones

---

### App Details

| Field         | Value                     |
| ------------- | ------------------------- |
| App Name      | GramSeva (ग्रामसेवा)      |
| Meaning       | Village Service           |
| Tagline       | Apni Awaaz, Apna Adhikar  |
| Type          | Progressive Web App (PWA) |
| Target Device | Android mobile            |
| Languages     | English + Hindi           |
| Internet      | Offline-first             |

---

# 🚨 2. Problem Statement — Why GramSeva Exists

Over **650 million rural Indians** lack access to government digital services.

### Major Issues

### 1️⃣ No Unified Platform

* Schemes like PM-KISAN, Ayushman Bharat, NREGA exist separately
* Villagers visit multiple offices

### 2️⃣ Language Barrier

* 95% services require English literacy
* India has 22 official languages

### 3️⃣ Connectivity Gap

* Rural areas depend on 2G networks
* Apps require stable internet

### 4️⃣ Middleman Exploitation

* ₹200–₹2,000 charged per application
* ₹15,000 crore informal dependency ecosystem

### 5️⃣ Mandi Price Ignorance

* Farmers lack access to real crop prices
* AGMARKNET exists but inaccessible

---

# 💡 3. Our Solution — GramSeva

A **voice-based government helpdesk** for rural India.

Users can access:

* Welfare schemes
* Crop prices
* Healthcare info
* Legal assistance

Using:

🎙️ Voice
📱 Any Android phone
🌐 Even without internet

### Key Advantages

* Voice-first interface
* Offline support
* Multilingual
* Free access
* Works on 2G networks

---

# ⭐ 4. Key Features

## 🎙️ Voice-First Interface

* Speak in Hindi, Bhojpuri, or English
* Real-time speech recognition
* No typing required
* No literacy required

---

## 📋 Smart Scheme Finder

Includes:

* PM-KISAN
* Ayushman Bharat
* NREGA
* Ujjwala Yojana

Displays:

* Eligibility
* Benefits
* Required documents
* Apply buttons

---

## 📈 Live Mandi Prices

Supports:

* Wheat
* Rice
* Potato
* Onion
* Mustard
* Sugarcane
* Maize

District coverage:

* Kanpur
* Lucknow
* Varanasi
* Agra
* Prayagraj

Includes:

* Trend indicators
* % change
* Yesterday’s price
* Weekly high

Source: **AGMARKNET**

---

## 🏥 Health Help

Features:

* Symptom checker
* Nearest PHC locator
* District hospital info
* Jan Aushadhi stores
* Emergency **112 call button**

Works offline via cached data

---

## 🌐 Hindi ↔ English Toggle

* One-tap switch
* Full UI translation
* Preference saved locally

---

# 🛠️ 5. Tech Stack & Architecture

| Layer              | Technology          | Purpose              |
| ------------------ | ------------------- | -------------------- |
| Frontend           | HTML5 + CSS3 + JS   | Single-file PWA      |
| Styling            | CSS Variables       | Mobile-first UI      |
| Animations         | CSS Keyframes       | Smooth transitions   |
| Voice              | Web Speech API      | Speech recognition   |
| Voice (Production) | Bhashini API        | 22+ Indian languages |
| Database           | Supabase            | Auth + storage       |
| APIs               | data.gov.in         | Scheme data          |
| Mandi Data         | AGMARKNET           | Crop prices          |
| Hosting            | Render.com          | Free hosting         |
| Fonts              | Poppins + Noto Sans | UI typography        |

---

# 📱 6. App Screens & User Flow

| Screen   | Name         | Features                         |
| -------- | ------------ | -------------------------------- |
| Screen 1 | Home         | Mic button, stats, service cards |
| Screen 2 | Mandi Prices | Crop trends                      |
| Screen 3 | My Schemes   | Voice search                     |
| Screen 4 | Health Help  | Symptom checker                  |

---

## Example User Flow

User speaks:

> "PM Kisan ke liye apply karna hai"

App response:

✅ Detects voice
✅ Searches schemes
✅ Shows eligibility
✅ Displays ₹6,000/year benefit

---

# 📊 7. Data Sources

| Data          | Source              |
| ------------- | ------------------- |
| Schemes       | data.gov.in         |
| Crop Prices   | AGMARKNET           |
| Voice AI      | Bhashini API        |
| Location      | Browser Geolocation |
| Facility Data | Demo dataset        |
| Auth          | Supabase            |

Hackathon demo uses **offline JS arrays**

Production uses **live APIs**

---

# 🎯 8. Target Audience

| Segment            | Size  |
| ------------------ | ----- |
| Farmers            | 146M+ |
| Rural Women        | 200M+ |
| Daily Wage Workers | 450M+ |
| Panchayats         | 250K+ |

**Total Reach:** 800M+ citizens

---

# 🚀 9. Impact & Scale

Potential benefits:

* ₹6,000/year income via PM-KISAN
* ₹5 lakh health cover via Ayushman Bharat
* Removes agent fees
* Improves crop price negotiation
* Works across 640,000 villages
* Supports 22 languages

Even **1% adoption = 8 million families helped**

---

# ⚙️ 10. Setup & Installation

## Requirements

* Chrome browser recommended
* No Node.js required

---

## Option A — Direct Run

```
Download index.html
Double-click
App opens instantly
```

---

## Option B — Voice Enabled

```
npx serve .
```

Open:

```
http://localhost:3000
```

---

# 🎬 11. How to Run Demo

1. Open index.html
2. Tap mic button
3. Watch voice interaction
4. Explore mandi prices
5. Try scheme filters
6. Toggle EN ↔ HI
7. Use health checker

Tip: Use Chrome on Android

---

# 📁 12. File Structure

```
gramseva/
│
├── index.html
├── README.md
└── assets/
    └── icon.png
```

Inside index.html:

1. HTML structure
2. CSS styling
3. Data arrays
4. Navigation logic
5. Voice system
6. Mandi rendering
7. Scheme filters
8. Health checker

---

# 👥 13. Team Members

**Team:** NexAura
**College:** PSIT Kanpur

| Member   | Role                             |
| -------- | -------------------------------- |
| Member 1 | Team Lead & Full Stack Developer |
| Member 2 | AI/ML & UI Engineer              |

Hackathon: HackStreet 4.0
Theme: Build for Bharat

---

# 🗺️ 14. Future Roadmap

## Phase 1 (1 Month)

* Integrate Bhashini API
* Live AGMARKNET API
* Add 500+ schemes
* Deploy backend

---

## Phase 2 (3 Months)

* React Native mobile app
* WhatsApp bot integration
* Panchayat dashboard
* SMS fallback support

---

## Phase 3 (6 Months)

* CSC partnerships
* DigiLocker integration
* AI eligibility checker
* Regional language expansion

---

# 🙏 15. Acknowledgements

Thanks to:

* Government of India (Bhashini, data.gov.in, AGMARKNET)
* Supabase
* Google Web Speech API
* HackStreet 4.0 organizers
* PSIT Kanpur

---

# 🌾 GramSeva

**Apni Awaaz, Apna Adhikar**

**NexAura · PSIT Kanpur · HackStreet 4.0** 🚀
