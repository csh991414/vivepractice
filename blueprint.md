# Flowerly News - Stock Impact News Dashboard

## Overview
A financial dashboard that simulates daily morning news scraping and a dedicated partnership request system. Rebranded from StockInsight KR to Flowerly News.

## Current State
- `index.html`: Main dashboard for Flowerly News.
- `partnership.html`: Rebranded partnership inquiry form.
- `privacy.html` & `terms.html`: Rebranded policy pages.
- `style.css`: Unified financial theme.
- `main.js`: 9 AM News Rotation System (30 items batch, 3 items cycle).
- **Favicon:** `favicon.jpg` used as the site icon.
- **Analytics:** 
  - Google Tag Manager (G-36QESVDLHY)
  - Microsoft Clarity (vtfjpdug32)

## Features
- **9 AM Batch Loading:** Fetches 30 news items per category every morning at 9 AM.
- **News Rotation:** Displays 3 items at a time, cycling through the 30-item batch upon refresh.
- **AI-Based Impact Prediction:** Analyzes news content to predict stock market impacts.
- **Rebranded UI:** Expressive typography and "Flowerly News" branding.
- **Dark/Light Mode:** Full theme support.
- **Partnership System:** Integrated with Formspree for inquiries.

## Technical Details
- **News Fetching:** Uses Google News RSS via AllOrigins proxy with a robust JSON parsing method.
- **State Management:** Local cache for news items and rotation indices.
- **Deployment:** GitHub Pages / Firebase Hosting.
