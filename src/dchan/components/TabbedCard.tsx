import React, { useState } from "react";


export const TabbedCard = ({
  children,
  className = "",
  sectionClassName = "",
  containerClassName = "",
}: {
  children: Map<string, any>;
  className?: string;
  sectionClassName?: string
  containerClassName?: string;
}) => {
  const [currentChild, setCurrentChild] = useState<string>(children.keys().next().value);
  let displayChild = currentChild;
  if (!children.has(currentChild)) {
    displayChild = children.keys().next().value;
  }
  return (
    <article className={`${className}`}>
      <header className="bg-white border border-black flex flex-row justify-evenly border-t-0" style={{flex: "0 1 auto"}}>
        {Array.from(children.keys()).map((key, index) => (
          <React.Fragment key={key}>
            <button
              className={[
                "bg-highlight py-1 px-4 w-full font-bold",
                key === displayChild ? "opacity-100" : "opacity-60 hover:opacity-100"
              ].join(" ")}
              onClick={() => {
                setCurrentChild(key);
              }}
            >
              {key}
            </button>
            {index < children.size-1 ? <div className="border-l border-black"/> : null}
          </React.Fragment>
        ))}
      </header>
      <section className={`bg-white border border-black flex flex-col border-t-0 ${sectionClassName}`} style={{flex: "1 1 auto"}}>
        <div className={containerClassName}>
          {Array.from(children.entries()).map(([key, value]) => (
            <div
              key={key}
              className={[
                "",
                key !== displayChild ? "hidden" : ""
              ].join(" ")}
              style={{flex: "0 0 auto"}}
            >
              {value}
            </div>
          ))}
        </div>
      </section>
      <div/>
    </article>
  );
}