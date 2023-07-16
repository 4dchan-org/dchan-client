import { Spinner } from "src/components";
import { Link } from "react-router-dom";
import React from "react";

export const HeaderLogo = React.memo(({ block }: { block?: string }) => {
  return (
    <span className="font-mono center flex">
      <Link className="z-20" to={`/${block ? `?block=${block}` : ""}`} title="4dchan.org">
        <span className="h-16 inline-block relative">
          <span className="text-left ml-5 invisible lg:visible absolute h-14 grid center">
            <div className="text-xs text-gray-600 dchan-header-subtitle">
              Decentralized Timetraveling Imageboard
            </div>
          </span>
          <span className="lg:ml-20 inline-block">
            <span className="select-none relative">
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
          </span>
        </span>
      </Link>
    </span>
  );
});
