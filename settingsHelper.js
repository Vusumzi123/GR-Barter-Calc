const { app } = require('electron');
const path = require('path');
const fs = require('fs');

// Define where to save the file
const settingsPath = path.join(app.getPath('userData'), 'user-settings.json');

// Helper to save data
function saveSettings(data) {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(data));
    } catch (err) {
        console.error("Could not save settings:", err);
    }
}

// Helper to load data
function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            return JSON.parse(fs.readFileSync(settingsPath));
        }
    } catch (err) {
        console.error("Could not load settings:", err);
    }
    return {}; // Return empty object if no file exists
}

module.exports = {
    settingsPath,
    saveSettings,
    loadSettings
};
