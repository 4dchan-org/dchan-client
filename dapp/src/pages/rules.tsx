import Card from "components/Card";
import SimpleFooter from "components/SimpleFooter";

export default function RulesPage() {
  return (
    <div className="center grid w-full min-h-screen bg-primary">
      <div className="grid bg-primary">
        <Card
          title={<span>The rules</span>}
          body={
            <div className="p-8">
              <ul className="list-disc text-wrap">
                <li>
                  Do not post anything that can get you in trouble with local or
                  global jurisdictions. You alone assume full responsibility for
                  the content you post and upload.
                </li>
                <li>Be decent.</li>
              </ul>
            </div>
          }
        />

        <SimpleFooter />
      </div>
    </div>
  );
}
