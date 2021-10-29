import { ComponentType } from "react";

interface WithOnExit {
  onExit?: () => void;
}

export default function OverlayComponent<P extends WithOnExit>(WrappedComponent: ComponentType<P>) {
  return (props: P) => {
    let {onExit} = props;
    return (
      <div
        className="flex fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 cursor-default"
        style={{zIndex: 9000}}
        onClick={onExit}
      >
        <div className="w-full sm:w-4/6 h-5/6 m-auto" onClick={(e) => e.stopPropagation()}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
}