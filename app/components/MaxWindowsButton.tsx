"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";

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
    <button
      className="p-2 rounded bg-blue-400 text-white hover:bg-blue-700 focus:outline-none"
      onClick={handleToggleMaximize}
    >
      <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
    </button>
  );
}
