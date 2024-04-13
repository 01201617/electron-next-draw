"use client";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";

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
    <button
      className="p-2 rounded bg-red-400 text-white hover:bg-red-700 focus:outline-none"
      id="close-button"
    >
      <FontAwesomeIcon icon={faSquareXmark} />
    </button>
  );
}
