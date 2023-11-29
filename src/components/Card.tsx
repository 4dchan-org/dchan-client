import { ReactElement } from "react";

export const Card = ({
  className = "grid",
  bodyClassName = "",
  title,
  titleRight,
  children,
  open = true,
  collapsible = true,
}: {
  className?: string;
  bodyClassName?: string;
  children: ReactElement | ReactElement[];
  title: ReactElement | string;
  titleRight?: ReactElement;
  open?: boolean;
  collapsible?: boolean;
}) => {
  return (
    collapsible ? <>
      <article className={`${className} max-w-100vw`}>
        <details open={open}>
          <summary className="bg-secondary border border-tertiary-accent sticky top-0 z-20 text-left px-2">
            <header className="z-50 inline">
              <span className="center font-family-tahoma">{title}</span>
              {titleRight}
            </header>
          </summary>
          <section
            className={`${bodyClassName} bg-white border border-tertiary-accent border-t-0 w-full overflow-auto`}
            style={{ flex: "1 1 auto" }}
          >
            {children}
          </section>
        </details>
      </article>
    </> : <>
      <div className={`${className} max-w-100vw`}>
        <header className="bg-secondary border border-solid border-tertiary-accent z-50">
          <span className="center font-family-tahoma">{title}</span>
          {titleRight}
        </header>
        <section
          className={`${bodyClassName} bg-white border border-tertiary-accent border-t-0 w-full p-1 overflow-auto`}
          style={{ flex: "1 1 auto" }}
        >
          {children}
        </section>
      </div>
    </>
  );
}
