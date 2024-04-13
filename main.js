const { app, BrowserWindow, ipcMain } = require("electron");
const serve = require("electron-serve");
const path = require("path");

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "./out"),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    // win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }

  // 別のIPCイベントを使用して最大化と非最大化を区別
  ipcMain.on("maximize-window", () => {
    if (!win.isMaximized()) {
      win.maximize();
    }
  });

  ipcMain.on("unmaximize-window", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    }
  });

  // 'is-maximized' イベントに対するハンドラを登録
  ipcMain.handle("is-maximized", () => {
    return win.isMaximized();
  });
};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// レンダラープロセスからの 'quit-app' メッセージをリッスン
ipcMain.on("quit-app", () => {
  app.quit();
});
