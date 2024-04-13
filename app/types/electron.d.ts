interface Window {
    electron: {
      performUnmaximize();
      quitApp: () => void;
      maximizeWindow: () => void;
      isMaximized: () => boolean;  // 追加
    }
  }