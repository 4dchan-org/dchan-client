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
import SettingsPage from "pages/settings";
import LockBanner from "components/LockBanner";

function App() {
  return (
    <Router basename="/">
      <LockBanner />
      <div className="App text-center">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/boards" component={BoardListPage} />
          <Route path="/rules" component={RulesPage} />
          <Route path="/abuse" component={AbusePage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/0x:ref" component={ReferencePage} />
          <Route path="/:boardName/0x:boardId/0x:threadId" component={ThreadPage} />
          <Route path="/:boardName/0x:boardId" component={BoardCatalogPage} />
          <Route path="/:boardName" component={BoardSearchPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
