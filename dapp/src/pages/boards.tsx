import Footer from 'components/footer'
import BoardList from 'components/board/list'
import GenericHeader from 'components/header/generic'
import React from 'react'

class BoardListPage extends React.Component {
    render() {
        return (
            <div>
                <GenericHeader title="Boards"></GenericHeader>

                <BoardList></BoardList>

                <Footer></Footer>
            </div>
        );
    }
}

export default BoardListPage