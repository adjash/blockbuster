import { useEffect, useState, useCallback } from "react";

function Platform({ onShoot, position, setPosition }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handleMove = useCallback(
    (clientX) => {
      if (isDragging) {
        const newX = clientX - dragOffset;
        setPosition((prev) => ({
          ...prev,
          x: Math.max(75, Math.min(newX, 524)),
        }));
      }
    },
    [isDragging, dragOffset, setPosition]
  );

  const handleStart = useCallback(
    (clientX) => {
      const clickOffsetX = clientX - position.x;
      setDragOffset(clickOffsetX);
      setIsDragging(true);
    },
    [position.x]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setPosition((prev) => ({
          ...prev,
          x: Math.max(prev.x - 50, 75),
        }));
      } else if (e.key === "ArrowRight") {
        setPosition((prev) => ({
          ...prev,
          x: Math.min(prev.x + 50, 524),
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setPosition]);

  const handleMouseDown = (e) => {
    handleStart(e.clientX);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  return (
    <div
      className="absolute bottom-0 w-[150px] h-[20px] bg-blue-600 rounded-md"
      style={{ left: position.x - 75 }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={onShoot}
      onKeyUp={onShoot}
    ></div>
  );
}

export default Platform;
