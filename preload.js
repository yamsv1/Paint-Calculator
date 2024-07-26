const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    calculatePaint: (data) => ipcRenderer.invoke('calculate-paint', data)
});

