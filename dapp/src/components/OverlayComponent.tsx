import { ComponentType } from "react";


export default function OverlayComponent<P extends object>(WrappedComponent: ComponentType<P>) {
  return (props: any) => {
    let {onExit, ...remProps} = props;
    return (
      <div className="flex fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 cursor-default" onClick={onExit}>
        <div className="w-full sm:w-4/6 h-5/6 m-auto" onClick={(e) => e.stopPropagation()}>
          <WrappedComponent onExit={onExit} {...remProps} />
        </div>
      </div>
    );
  };
}