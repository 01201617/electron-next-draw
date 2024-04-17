const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  clipboard,
  nativeImage,
  screen,
} = require("electron");
const serve = require("electron-serve");
const path = require("path");
const fs = require("fs");

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
    frame: false,
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

  ipcMain.on("take-screenshot", async (event) => {
    const allDisplays = screen.getAllDisplays();
    const winBounds = win.getBounds();
    const currentDisplay = allDisplays.find((display) => {
      const inHorizontalBounds =
        winBounds.x >= display.bounds.x &&
        winBounds.x < display.bounds.x + display.bounds.width;
      const inVerticalBounds =
        winBounds.y >= display.bounds.y &&
        winBounds.y < display.bounds.y + display.bounds.height;
      return inHorizontalBounds && inVerticalBounds;
    });

    if (!currentDisplay) {
      event.reply(
        "screenshot-error",
        "No display found for the application window."
      );
      return;
    }

    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: currentDisplay.bounds.width,
        height: currentDisplay.bounds.height,
      },
    });

    const entireScreenSource = sources.find(
      (source) => source.display_id === currentDisplay.id.toString()
    );

    if (entireScreenSource) {
      const image = entireScreenSource.thumbnail;
      const cropBounds = {
        x: winBounds.x - currentDisplay.bounds.x,
        y: winBounds.y - currentDisplay.bounds.y,
        width: winBounds.width,
        height: winBounds.height,
      };
      const croppedImage = image.crop(cropBounds);

      // ファイル名に日時を追加
      const dateTime = new Date().toISOString().replace(/:/g, "-");
      const screenshotDir = path.join(
        app.getPath("home"),
        "electron-next-draw/png"
      );
      console.log(screenshotDir);
      fs.mkdirSync(screenshotDir, { recursive: true }); // ディレクトリがない場合は作成
      const filePath = path.join(screenshotDir, `screenshot-${dateTime}.png`);

      fs.writeFileSync(filePath, croppedImage.toPNG());
      clipboard.writeImage(nativeImage.createFromBuffer(croppedImage.toPNG()));
      event.reply("screenshot-taken", filePath);
    } else {
      event.reply(
        "screenshot-error",
        "Failed to capture the screen on the specified display."
      );
    }
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
