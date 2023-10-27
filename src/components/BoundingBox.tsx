import { useEffect, useRef, useState } from "react";
import ToolBar from "./ToolBar";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const isAndroid = () => /\b(android)\b/i.test(navigator.userAgent);

const BoundingBox = () => {
  const [tool, setTool] = useState<string>("rectangle");
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [selectedRect, setSelectedRect] = useState<number | null>(null);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [activeControlPoint, setActiveControlPoint] = useState<string | null>(
    null
  );
  const [initialTouchPoint, setInitialTouchPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const identifyControlPoint = (x: number, y: number, rect: Rectangle) => {
    const tolerance = 20;
    const controlPointsOffset = 4;

    if (
      Math.abs(x - (rect.x - controlPointsOffset)) <= tolerance &&
      Math.abs(y - (rect.y - controlPointsOffset)) <= tolerance
    ) {
      return "top-left";
    } else if (
      Math.abs(x - (rect.x + rect.width + controlPointsOffset)) <= tolerance &&
      Math.abs(y - (rect.y - controlPointsOffset)) <= tolerance
    ) {
      return "top-right";
    } else if (
      Math.abs(x - (rect.x - controlPointsOffset)) <= tolerance &&
      Math.abs(y - (rect.y + rect.height + controlPointsOffset)) <= tolerance
    ) {
      return "bottom-left";
    } else if (
      Math.abs(x - (rect.x + rect.width + controlPointsOffset)) <= tolerance &&
      Math.abs(y - (rect.y + rect.height + controlPointsOffset)) <= tolerance
    ) {
      return "bottom-right";
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isAndroid) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (tool === "rectangle") {
      setCurrentRect({ x, y, width: 0, height: 0 });
    } else if (tool === "selection") {
      const foundRect = rectangles.findIndex((r, idx) => {
        const controlPointsOffset = 8;
        const withinInnerRect =
          x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;

        const withinOuterRect =
          idx === selectedRect &&
          x >= r.x - controlPointsOffset &&
          x <= r.x + r.width + controlPointsOffset &&
          y >= r.y - controlPointsOffset &&
          y <= r.y + r.height + controlPointsOffset;

        return withinInnerRect || withinOuterRect;
      });

      if (foundRect !== -1) {
        const controlPoint = identifyControlPoint(x, y, rectangles[foundRect]);
        if (controlPoint) {
          setActiveControlPoint(controlPoint);
          setInitialTouchPoint({ x, y });

          return;
        }
      }

      setSelectedRect(foundRect);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (tool === "rectangle" && currentRect != null) {
      canvasRef.current!.style.cursor = "crosshair";
      setCurrentRect((prevRect) => {
        if (prevRect !== null) {
          return {
            ...prevRect,
            width: x - prevRect.x,
            height: y - prevRect.y,
          };
        } else {
          return null;
        }
      });
    } else if (tool === "selection" && selectedRect != null) {
      if (activeControlPoint && initialTouchPoint) {
        const deltaX = x - initialTouchPoint.x;
        const deltaY = y - initialTouchPoint.y;
        let rect = { ...rectangles[selectedRect] };
        let newRectangles = [...rectangles];
        switch (activeControlPoint) {
          case "top-left":
            rect.x += deltaX;
            rect.y += deltaY;
            rect.width -= deltaX;
            rect.height -= deltaY;
            break;
          case "top-right":
            rect.y += deltaY;
            rect.width += deltaX;
            rect.height -= deltaY;
            break;
          case "bottom-left":
            rect.x += deltaX;
            rect.width -= deltaX;
            rect.height += deltaY;
            break;
          case "bottom-right":
            rect.width += deltaX;
            rect.height += deltaY;
            break;
          default:
            break;
        }
        newRectangles[selectedRect] = rect;
        setRectangles(newRectangles);
        setInitialTouchPoint({ x, y });
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (tool === "rectangle" && currentRect != null) {
      setRectangles((prevRects) => [...prevRects, currentRect]);

      setSelectedRect(rectangles.length);
      setTool("selection");
      setCurrentRect(null);
    } else {
      setActiveControlPoint(null);
      setInitialTouchPoint(null);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || canvas === null) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach((rect, idx) => {
      ctx.strokeStyle = "#1D4ED8";
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      if (idx === selectedRect) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 10]);
        ctx.strokeRect(rect.x - 4, rect.y - 4, rect.width + 8, rect.height + 8);
        ctx.setLineDash([]);

        const controlPoints = [
          { x: rect.x - 4, y: rect.y - 4 }, // top-left corner
          { x: rect.x + rect.width + 4, y: rect.y - 4 }, // top-right corner
          { x: rect.x - 4, y: rect.y + rect.height + 4 }, // bottom-left corner
          { x: rect.x + rect.width + 4, y: rect.y + rect.height + 4 }, // bottom-right corner
        ];

        ctx.fillStyle = "red";
        controlPoints.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    });

    if (currentRect) {
      ctx.strokeStyle = "black";
      ctx?.strokeRect(
        currentRect.x,
        currentRect.y,
        currentRect.width,
        currentRect.height
      );
    }
  };

  const handleDeleteRect = () => {
    if (selectedRect !== null && selectedRect !== -1) {
      const newRectangles = [...rectangles];
      newRectangles.splice(selectedRect, 1);
      setRectangles(newRectangles);
      setSelectedRect(null);
    }
  };

  useEffect(() => {
    draw();
  }, [rectangles, currentRect, selectedRect]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const touchOptions = { passive: false };

    canvas?.addEventListener("touchstart", handleTouchStart, touchOptions);
    canvas?.addEventListener("touchend", handleTouchEnd, touchOptions);
    canvas?.addEventListener("touchmove", handleTouchMove, touchOptions);

    return () => {
      canvas?.removeEventListener("touchstart", handleTouchStart);
      canvas?.removeEventListener("touchend", handleTouchEnd);
      canvas?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  return (
    <div className="mt-4 relative">
      <ToolBar
        selectedRectangle={selectedRect}
        setCurrentTool={setTool}
        onDelete={handleDeleteRect}
      />
      <canvas
        ref={canvasRef}
        className="absolute z-10"
        width="640"
        height="480"
      />
    </div>
  );
};

export default BoundingBox;
