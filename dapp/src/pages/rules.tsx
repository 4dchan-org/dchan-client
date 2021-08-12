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
<br></br>
* Everything you post is forever. You can remove posts, but YOU CAN NOT DELETE THEM. They will still be retrievable from the blockchain.
                </pre>

                <Footer></Footer>
            </div>
        );
    }
}

export default RulesPage