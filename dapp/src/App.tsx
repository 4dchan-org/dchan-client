import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import 'assets/styles/index.scss';
import HomePage from 'pages/home'
import AbusePage from 'pages/abuse'
import RulesPage from 'pages/rules'
import BoardCatalogPage from 'pages/catalog'
import BoardListPage from "pages/boards"
import BoardSearchPage from "pages/boardSearch"
import ThreadPage from "pages/thread";
import ReferencePage from "pages/reference";
import AdminPage from "pages/admin";
import LockBanner from "components/LockBanner";

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
          <Route path="/0x:id" component={ReferencePage} />
          <Route path="/:boardName/0x:boardId/:threadN/:postN" component={ThreadPage} />
          <Route path="/:boardName/0x:boardId/:threadN" component={ThreadPage} />
          <Route path="/:boardName/0x:boardId" component={BoardCatalogPage} />
          <Route path="/:boardName" component={BoardSearchPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
