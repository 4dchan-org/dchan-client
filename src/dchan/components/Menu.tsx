export const Menu = ({ children }: any) => {
  const els = children ? children.map ? children : [children] : []

  return (
    <details className="dchan-menu z-20 text-sm inline text-left opacity-40 hover:opacity-100 select-none h-16px">
      <summary className="pl-1 relative"></summary>
      <div className="dchan-menu-content bg-secondary border border-solid border-black p-1 absolute z-50 pr-4">
        {els.map((child: any) => child)}
      </div>
    </details>
  );
}
