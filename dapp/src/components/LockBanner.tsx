import { useQuery } from "@apollo/react-hooks";
import CHAN_STATUS from "dchan/graphql/queries/chan_status";
import poopieSrc from "assets/images/poopie.png";
import Config from "config";
import Card from "./Card";
interface ChanStatusData {
  chanStatus: {
    isLocked: boolean;
  };
}

interface ChanStatusVars {
  id: string;
}

export default function LockBanner() {
  const { loading, data } = useQuery<ChanStatusData, ChanStatusVars>(
    CHAN_STATUS,
    {
      variables: {
        id: Config.contract.address,
      },
    }
  );

  return data?.chanStatus?.isLocked ? (
    <div className="bg-primary relative" style={{ height: "100000vh" }}>
      <div className="center grid">
        <Card
          title={<div className="text-red-500 text-4xl">UH OH</div>}
          body={
            <div className="center grid">
              <img src={poopieSrc} />
              <div className="p-4">
                <div className="text-md">
                  Someone made a stinky and dchan got locked.
                </div>
                <div className="text-sm">Hopefully it wasn't you.</div>
              </div>
            </div>
          }
        />
      </div>
      <div className="absolute bottom-0 w-screen text-center">Congratulations, you won the prize. Don't interact with the website, your actions will be disregarded while dchan is locked.</div>
    </div>
  ) : (
    <span></span>
  );
}
