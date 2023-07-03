import { Spinner } from "src/components";
import { Link } from "react-router-dom";
import React from "react";

export const HeaderLogo = React.memo(({ block }: { block?: string }) => {
  return (
    <span className="font-mono center flex">
      <Link className="z-20" to={`/${block ? `?block=${block}` : ""}`}>
        <span className="h-16 inline-block relative">
          <span className="select-none">
            <Spinner
              className="absolute w-14 h-14 top-0 bottom-0 opacity-10"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 3
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute w-14 h-14 top-0 bottom-0 ml-3 opacity-20"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 2
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute w-14 h-14 top-0 bottom-0 ml-6 opacity-30"
              size={16}
              style={{
                animationDelay: `-${
                  new Date().getSeconds() - 1
                }.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
            <Spinner
              className="absolute w-14 h-14 top-0 bottom-0 ml-9"
              size={16}
              style={{
                animationDelay: `-${new Date().getSeconds()}.${new Date().getMilliseconds()}s`,
              }}
              speed={"minute"}
            />
          </span>
          <span className="text-left lg:ml-28 z-20 invisible lg:visible absolute"><div className="font-bold">4dchan.org</div><div className="text-xs text-gray-600 dchan-header-subtitle">Decentralized Timetraveling Imageboard</div></span>
        </span>
      </Link>
    </span>
  );
});
