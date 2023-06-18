import { useQuery } from "@apollo/react-hooks";
import { CHAN_STATUS } from "src/subgraph/graphql/queries";
import { useLocalSettings } from "src/hooks";
import { Card, Emoji } from "src/components";

interface ChanStatusData {
  chanStatus: {
    isLocked: boolean;
  };
}

interface ChanStatusVars {
  id: string;
}

export const LockBanner = () => {
  const [settings] = useLocalSettings();
  const { data } = useQuery<ChanStatusData, ChanStatusVars>(CHAN_STATUS, {
    variables: {
      id: settings?.contract?.address || "",
    },
    skip: !settings?.contract?.address,
  });

  return data?.chanStatus?.isLocked ? (
    <>
      <div className="bg-primary relative p-8" style={{ height: "100000vh" }}>
        <div className="center grid">
          <Card title={<div className="text-red-600 text-4xl">UH OH</div>} className="pt-4">
            <div className="text-center grid">
              <Emoji emoji="💩" />
              <div className="p-4">
                <div className="text-md">
                  Someone made a stinky and everything got locked.
                </div>
                <div className="text-sm">Hopefully it wasn't you.</div>
                <div className="text-md">Please wait while things go back to normal.</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  ) : (
    <span></span>
  );
}
