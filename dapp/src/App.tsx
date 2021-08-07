import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './assets/styles/index.scss';
import HomePage from './pages/home'
import RulesPage from './pages/rules'
import FAQ from './pages/faq'
import BoardCatalogPage from './pages/catalog'
import BoardListPage from "./pages/boards"
import ThreadPage from "./pages/thread";

function App() {
  return (
    <Router>
      <div className="App text-center">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/boards" component={BoardListPage} />
          <Route path="/rules" component={RulesPage} />
          <Route path="/faq" component={FAQ} />
          <Route path="/thread/:threadId" component={ThreadPage} />
          <Route path="/:boardId" component={BoardCatalogPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
