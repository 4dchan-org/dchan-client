import { Spinner } from "src/components";
import { Link } from "react-router-dom";
import React from "react";

export const HeaderLogo = React.memo(({ block }: { block?: string }) => {
  return (
    <span className="font-mono">
      <Link
        className="z-20"
        to={`/${block ? `?block=${block}` : ""}`}
        title="4dchan.org"
      >
        <span className="left-0 top-5 absolute">
          <span className="select-none relative">
            <Spinner
              className="absolute w-14 top-0 bottom-0 opacity-10"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 6
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute w-14 top-0 bottom-0 ml-3 opacity-20"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 4
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute w-14 top-0 bottom-0 ml-6 opacity-30"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 1
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute w-14 top-0 bottom-0 ml-9"
              size={16}
              style={{
                animationDelay: `-${new Date().getSeconds()}.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
          </span>
        </span>
        <div className="text-left invisible lg:visible text-xs text-gray-600 dchan-header-subtitle ml-24">
          <div>Decentralized</div>
          <div>Timetraveling</div>
          <div>Imageboard</div>
        </div>
      </Link>
    </span>
  );
});
