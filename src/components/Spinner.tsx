import logo from "src/assets/images/4dchan.svg";
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
      className={`spin-${speed} ${{
        16: "h-16 w-16",
        8: "h-8 w-8",
        4: "h-4 w-4",
      }[size]} ${
        reverse ? "animation-direction-reverse" : ""
      } animation-spin pointer-events-none`}
      src={logo}
      alt=""
      style={style}
    />
  </span>
);
