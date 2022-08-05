import { ComponentType } from "react";

interface ContainerProps {
  onExit?: () => void;
  overlayClassName?: string;
}

export default function OverlayComponent<P>(WrappedComponent: ComponentType<P>) {
  return <Q extends P & ContainerProps>(props: Q) => {
    let {onExit, overlayClassName} = props;
    return (
      <div
        className="flex fixed top-0 bottom-0 left-0 right-0 overflow-scroll bg-black bg-opacity-50 cursor-default pb-8"
        style={{zIndex: 9000}}
        onClick={onExit}
      >
        <div className={`${overlayClassName} m-auto`} onClick={(e) => e.stopPropagation()}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
}