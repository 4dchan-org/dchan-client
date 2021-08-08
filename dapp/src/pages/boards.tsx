import Footer from 'components/Footer'
import BoardList from 'components/board/list'
import GenericHeader from 'components/header/generic'
import React from 'react'

class BoardListPage extends React.Component {
    render() {
        return (
            <div>
                <GenericHeader title="Boards"></GenericHeader>

                <BoardList create={true}></BoardList>

                <Footer></Footer>
            </div>
        );
    }
}

export default BoardListPage