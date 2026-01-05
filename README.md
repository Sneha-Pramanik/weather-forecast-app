# Weather Forecast App

## Project Info
This is my weather forecast app for the JavaScript assignment. It shows weather for any city using OpenWeatherMap API.

## What It Does
- Search weather by city name
- Get your current location weather
- See 5-day forecast
- Save recent searches
- Switch between °C and °F
- Shows alerts for very hot or cold weather
- Changes background based on weather

## How to Run
1. Download all files
2. Open index.html in browser
3. That's it, no install needed

## How to Use
1. Type city name and click Search or press Enter
2. Click "Current" button for your location (allow location access)
3. Click °C or °F to change temperature unit
4. Click on search box to see recent cities
5. See 5-day forecast at bottom

## Files in Project
- index.html - Main page
- style.css - My custom styles
- script.js - All JavaScript code
- README.md - This file
- .gitignore - Files to ignore for GitHub

## What I Used
- HTML for structure
- CSS for styling (Tailwind CSS + my own styles)
- JavaScript for everything
- OpenWeatherMap API for weather data
- localStorage to save recent searches

## Features I Added
1. **Search City** - Works with any city worldwide
2. **Current Location** - Gets your location with browser permission
3. **Recent Searches** - Saves last 5 cities you searched
4. **Temperature Toggle** - Switch between Celsius and Fahrenheit
5. **5-Day Forecast** - Shows next 5 days weather
6. **Weather Alerts** - Warns if temperature is too high or too low
7. **Error Messages** - Shows friendly errors if something goes wrong
8. **Responsive Design** - Works on phone, tablet, and computer

## API Key
I'm using OpenWeatherMap API. The key is in script.js file:
```javascript
const apiKey = '05e1198b79004f3e69aa108166570c65';
Tested On
Chrome (computer and phone)

Firefox

iPhone SE (small screen)

iPad Mini (medium screen)

Desktop (big screen)

Problems I Fixed
Made sure recent searches save properly

Fixed temperature unit switching

Made error messages look nice

Made it work on small screens

Git Commits I Made

Added HTML structure

Added CSS styling

Added JavaScript

Added Readme.md

Note to Teacher
I made all features from the PDF. The app works and looks good on all screen sizes.

Credits
Weather data from OpenWeatherMap

Icons from Font Awesome

Styling with Tailwind CSS

Made by Sneha Pramanik for Weather Forecast Project  
"HTML Structure: Used Tailwind CSS for responsive design"  
