import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import 'assets/styles/index.scss';

import AbusePage from 'pages/abuse'
import AdminPage from "pages/admin";
import BoardListPage from "pages/boards"
import BoardPage from "pages/board"
import HomePage from 'pages/home'
import LockBanner from "components/LockBanner";
import PostSearchPage from "pages/postSearch"
import ReferencePage from "pages/reference";
import RulesPage from 'pages/rules'
import ThreadPage from "pages/thread"

function App() {
  return (
    <Router basename="/">
      <LockBanner />
      <div className="App text-center">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/_/boards" component={BoardListPage} />
          <Route path="/_/rules" component={RulesPage} />
          <Route path="/_/abuse" component={AbusePage} />
          <Route path="/_/admin" component={AdminPage} />
          <Route path="/_/posts" component={PostSearchPage} />
          <Route path="/0x:id" component={ReferencePage} />
          <Route path="/:board_name/0x:board_id/:view_mode(catalog)" component={BoardPage} />
          <Route path="/:board_name/0x:board_id/:thread_n/:post_n" component={ThreadPage} />
          <Route path="/:board_name/0x:board_id/:thread_n" component={ThreadPage} />
          <Route path="/:board_name/0x:board_id" component={BoardPage} />
          <Route exact path="/:board_name" component={BoardListPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
