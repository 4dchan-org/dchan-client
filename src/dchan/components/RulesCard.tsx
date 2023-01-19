import { Card, Overlay } from "dchan/components";
import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

export const RulesCard = () => {
  return (
    <Card
      title={<span>The rules</span>}
      className="flex flex-col flex-grow flex-shrink-0"
      bodyClassName="flex"
      collapsible={false}
    >
      <div className="p-8">
        <ul className="list-disc text-wrap text-left m-auto">
          <li>
            Do not post anything that can get you in trouble with local or
            global jurisdictions.
          </li>
          <li>Be decent.</li>
        </ul>
      </div>
    </Card>
  );
};

export const useRules = singletonHook<[boolean, (open: boolean) => void]>(
  [false, () => {}],
  () => {
    return useState<boolean>(false);
  }
);

export const RulesCardOverlay = () => {
  const [openRules, setOpenRules] = useRules();
  return openRules ? (
    <Overlay onExit={() => setOpenRules(false)}>
      <RulesCard />
    </Overlay>
  ) : null;
};

export const RulesButton = ({ className = "" }: { className?: string }) => {
  const [, setOpenRules] = useRules();
  return (
    <>
      <span
        className={`${className} cursor-pointer dchan-link`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenRules(true);
        }}
      >
        Rules
      </span>
    </>
  );
};
