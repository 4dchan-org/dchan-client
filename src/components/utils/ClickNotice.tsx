import React, { useState } from "react";

type Position = { x: number; y: number };
type Tooltip = {
  id: number;
  position: Position;
};

function ClickNotice({
  children,
  notice,
}: {
  children: React.JSX.Element;
  notice: React.JSX.Element;
}) {
  const [tooltips, setTooltips] = useState<Tooltip[]>([]);

  const handleClick = (event: any) => {
    const newTooltip: Tooltip = {
      id: Date.now(), // unique id to act as a key
      position: { x: event.clientX, y: event.clientY },
    };

    setTooltips((tooltips) => [...tooltips, newTooltip]);

    setTimeout(() => {
      setTooltips((tooltips) =>
        tooltips.filter((tooltip) => tooltip.id !== newTooltip.id)
      );
    }, 2000); // remove tooltip after 2 seconds
  };

  return (
    <div onClick={handleClick}>
      {tooltips.map((tooltip) => (
        <Tooltip key={tooltip.id} position={tooltip.position}>
          {notice}
        </Tooltip>
      ))}
      {children}
    </div>
  );
}

const Tooltip = ({
  position,
  children,
}: {
  position: Position;
  children: React.JSX.Element;
}) => (
  <div
    style={{
      pointerEvents: "none",
      position: "absolute",
      left: position.x.toString(),
      top: position.y.toString(),
      transition: "all 1s ease-out",
      animation: "clicknotice linear 1s forwards",
    }}
  >
    {children}
  </div>
);

export default ClickNotice;
