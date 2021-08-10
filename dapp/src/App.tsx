import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './assets/styles/index.scss';
import HomePage from './pages/home'
import RulesPage from './pages/rules'
import BoardCatalogPage from './pages/catalog'
import BoardListPage from "./pages/boards"
import ThreadPage from "./pages/thread";
import FAQPage from "pages/faq";

function App() {
  return (
    <Router>
      <div className="App text-center">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/boards" component={BoardListPage} />
          <Route path="/rules" component={RulesPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/thread/:threadId" component={ThreadPage} />
          <Route path="/0x:boardId" component={BoardCatalogPage} />
          <Route path="/:boardName" component={BoardListPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
