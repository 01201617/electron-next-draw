import React, { useRef, useEffect, useState } from "react";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const drawingRef = useRef({ image: null });

  // ウィンドウのリサイズを検知してキャンバスのサイズを更新
  useEffect(() => {
    // コンポーネントがマウントされた後にサイズを設定
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // canvasがnullならば以降の処理を行わない

    const context = canvas.getContext("2d");
    if (!context) return; // context取得がnullならば以降の処理を行わない

    let drawing = false;

    const startDrawing = (e: MouseEvent) => {
      drawing = true;
      draw(e);
    };

    const draw = (e: MouseEvent) => {
      if (!drawing) return;
      context.lineWidth = 5;
      context.lineCap = "round";
      context.strokeStyle = "#000000";
      context.lineTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
      context.stroke();
      context.beginPath();
      context.moveTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
    };

    const stopDrawing = () => {
      drawing = false;
      context.beginPath();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size.width}
      height={size.height}
      style={{ border: "1px solid black" }}
    />
  );
}

export default DrawingCanvas;
