const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Путь к файлу настроек
const SETTINGS_PATH = path.join(__dirname, '../settings.json');

// Элементы UI
const connectBtn = document.getElementById('connect-btn');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const settingsBtn = document.getElementById('open-settings');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const closeApp = document.getElementById('close-btn');
const minimizeApp = document.getElementById('minimize-btn');

// Поля формы
const hostInput = document.getElementById('proxy-host');
const portInput = document.getElementById('proxy-port');
const typeInput = document.getElementById('proxy-type');
const userInput = document.getElementById('proxy-user');
const passInput = document.getElementById('proxy-pass');

// Статистика
const downloadSpeed = document.getElementById('download-speed');
const uploadSpeed = document.getElementById('upload-speed');

let isConnected = false;
let currentSettings = {
    host: '',
    port: '',
    type: 'socks5',
    user: '',
    pass: ''
};

// Загрузка настроек при запуске
function loadSettings() {
    try {
        if (fs.existsSync(SETTINGS_PATH)) {
            const data = fs.readFileSync(SETTINGS_PATH, 'utf8');
            currentSettings = JSON.parse(data);
            
            hostInput.value = currentSettings.host || '';
            portInput.value = currentSettings.port || '';
            typeInput.value = currentSettings.type || 'socks5';
            userInput.value = currentSettings.user || '';
            passInput.value = currentSettings.pass || '';
        }
    } catch (err) {
        console.error('Failed to load settings:', err);
    }
}

// Сохранение настроек
function saveSettings() {
    const host = hostInput.value.trim();
    const port = parseInt(portInput.value);
    
    // Валидация
    let hasError = false;
    
    if (!host) {
        showError('host', 'Host is required');
        hasError = true;
    } else {
        hideError('host');
    }
    
    if (isNaN(port) || port < 1 || port > 65535) {
        showError('port', 'Invalid port (1-65535)');
        hasError = true;
    } else {
        hideError('port');
    }
    
    if (hasError) return;
    
    currentSettings = {
        host,
        port,
        type: typeInput.value,
        user: userInput.value.trim(),
        pass: passInput.value.trim()
    };
    
    try {
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(currentSettings, null, 2));
        settingsModal.classList.remove('open');
    } catch (err) {
        console.error('Failed to save settings:', err);
    }
}

function showError(field, msg) {
    const input = document.getElementById(`proxy-${field}`);
    const errorSpan = document.getElementById(`error-${field}`);
    input.classList.add('input-error');
    errorSpan.innerText = msg;
    errorSpan.classList.add('visible');
}

function hideError(field) {
    const input = document.getElementById(`proxy-${field}`);
    const errorSpan = document.getElementById(`error-${field}`);
    input.classList.remove('input-error');
    errorSpan.innerText = '';
    errorSpan.classList.remove('visible');
}

// Логика переключения состояния
connectBtn.addEventListener('click', () => {
    if (!currentSettings.host || !currentSettings.port) {
        settingsModal.classList.add('open');
        showError('host', 'Please configure proxy first');
        return;
    }
    
    ipcRenderer.send('proxy-toggle', currentSettings);
});

// Слушатели IPC от Main процесса
ipcRenderer.on('proxy-status', (event, status) => {
    isConnected = status.connected;
    
    if (status.error) {
        statusText.innerText = `Error: ${status.error}`;
        statusIndicator.classList.remove('connected');
        statusIndicator.style.background = 'var(--danger)';
        connectBtn.classList.remove('active');
        return;
    }

    if (isConnected) {
        connectBtn.classList.add('active');
        statusIndicator.classList.add('connected');
        statusIndicator.style.background = 'var(--success)';
        statusText.innerText = 'Connected';
    } else {
        connectBtn.classList.remove('active');
        statusIndicator.classList.remove('connected');
        statusIndicator.style.background = 'var(--danger)';
        statusText.innerText = 'Disconnected';
    }
});

ipcRenderer.on('speed-update', (event, speeds) => {
    downloadSpeed.innerText = `${speeds.down || '0.00'} KB/s`;
    uploadSpeed.innerText = `${speeds.up || '0.00'} KB/s`;
});

ipcRenderer.on('tray-proxy-toggle', (event, targetState) => {
    if (targetState !== isConnected) {
        ipcRenderer.send('proxy-toggle', currentSettings);
    }
});

// Управление модальным окном
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('open');
});

closeSettings.addEventListener('click', () => {
    settingsModal.classList.remove('open');
});

saveSettingsBtn.addEventListener('click', saveSettings);

// Управление окном
closeApp.addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

minimizeApp.addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
});

// Закрытие модалки при клике вне контента
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('open');
    }
});

// Инициализация
loadSettings();
