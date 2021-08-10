import Spinner from "components/Spinner";
import { Link } from "react-router-dom";

const HeaderLogo = () => (
  <Link to="/">
    <div className="h-24 font-mono center flex">
      <span className="text-right">dchan</span>
      <span><Spinner size={16}></Spinner></span>
      <span className="text-left">network</span>
    </div>
  </Link>
);

export default HeaderLogo;
