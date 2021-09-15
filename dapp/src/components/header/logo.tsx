import Spinner from "components/Spinner";
import { Link } from "react-router-dom";

const HeaderLogo = () => (
  <div >
    <span className="h-14 font-mono center grid grid-cols-2 relative">
      <span className="text-right mr-8">dchan</span>
      <span className="absolute left-0 right-0 bottom-0 top-0 m-auto h-14"><Spinner size={14}></Spinner></span>
      <span className="text-left ml-8">network</span>
    </span>
  </div>
);

export default HeaderLogo;
