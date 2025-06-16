import React, { useEffect, useRef, useState } from 'react';

interface JoystickProps {
  size: number;
  baseColor: string;
  stickColor: string;
  move: (event: { type: 'move'; x: number; y: number }) => void;
  stop: (event: { type: 'stop' }) => void;
}

export const Joystick: React.FC<JoystickProps> = ({
  size,
  baseColor,
  stickColor,
  move,
  stop,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [touchId, setTouchId] = useState<number | null>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    updatePosition(clientX, clientY);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      updatePosition(clientX, clientY);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    setTouchId(null);
    stop({ type: 'stop' });
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let x = (clientX - centerX) / (rect.width / 2);
    let y = (clientY - centerY) / (rect.height / 2);

    const distance = Math.sqrt(x * x + y * y);
    if (distance > 1) {
      x /= distance;
      y /= distance;
    }

    setPosition({ x, y });
    move({ type: 'move', x, y: -y });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchId === null) {
      const touch = e.touches[0];
      setTouchId(touch.identifier);
      handleStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (touchId !== null) {
      const touch = Array.from(e.touches).find(t => t.identifier === touchId);
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (touchId !== null && !Array.from(e.touches).some(t => t.identifier === touchId)) {
      handleEnd();
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, touchId]);

  const stickSize = size * 0.4;
  const baseSize = size;

  return (
    <div
      ref={containerRef}
      style={{
        width: baseSize,
        height: baseSize,
        backgroundColor: baseColor,
        borderRadius: '50%',
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        style={{
          width: stickSize,
          height: stickSize,
          backgroundColor: stickColor,
          borderRadius: '50%',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${position.x * (baseSize - stickSize) / 2}px, ${position.y * (baseSize - stickSize) / 2}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      />
    </div>
  );
}; 