const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { saveSettings, loadSettings } = require('./settingsHelper');
const path = require('path');
const fs = require('fs');
const { json } = require('stream/consumers');

let mainWindow;

const filePrefix = 'TGR_';

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
        mainWindow.webContents.send('open-config-dialog');
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

// --- NEW LOGIC: Handle Folder Selection ---
ipcMain.handle('open-config-folder', async () => {
    
    let folderPath = '';
    
    // Loads user settings

    const userSettings = loadSettings();

    // If no path has been saved 
    if(undefined !== userSettings.skyrimPath) {
        folderPath = userSettings.skyrimPath
    }else {
        // 1. Open the Dialog
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            title: 'Select your Skyrim Game folder, i.e. where your Skyrim.exe is located'
        });

        // 2. If user canceled, return null
        if (result.canceled) {
            return null;
        }
        const filePaths = result.filePaths[0];
        folderPath = path.join( filePaths, 'Data/SKSE/Plugins/DynamicPricing'); // Folder named 'configs'
        // 3. Saves Path to UserSettings
        userSettings.skyrimPath=folderPath;
        saveSettings(userSettings);
    }

    try {
        console.log(folderPath);
        
        return loadFiles(folderPath);
    } catch (err) {
         console.error("Error reading directory:", err);
        return { success: false, error: err.message };  
    }
});

function loadFiles(folderPath) {
     const configData = {};
        // 3. Read all files in the directory
        const files = fs.readdirSync(folderPath);

        // 4. Filter for JSON files and read them
        files.forEach(file => {
            if (path.extname(file).toLowerCase() === '.json' && file.includes(filePrefix)) {
                const fullPath = path.join(folderPath, file);
                const rawData = fs.readFileSync(fullPath, 'utf-8');
                
                try {
                    // We use the filename (without .json) as the key, or merge contents
                    // This depends on your JSON structure. 
                    // For now, let's assume the file content IS the config object.
                    const jsonContent = JSON.parse(rawData);
                    const key = file.replace('.json', '').replace('TGR_','');
                    console.log(jsonContent);

                    configData[key] = jsonContent;
                    
                    // Merge into main config object (or push to array)
                    // Assuming your JSONs are objects like { "Whiterun": {...}, "Riften": {...} }
                    //Object.assign(configData, jsonContent); 
                } catch (parseError) {
                    console.error(`Error parsing ${file}:`, parseError);
                }
            }
        });

        return { success: true, path: folderPath, data: configData };
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

