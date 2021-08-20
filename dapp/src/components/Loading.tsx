import Spinner from "./Spinner";

export default function Loading({
  className = ""
}: {
  className?: string
}) {  
    return (
      <div className={`${className} grid center`}>
          <Spinner speed={"sanic"}></Spinner>
          <div>
            Loading...
          </div>
      </div>
    )
  }