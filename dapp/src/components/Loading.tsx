import Spinner from "./Spinner";

export default function Loading() {  
    return (
      <div className="grid center">
          <Spinner speed={"sanic"}></Spinner>
          <div>
            Loading...
          </div>
      </div>
    )
  }