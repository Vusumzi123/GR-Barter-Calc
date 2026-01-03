const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 900,
        backgroundColor: '#121212',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Allows direct access to fs/require in HTML
        }
    });

    // Load your calculator HTML file
    mainWindow.loadFile('index.html');
    
    // Remove the default menu bar (optional)
    //mainWindow.setMenuBarVisibility(false);

    mainWindow.webContents.openDevTools({ mode: 'detach' });

    // --- BACKEND LOGIC FOR SAVING/LOADING CONFIGS ---
// Once the window finishes loading, send the JSON data
    mainWindow.webContents.on('did-finish-load', () => {
        const configPath = path.join(__dirname, '../SKSE/Plugins/DynamicPricing'); // Folder named 'configs'
        const allConfigs = {};

        try {
            if (fs.existsSync(configPath)) {
                const files = fs.readdirSync(configPath);
                
                files.forEach(file => {
                    if (file.endsWith('.json')) {
                        const content = fs.readFileSync(path.join(configPath, file), 'utf-8');
                        // Use filename (without .json) as the key
                        const key = file.replace('.json', '');
                        allConfigs[key] = JSON.parse(content);
                    }
                });
                
                console.debug(allConfigs);
                console.log("All configs loaded")
                // Send the data to the UI
                mainWindow.webContents.send('init-configs', allConfigs);
            }
        } catch (err) {
            console.error("Error loading JSON files:", err);
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

