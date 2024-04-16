import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";

export default function ScreenShotButton() {
  const handleTakeScreenshot = () => {
    console.log(window.electron);
    window.electron.takeScreenshot();
    window.electron.onScreenshotTaken((path) => {
      console.log(`Screenshot was saved to: ${path}`);
    });
  };

  return (
    <div>
      <button
        className="p-2 rounded bg-blue-400 text-white hover:bg-blue-700 focus:outline-none"
        onClick={handleTakeScreenshot}
        style={{ position: "absolute", top: 10, right: 120 }}
      >
        <FontAwesomeIcon icon={faCameraRetro} />
      </button>
    </div>
  );
}
