import "assets/styles/index.scss";

import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useMemo } from "react";
import { SingletonHooksContainer } from "react-singleton-hook";
import {
  ApolloProvider,
} from "@apollo/react-hooks";

import {
  AdminPage,
  ArchivePage,
  BoardPage,
  BoardListPage,
  HomePage,
  IdReferencePage,
  PostsPage,
  ReferencePage,
  ThreadPage,
} from "dchan/pages";
import { LockBanner, EULA, FAQCardOverlay, RulesCardOverlay, AbuseCardOverlay } from "dchan/components";
import { useEula } from "dchan/hooks";
import subgraphClient from "dchan/subgraph/client";

function App() {
  const [eula] = useEula()

  const [pageTheme, setPageTheme] = useState<string>("blueboard");

  const client = useMemo(() => subgraphClient, []);

  return eula === false ? (
    <EULA />
  ) : (
    <ApolloProvider client={client}>
      <Router basename="/">
        <SingletonHooksContainer />
        <LockBanner />
        <div className="App text-center">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/_/boards" component={BoardListPage} />
            <Route path="/_/admin" component={AdminPage} />
            <Route path="/_/posts" component={PostsPage} />
            <Route path="/0x:id/:post_n" component={ReferencePage} />
            <Route path="/0x:id" component={IdReferencePage} />
            <Route
              path="/:board_name/0x:board_id/archive"
              render={(props) => (
                <ArchivePage
                  location={props.location}
                  match={props.match}
                  pageTheme={pageTheme}
                  setPageTheme={setPageTheme}
                />
              )}
            />
            <Route
              path="/:board_name/0x:board_id/:view_mode(index|catalog)"
              render={(props) => (
                <BoardPage
                  location={props.location}
                  match={props.match}
                  pageTheme={pageTheme}
                  setPageTheme={setPageTheme}
                />
              )}
            />
            <Route
              path="/:board_name/0x:board_id/0x:user_id/:thread_n/0x:focus_user_id/:focus_post_n"
              render={(props) => (
                <ThreadPage
                  location={props.location}
                  match={props.match}
                  pageTheme={pageTheme}
                  setPageTheme={setPageTheme}
                />
              )}
            />
            <Route
              path="/:board_name/0x:board_id/0x:user_id/:thread_n/0x:focus_user_id"
              render={(props) => (
                <ThreadPage
                  location={props.location}
                  match={props.match}
                  pageTheme={pageTheme}
                  setPageTheme={setPageTheme}
                />
              )}
            />
            <Route
              path="/:board_name/0x:board_id/0x:user_id/:thread_n/:focus_post_n"
              render={(props) => (
                <ThreadPage
                  location={props.location}
                  match={props.match}
                  pageTheme={pageTheme}
                  setPageTheme={setPageTheme}
                />
              )}
            />
            <Route
              path="/:board_name/0x:board_id/0x:user_id/:thread_n/:post_n"
              render={(props) => (
                <ThreadPage
                  location={props.location}
                  match={props.match}
                  pageTheme={pageTheme}
                  setPageTheme={setPageTheme}
                />
              )}
            />
            <Route
              path="/:board_name/0x:board_id/0x:user_id/:thread_n"
              render={(props) => (
                <ThreadPage
                  location={props.location}
                  match={props.match}
                  pageTheme={pageTheme}
                  setPageTheme={setPageTheme}
                />
              )}
            />
            <Route
              path="/:board_name/0x:board_id" 
              render={(props) => (
                <BoardPage
                  location={props.location}
                  match={props.match}
                  pageTheme={pageTheme}
                  setPageTheme={setPageTheme}
                />
              )}
            />
            <Route exact path="/:board_name" component={BoardListPage} />
          </Switch>
          <FAQCardOverlay />
          <RulesCardOverlay />
          <AbuseCardOverlay />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
