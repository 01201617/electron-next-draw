"use client";
import DrawingCanvas from "./components/DrawingCanvas";
import MaxWindowsButton from "./components/MaxWindowsButton";
import StopButton from "./components/stopButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between border-2 border-sky-300">
      <div className="absolute top-0 right-0 p-2 space-x-2">
        <StopButton />
        <MaxWindowsButton />
      </div>
      <DrawingCanvas />
    </main>
  );
}
