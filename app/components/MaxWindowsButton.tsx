"use client";
import { useEffect, useState } from "react";

export default function MaxWindowsButton() {
  const [isMaximized, setIsMaximized] = useState(false);
  const handleToggleMaximize = async () => {
    const maximized = await window.electron.isMaximized(); // 非同期で最大化状態を取得
    setIsMaximized(maximized); // 状態を更新
    if (maximized) {
      window.electron.performUnmaximize(); // 非最大化メソッドを呼び出し
    } else {
      window.electron.maximizeWindow(); // 最大化メソッドを呼び出し
    }
  };

  return (
    <button onClick={handleToggleMaximize}>
      {isMaximized ? "元のサイズに戻す" : "最大化する"}
    </button>
  );
}
