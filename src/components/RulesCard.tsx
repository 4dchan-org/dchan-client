import { Card } from "src/components";
import { useModal } from "src/hooks";

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

export const RulesButton = ({ className = "" }: { className?: string }) => {
  const [, setOpen] = useModal();
  return (
    <>
      <span
        className={`${className} cursor-pointer dchan-link`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen("rules");
        }}
      >
        Rules
      </span>
    </>
  );
};
