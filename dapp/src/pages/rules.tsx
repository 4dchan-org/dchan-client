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

        <div className="center grid min-h-75vh">
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
        
        <Link to="/">Home</Link>

        <Footer></Footer>
      </div>
    );
  }
}

export default RulesPage;
