import React, { useRef, useEffect, useState, useCallback } from "react";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(0);
  const [pen, setPen] = useState({
    color: "#2f41a7",
    width: 5,
    opacity: 0.8,
  });

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
      context.lineWidth = pen.width;
      context.lineCap = "round";
      context.strokeStyle = `rgba(${parseInt(
        pen.color.slice(1, 3),
        16
      )}, ${parseInt(pen.color.slice(3, 5), 16)}, ${parseInt(
        pen.color.slice(5, 7),
        16
      )}, ${pen.opacity})`;
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
  }, [size, pen]);

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

  // ペンの属性を更新するハンドラー
  const updatePen = useCallback(
    (attribute: keyof typeof pen, value: string | number) => {
      setPen((prevPen) => ({
        ...prevPen,
        [attribute]: value,
      }));
    },
    []
  );

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
      <button
        className="bg-violet-400 text-white"
        style={{ position: "absolute", top: 20, right: 300 }}
        onClick={() => updatePen("width", pen.width + 1)}
      >
        Width +
      </button>
      <button
        className="bg-violet-400 text-white"
        style={{ position: "absolute", top: 20, right: 370 }}
        onClick={() => updatePen("width", pen.width - 1)}
      >
        Width -
      </button>
      <button
        className="bg-neutral-400 text-white"
        style={{ position: "absolute", top: 20, right: 490 }}
        onClick={() => updatePen("opacity", Math.min(pen.opacity + 0.1, 1))}
      >
        Opaque +
      </button>
      <button
        className="bg-neutral-400 text-white"
        style={{ position: "absolute", top: 20, right: 570 }}
        onClick={() => updatePen("opacity", Math.max(pen.opacity - 0.1, 0))}
      >
        Opaque -
      </button>
      <input
        style={{ position: "absolute", top: 20, right: 700 }}
        type="color"
        value={pen.color}
        onChange={(e) => updatePen("color", e.target.value)}
      />
    </>
  );
}

export default DrawingCanvas;
