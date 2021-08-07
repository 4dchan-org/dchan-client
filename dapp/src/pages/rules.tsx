import Footer from 'components/Footer'
import BoardList from 'components/board/list'
import GenericHeader from 'components/header/generic'
import React from 'react'

class RulesPage extends React.Component {
    render() {
        return (
            <div>
                <GenericHeader title="The rules"></GenericHeader>
                
                <div>
                    <ul>
                        <li>Everything you post is forever</li>
                    </ul>
                </div>

                <Footer></Footer>
            </div>
        );
    }
}

export default RulesPage