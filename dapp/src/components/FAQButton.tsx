import { useState } from "react";
import FAQCard from "./FAQCard";
import OverlayComponent from "./OverlayComponent";

const FAQCardOverlay = OverlayComponent(FAQCard);

export default function FAQButton({className = ""}: {className?: string}) {
  const [openFAQ, setOpenFAQ] = useState<boolean>(false);
  return (
    <>
      <span
        className={`${className} cursor-pointer text-blue-600 visited:text-purple-600 hover:text-blue-500`}
        onClick={() => setOpenFAQ(true)}
      >
        FAQ
      </span>
      {openFAQ
        ? <FAQCardOverlay
          onExit={() => setOpenFAQ(false)}
          className="h-full flex flex-col flex-grow flex-shrink-0"
        />
        : null}
    </>
  );
}