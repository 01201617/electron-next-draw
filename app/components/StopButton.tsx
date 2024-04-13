"use client";
import { useEffect } from "react";

export default function StopButton() {
  useEffect(() => {
    const closeButton = document.getElementById("close-button");

    if (closeButton) {
      const handleQuit = () => {
        window.electron.quitApp();
      };

      closeButton.addEventListener("click", handleQuit);

      return () => {
        closeButton.removeEventListener("click", handleQuit);
      };
    }
  }, []);
  return (
    <button className="bg-gray-100" id="close-button">
      アプリを停止
    </button>
  );
}
