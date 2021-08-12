import Footer from "components/Footer";
import React from "react";
import Card from "components/Card";
import GenericHeader from "components/header/generic";
import { Link } from "react-router-dom";

class RulesPage extends React.Component {
  render() {
    return (
      <div>
        <GenericHeader title="Rules"></GenericHeader>

        <div className="center grid">
          <Card
            title={<span>The rules</span>}
            body={
              <span className="p-8">
                <pre>
                  * Do not post shit that can get you in trouble
                  <br></br>* Be decent
                </pre>
              </span>
            }
          />
        </div>
        
        <Link className="m-4 text-blue-600 visited:text-purple-600 hover:text-blue-500" to="/">Home</Link>

        <Footer></Footer>
      </div>
    );
  }
}

export default RulesPage;
