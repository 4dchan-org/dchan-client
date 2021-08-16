import Footer from "components/Footer";
import React from "react";
import Card from "components/Card";
import GenericHeader from "components/header/generic";
import { Link } from "react-router-dom";

class RulesPage extends React.Component {
  render() {
    return (
      <div className="bg-primary min-h-100vh">
        <GenericHeader title="Rules"></GenericHeader>

        <div className="center grid">
          <Card
            title={<span>The rules</span>}
            body={
              <div className="p-8">
                <ul className="list-disc text-wrap">
                  <li>Do not post anything that can get you in trouble with local or global jurisdictions. You alone assume full responsibility for the content you post and upload.</li>
                  <li>Be decent.</li>
                </ul>
              </div>
            }
          />
        </div>

        <Link
          className="m-4 text-blue-600 visited:text-purple-600 hover:text-blue-500"
          to="/"
        >
          Home
        </Link>

        <Footer></Footer>
      </div>
    );
  }
}

export default RulesPage;
