import Footer from 'components/Footer'
import BoardList from 'components/board/list'
import GenericHeader from 'components/header/generic'
import React from 'react'

class RulesPage extends React.Component {
    render() {
        return (
            <div>
                <GenericHeader title="The rules"></GenericHeader>
                
                <pre>
* Do not post shit that can get you in trouble
<br></br>
* Be decent
                </pre>

                <Footer></Footer>
            </div>
        );
    }
}

export default RulesPage