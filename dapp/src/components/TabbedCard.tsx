import React, { useState } from "react";


export default function TabbedCard({
  children,
  className = "",
}: {
  children: Map<string, any>;
  className?: string;
}) {
  const [currentChild, setCurrentChild] = useState<string>(children.keys().next().value);
  let displayChild = currentChild;
  if (!children.has(currentChild)) {
    displayChild = children.keys().next().value;
  }
  return (
    <article className={`max-h-full ${className}`}>
      <header className="bg-white border border-black flex flex-row justify-evenly" style={{flex: "0 1 auto"}}>
        {Array.from(children.keys()).map((key, index) => (
          <React.Fragment key={key}>
            <div
              className={[
                "bg-highlight py-1 px-4 w-full font-bold",
                key === displayChild ? "opacity-100" : "opacity-80 hover:opacity-100"
              ].join(" ")}
              onClick={() => {
                setCurrentChild(key);
              }}
            >
              {key}
            </div>
            {index < children.size-1 ? <div className="border-l border-black"/> : null}
          </React.Fragment>
        ))}
      </header>
      <section className={`bg-white max-w-full border border-black border-t-0 p-4 overflow-y-auto`} style={{flex: "1 1 auto"}}>
        {Array.from(children.entries()).map(([key, value]) => (
          <div
            key={key}
            className={[
              "h-min",
              key !== displayChild ? "hidden" : ""
            ].join(" ")}
          >
            {value}
          </div>
        ))}
      </section>
    </article>
  );
}