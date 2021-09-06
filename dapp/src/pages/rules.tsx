import Card from "components/Card";
import SimpleFooter from "components/SimpleFooter";
import { useTitle } from "react-use";

export default function RulesPage() {
  useTitle(`Rules - dchan.network`);

  return (
    <div className="center grid w-full min-h-screen bg-primary">
      <div className="grid bg-primary">
        <Card title={<span>The rules</span>}>
          <div className="p-8">
            <ul className="list-disc text-wrap text-left">
              <li>
                Do not post anything that can get you in trouble with local or
                global jurisdictions.
              </li>
              <li>Be decent.</li>
            </ul>
          </div>
        </Card>

        <SimpleFooter />
      </div>
    </div>
  );
}
