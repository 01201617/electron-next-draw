const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },
});

contextBridge.exposeInMainWorld("electron", {
  quitApp: () => ipcRenderer.send("quit-app"),
  maximizeWindow: () => ipcRenderer.send("maximize-window"),
  performUnmaximize: () => ipcRenderer.send("unmaximize-window"), // 確認する
  isMaximized: () => ipcRenderer.invoke("is-maximized"),
});
