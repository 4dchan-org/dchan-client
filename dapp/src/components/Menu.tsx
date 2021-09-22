export default function Menu({ children }: any) {
  return (
    <details className="z-20 text-sm inline text-left opacity-10 hover:opacity-100">
      <summary className="top-0 px-1 h-4 relative"></summary>
      <div className="bg-secondary border border-solid border-black p-1 w-24 absolute z-50">
        {children}
      </div>
    </details>
  );
}
