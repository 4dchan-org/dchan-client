import { ReactElement } from "react";

export default function Card({
  className = "grid",
  bodyClassName = "",
  title,
  titleRight,
  children,
  open = true,
}: {
  className?: string;
  bodyClassName?: string;
  children: ReactElement | ReactElement[];
  title: ReactElement | string;
  titleRight?: ReactElement;
  open?: boolean;
}) {
  return (
    <article className={`${className} max-w-100vw`}>
      <details open={open}>
        <summary className="bg-primary border border-black border-b-0 sticky top-0 z-20 text-center">
          <header className="bg-highlight py-1 bg-white border border-l-0 border-r-0 border-solid border-black p-2 z-50">
            <span className="text-xl center font-semibold">{title}</span>
            {titleRight}
          </header>
        </summary>
        <section
          className={`${bodyClassName} bg-white border border-black border-t-0 w-full p-1`}
          style={{ flex: "1 1 auto" }}
        >
          {children}
        </section>
      </details>
    </article>
  );
}
