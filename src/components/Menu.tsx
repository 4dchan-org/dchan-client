export const Menu = ({ children }: any) => {
  const els = children ? children.map ? children : [children] : []

  return (
    <details className="dchan-menu z-10 text-sm inline text-left opacity-40 hover:opacity-100 select-none h-16px sm:relative">
      <summary className="pl-1"></summary>
      <div className="dchan-menu-content bg-secondary border border-solid border-tertiary-accent p-1 z-50 pr-4 absolute w-screen sm:w-auto left-0">
        {els.map((child: any) => child)}
      </div>
    </details>
  );
}
