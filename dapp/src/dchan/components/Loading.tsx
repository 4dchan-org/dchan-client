import { Spinner } from ".";

export const Loading = ({
  className = ""
}: {
  className?: string
}) => {  
    return (
      <div className={`${className} dchan-loading flex center p-2`}>
          <div className="opacity-80 pr-1"><Spinner size={8} speed={"sanic"} /></div>
          <div className="">
            Loading...
          </div>
      </div>
    )
  }