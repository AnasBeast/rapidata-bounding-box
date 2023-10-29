import { Dispatch, createContext, useContext, useEffect, useRef, useState } from "react";
import ToolBar from "./ToolBar";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const isAndroid = () => /\b(android)\b/i.test(navigator.userAgent);

const BoundingBoxContext = createContext<{ boundingBoxs: Rectangle[], setBoundingBoxs: Dispatch<React.SetStateAction<Rectangle[]>>}>({ boundingBoxs: [], setBoundingBoxs: () => {} });

export const useBoundingBoxContext = () => {
  return useContext(BoundingBoxContext);
}

export const BoundingBoxProvider = ({children}: { children: React.ReactNode }) => {
  const [boundingBoxs, setBoundingBoxs] = useState<Rectangle[]>([]);

  return (
    <BoundingBoxContext.Provider value={{ boundingBoxs, setBoundingBoxs }}>
      {children}
    </BoundingBoxContext.Provider>
  );
}

interface BoundingBoxProps {
  width: number;
  height: number;
}

const BoundingBox = ({ width, height }: BoundingBoxProps) => {
  const [tool, setTool] = useState<string>("rectangle");
  const { boundingBoxs, setBoundingBoxs } = useBoundingBoxContext();
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
      const foundRect = boundingBoxs.findIndex((r, idx) => {
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
        const controlPoint = identifyControlPoint(x, y, boundingBoxs[foundRect]);
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
        let rect = { ...boundingBoxs[selectedRect] };
        let newRectangles = [...boundingBoxs];
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
        setBoundingBoxs(newRectangles);
        setInitialTouchPoint({ x, y });
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (tool === "rectangle" && currentRect != null) {
      setBoundingBoxs((prevRects) => [...prevRects, currentRect]);

      setSelectedRect(boundingBoxs.length);
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

    boundingBoxs.forEach((rect, idx) => {
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
      const newRectangles = [...boundingBoxs];
      newRectangles.splice(selectedRect, 1);
      setBoundingBoxs(newRectangles);
      setSelectedRect(null);
    }
  };

  useEffect(() => {
    draw();
  }, [boundingBoxs, currentRect, selectedRect]);

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

  useEffect(() => {
    if (width && height) {
      const canvas = canvasRef.current;
      if(!canvas) return;
      
      canvas.width = width;
      canvas.height = height;
    }
  }, [width, height])

  return (
    <div className="mt-4 relative">
      <ToolBar
        currentTool={tool}
        setCurrentTool={setTool}
        selectedRectangle={selectedRect}
        onDelete={handleDeleteRect}
      />
      <canvas
        ref={canvasRef}
        className="absolute z-10 mt-4"
      />
    </div>
  );
};

export default BoundingBox;
