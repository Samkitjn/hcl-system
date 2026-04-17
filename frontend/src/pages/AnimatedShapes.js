import { useEffect, useRef, useState } from "react";
import "../styles/AnimatedShapes.css";

export default function InteractiveShapes() {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getEyeOffset = (cx, cy) => {
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const angle = Math.atan2(dy, dx);
    const max = 6;

    return {
      x: Math.cos(angle) * max,
      y: Math.sin(angle) * max,
    };
  };

  const getStretch = (cx, cy) => {
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 200;
    const force = Math.min(dist / maxDist, 1);

    return {
      scaleX: 1,
      scaleY: 1 + (Math.abs(dy) / maxDist) * 0.5,
      translateX: dx * 0.03 * force,
      translateY: dy * 0.05 * force,
    };
  };

  return (
    <div ref={containerRef} className="shapes-container">
      <Shape
        className="shape purple"
        stylePos={{ left: "34%" }}
        cx={190}
        cy={100}
        getEyeOffset={getEyeOffset}
        getStretch={getStretch}
      />

      <Shape
        className="shape orange"
        stylePos={{ left: "30%" }}
        cx={130}
        cy={220}
        getEyeOffset={getEyeOffset}
        getStretch={getStretch}
      />

      <Shape
        className="shape black"
        stylePos={{ left: "46%" }}
        cx={260}
        cy={190}
        getEyeOffset={getEyeOffset}
        getStretch={getStretch}
      />

      <Shape
        className="shape yellow"
        stylePos={{ left: "54%" }}
        cx={310}
        cy={210}
        hasNose={true}
        getEyeOffset={getEyeOffset}
        getStretch={getStretch}
      />
    </div>
  );
}

function Shape({
  className,
  cx,
  cy,
  getEyeOffset,
  getStretch,
  stylePos,
  hasNose = false,
}) {
  const eye = getEyeOffset(cx, cy);
  const stretch = getStretch(cx, cy);

  return (
    <div
      className={className}
      style={{
        ...stylePos,
        transform: `translate(${stretch.translateX}px, ${stretch.translateY}px) scaleX(${stretch.scaleX}) scaleY(${stretch.scaleY})`,
        transformOrigin: "bottom center",
        transition: "transform 0.1s linear",
      }}
    >
      <div className="eyes">
        {[0, 1].map((i) => (
          <div key={i} className="eye">
            <div
              className="pupil"
              style={{
                transform: `translate(${eye.x}px, ${eye.y}px)`,
              }}
            />
          </div>
        ))}
      </div>

      {hasNose && <div className="nose" />}
    </div>
  );
}