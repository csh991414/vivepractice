# Lotto Generator with Dark/Light Mode

## Overview
A simple web application that generates random lotto numbers (1-45) and features a theme switcher between dark and light modes.

## Current State
- `index.html`: Basic "Hello World" structure.
- `style.css`: Empty.
- `main.js`: Basic console log function.

## Proposed Plan
1.  **UI Implementation (`index.html`):**
    -   Add a container for lotto numbers.
    -   Add a "Generate Lotto Numbers" button.
    -   Add a "Toggle Theme" button.
2.  **Styling (`style.css`):**
    -   Implement CSS Variables for colors (background, text, lotto balls).
    -   Define styles for the lotto generator UI.
    -   Implement theme classes (`.light-mode`, `.dark-mode`).
3.  **Functionality (`main.js`):**
    -   Implement `generateLotto()` to produce 6 unique random numbers between 1 and 45.
    -   Implement `toggleTheme()` to switch between light and dark modes.
    -   Update the DOM to reflect changes.
4.  **Git Integration:**
    -   Add changes, commit, and push to the remote repository.
