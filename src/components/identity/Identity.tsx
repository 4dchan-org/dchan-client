import { useState } from "react";
import IdentityGenerator from "./IdentityGenerator";
import { Wallet } from "..";

export const Identity = () => {
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleCheckboxChange = (e: any) => {
    setIsAnonymous(e.target.checked);
  };

  return (
    <div className="mx-2">
      <div className="flex items-center flex-wrap">
        <span>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={handleCheckboxChange}
            id="dchan-input-anonymous"
          />
          <label className="px-2" htmlFor="dchan-input-anonymous">
            Anonymous
          </label>
        </span>

        {isAnonymous ? <IdentityGenerator /> : <Wallet />}
      </div>
    </div>
  );
};
