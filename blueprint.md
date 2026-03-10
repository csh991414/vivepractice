# Stock Impact News Dashboard

## Overview
A financial dashboard that simulates daily morning news scraping, organizes headlines, and predicts potential impacts on specific Korean stocks based on keywords and industry analysis.

## Current State
- `index.html`, `style.css`, `main.js`: Currently contains the Lotto Generator.

## Proposed Plan
1.  **Clean Up:** Remove existing lotto-related code and styles.
2.  **UI Implementation (`index.html`):**
    -   Create a "Morning News Briefing" section.
    -   Implement a card-based layout for headlines.
    -   Add a "Analyze Impact" or "Refresh Headlines" button.
    -   Include a theme toggle.
3.  **Styling (`style.css`):**
    -   Professional financial dashboard aesthetic (clean typography, subtle borders, status indicators).
    -   Responsive grid for news cards.
    -   Dynamic styling for "Positive/Negative/Neutral" impact indicators.
4.  **Functionality (`main.js`):**
    -   **Mock Data Engine:** A collection of realistic financial headlines and news categories.
    -   **Prediction Logic:** A function that parses headlines for keywords (e.g., "반도체", "이차전지", "금리") and maps them to relevant Korean stocks (e.g., "삼성전자", "LG에너지솔루션", "카카오").
    -   **DOM Rendering:** Dynamically generate news cards with headline, summary, and "Affected Stocks" tags.
5.  **Git Integration:**
    -   Add, commit, and push the new dashboard to GitHub.
