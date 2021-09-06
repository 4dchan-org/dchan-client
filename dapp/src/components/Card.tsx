import { ReactElement } from "react";

export default function Card({
  className = "",
  title,
  children,
}: {
  className?: string;
  children: ReactElement;
  title: ReactElement;
}) {
  return (
    <div className={`${className} grid max-w-2xl`}>
      <article className="grid md-grid mt-4">
        <header className="bg-highlight w-full py-1 bg-white border border-black">
          <div className="text-xl text-center font-semibold">{title}</div>
        </header>
        <section className="bg-white border border-black border-t-0 w-full p-4">
          {children}
        </section>
      </article>
    </div>
  );
}
