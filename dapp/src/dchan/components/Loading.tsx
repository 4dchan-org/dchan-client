import { Spinner } from ".";

export const Loading = ({
  className = ""
}: {
  className?: string
}) => {  
    return (
      <div className={`${className} dchan-loading grid center`}>
          <Spinner speed={"sanic"}></Spinner>
          <div>
            Loading...
          </div>
      </div>
    )
  }