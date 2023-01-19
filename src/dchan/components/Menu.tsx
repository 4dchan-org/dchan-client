export const Menu = ({ children }: any) => {
  const els = children ? children.map ? children : [children] : []

  return (
    <details className="dchan-menu z-20 text-sm inline text-left opacity-40 hover:opacity-100">
      <summary className="pl-1 relative"></summary>
      <div className="bg-secondary border border-solid border-black p-1 w-32 absolute z-50 pl-3">
        {els.map((child: any) => child)}
      </div>
    </details>
  );
}
