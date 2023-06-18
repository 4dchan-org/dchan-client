import { useLocation } from "react-router";
import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

export const ScrollToHashElement = () => {
  const location = useLocation();

  const hashElement = useMemo(() => {
    const hash = location.hash;
    const removeHashCharacter = (str: string) => {
      const result = str.slice(1);
      return result;
    };

    if (hash) {
      const element = document.getElementById(removeHashCharacter(hash));
      return element;
    } else {
      return null;
    }
  }, [location]);

  useEffect(() => {
    if (hashElement) {
      hashElement.scrollIntoView({
        behavior: "smooth",
        // block: "end",
        inline: "nearest",
      });
    }
  }, [hashElement]);

  return null;
};

export const Anchor = ({
  label,
  to,
  onClick
}: {
  label: string
  to: string,
  onClick?: any
}) => {
  const search = useLocation().search;
  
  return (
    <div>
      [
      <Link
        className="dchan-link"
        to={`${search}${to}`}
        onClick={onClick}
      >
        {label}
      </Link>
      ]
    </div>
  );
}
