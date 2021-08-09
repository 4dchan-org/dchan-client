export default function Menu({ children }: any) {
  return (
    <details className="inline text-right">
      <summary className="top-0 right-0 px-2 h-4 absolute sm:relative"></summary>
      <div className="bg-secondary border border-solid border-black p-1 top-6 right-0 absolute">
        {children.map((child: any) => child)}
      </div>
    </details>
  );
}
