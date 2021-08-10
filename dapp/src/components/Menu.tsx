export default function Menu({ children }: any) {
  return (
    <details className="text-sm inline text-left">
      <summary className="top-0 px-2 h-4 absolute sm:relative"></summary>
      <div className="bg-secondary border border-solid border-black p-1 w-24 absolute">
        {children.map((child: any) => child)}
      </div>
    </details>
  );
}
