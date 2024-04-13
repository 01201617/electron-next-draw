"use client";
import MaxWindowsButton from "./components/MaxWindowsButton";
import StopButton from "./components/stopButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 border-2 border-sky-300">
      <p className="bg-gray-100">hello world</p>
      <StopButton />
      <MaxWindowsButton />
    </main>
  );
}
