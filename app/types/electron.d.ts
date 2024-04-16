interface Window {
    electron: {
      performUnmaximize();
      quitApp: () => void;
      maximizeWindow: () => void;
      isMaximized: () => boolean;  // 追加
      takeScreenshot: () => void;
      onScreenshotTaken: (callback: (path: string) => void) => void;
    }
  }