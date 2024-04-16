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
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
      thumbnailSize: { width: 1920, height: 1080 }, // 高解像度でスクリーンショットを取得
    });
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;
    const entireScreenSource = sources.find(
      (source) =>
        source.name === "画面全体" || source.name === "Create Next App"
    );

    // スクリーンショット取得のためのソースを選択
    console.log(sources.map((s) => s.name)); // 利用可能なソースの名前をログ出力
    if (entireScreenSource) {
      const image = entireScreenSource.thumbnail.resize({ width, height });
      // const image = await entireScreenSource.thumbnail.toPNG(); // スクリーンショットをPNG形式で取得
      const windowBounds = win.getBounds();
      const croppedImage = image.crop(windowBounds);

      const filePath = path.join(__dirname, "screenshot.png");
      const pngBuffer = croppedImage.toPNG();
      fs.writeFileSync(filePath, pngBuffer);

      const nativeImg = nativeImage.createFromBuffer(pngBuffer);
      clipboard.writeImage(nativeImg);
      event.reply("screenshot-taken", filePath);

      // const filePath = path.join(__dirname, "screenshot.png");
      // fs.writeFileSync(filePath, image); // ファイルに書き込み
      // event.reply("screenshot-taken", filePath); // レンダラーにパスを通知
      // クリップボードに画像をセット
      const img = nativeImage.createFromBuffer(croppedImage);
      clipboard.writeImage(img);
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
