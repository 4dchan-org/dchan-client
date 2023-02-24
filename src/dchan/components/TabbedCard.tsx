import React, { useCallback, useEffect, useState } from "react";

export const TabbedCard = ({
  children,
  className = "",
  sectionClassName = "",
  containerClassName = "",
  firstTab = "",
  tabInterval = 10_000
}: {
  children: Map<string, any>;
  className?: string;
  sectionClassName?: string;
  containerClassName?: string;
  firstTab?: string;
  tabInterval?: number;
}) => {
  const keys = Array.from(children.keys());
  const [currentChild, setCurrentChild] = useState<string>(firstTab || keys[0]);
  let displayChild = currentChild;
  if (!children.has(currentChild)) {
    displayChild = keys[0];
  }

  const [isHovering, setIsHovering] = useState(false);

  const onMouseOver = useCallback(() => {
    setIsHovering(true);
  }, [setIsHovering]);

  const onMouseOut = useCallback(() => {
    setIsHovering(false);
  }, [setIsHovering]);

  useEffect(() => {
    const interval = setInterval(() => {
      !isHovering &&
        setCurrentChild(
          keys[(keys.findIndex((k) => k === currentChild) + 1) % keys.length]
        );
    }, tabInterval);
    return () => clearInterval(interval);
  }, [tabInterval, currentChild, setCurrentChild, isHovering, keys]);

  return (
    <article
      className={`${className}`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <header
        className="bg-white border border-black flex flex-row justify-evenly"
        style={{ flex: "0 1 auto" }}
      >
        {Array.from(children.keys()).map((key, index) => (
          <React.Fragment key={key}>
            <button
              className={[
                "bg-highlight py-1 px-4 w-full font-bold",
                key === displayChild
                  ? "opacity-100"
                  : "opacity-80 hover:opacity-100",
              ].join(" ")}
              onClick={() => {
                setCurrentChild(key);
              }}
            >
              {key}
            </button>
            {index < children.size - 1 ? (
              <div className="border-l border-black" />
            ) : null}
          </React.Fragment>
        ))}
      </header>
      <section
        className={`animation-fade-in bg-white border border-black flex flex-col border-t-0 ${sectionClassName}`}
        style={{ flex: "1 1 auto" }}
      >
        <div className={containerClassName}>
          {Array.from(children.entries()).map(([key, value]) => (
            <div
              key={key}
              className={["", key !== displayChild ? "hidden" : ""].join(" ")}
              style={{ flex: "0 0 auto" }}
            >
              {value}
            </div>
          ))}
        </div>
      </section>
      <div />
    </article>
  );
};
