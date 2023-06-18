import { Spinner } from "src/components";
import { Link } from "react-router-dom";
import React from "react";

export const HeaderLogo = React.memo(({ block }: { block?: string }) => {
  return (
    <span className="h-20 font-mono center flex select-none">
      <Link className="z-20" to={`/${block ? `?block=${block}` : ""}`}>
        <span className="relative">
          <span>
            <Spinner
              className="absolute top-0 bottom-0 opacity-10"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 3
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute top-0 bottom-0 ml-3 opacity-20"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 2
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute top-0 bottom-0 ml-6 opacity-30"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 1
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute top-0 bottom-0 ml-9"
              size={16}
              style={{
                animationDelay: `-${new Date().getSeconds()}.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
          </span>
          <span className="text-left lg:ml-28 z-20 invisible lg:visible">4dchan.org</span>
        </span>
      </Link>
    </span>
  );
});
