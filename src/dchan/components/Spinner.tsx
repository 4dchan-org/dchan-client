import logo from "assets/images/4dchan.svg";
import React from "react";

export const Spinner = ({
  className = "",
  speed = "slow",
  reverse = false,
  size = 16,
  style = {},
}: {
  className?: string,
  size?: number;
  reverse?: boolean;
  speed?: "slow" | "fast" | "faster" | "sanic" | "second" | "minute" | "hour";
  style?: React.CSSProperties;
}) => (
  <span className={`center flex ${className}`}>
    <img
      className={`spin-${speed} h-${size} w-${size} ${
        reverse ? "animation-direction-reverse" : ""
      } animation-spin pointer-events-none`}
      src={logo}
      alt=""
      style={style}
    />
  </span>
);
