import React, { useRef, useEffect, useState, useCallback } from "react";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(0);

  // ウィンドウのリサイズを検知してキャンバスのサイズを更新
  useEffect(() => {
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
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // リサイズ後に画像を復元する
    const restoreImage = () => {
      if (historyRef.current[historyIndexRef.current]) {
        context.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      }
    };

    canvas.width = size.width;
    canvas.height = size.height;
    restoreImage();

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
      // 描画終了時に状態を保存
      historyRef.current.push(
        context.getImageData(0, 0, canvas.width, canvas.height)
      );
      historyIndexRef.current = historyRef.current.length - 1;
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
  }, [size]);

  // 戻る機能
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context && historyRef.current[historyIndexRef.current]) {
        context.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
      }
    }
  }, []);
  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.clearRect(
        0,
        0,
        canvas ? canvas.width : 800,
        canvas ? canvas.height : 800
      );
      historyRef.current = [];
      historyIndexRef.current = 0;
    }
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{ border: "1px solid black" }}
      />
      <button
        onClick={undo}
        className="bg-yellow-400 text-white"
        style={{ position: "absolute", top: 20, right: 200 }}
      >
        Back
      </button>
      <button
        onClick={resetCanvas}
        className="bg-green-400 text-white"
        style={{ position: "absolute", top: 20, right: 250 }}
      >
        Reset
      </button>
    </>
  );
}

export default DrawingCanvas;
