import "assets/styles/index.scss";

import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useMemo } from "react";
import { SingletonHooksContainer } from "react-singleton-hook";
import {
  ApolloProvider,
} from "@apollo/react-hooks";

import {
  AdminPage,
  BoardPage,
  BoardListPage,
  HomePage,
  IdReferencePage,
  PostsPage,
  ReferencePage,
  ThreadPage,
} from "dchan/pages";
import { LockBanner, EULA, FAQCardOverlay, RulesCardOverlay, AbuseCardOverlay } from "dchan/components";
import DefaultSettings from "dchan/settings";
import { Settings, writeAppSetSettings } from "dchan/hooks/useSettings";
import subgraphClient from "dchan/subgraph/client";

// So there's an issue with how settings works
//
// It's loaded via a singletonHook, which is just a wrapper
// around a hook for reading/writing to local storage
//
// In order to allow singleton hooks access to the client
// (e.g. so useLastBlock can access it), we need to put
// <SingletonHooksContainer/> inside <ApolloProvider/> in
// the App component
//
// The issue is that because settings can now force App
// to reload the apollo client, it now depends on Settings,
// which is loaded by a singleton hook, but App also
// loads <SingletonHooksContainer/>, which causes an
// infinite loop to occur and crashes the page
//
// To fix this, we need to break that loop by having the
// settings in the App component be separate from the one
// in the hook, and to do this we load the settings beforehand
// directly, then have the hook overwrite App's settings value
// whenever changes are made
//
// It's an awful hack, but it works
function useLocalSettings() {
  return useState<Settings>(() => {
    try {
      const item = window.localStorage.getItem("dchan.config");
      return item
        ? { ...DefaultSettings, ...JSON.parse(item) }
        : DefaultSettings;
    } catch (error) {
      console.error({ error });
      return DefaultSettings;
    }
  });
}

function App() {
  const [settings, setSettings] = useLocalSettings();
  writeAppSetSettings(setSettings);

  const [pageTheme, setPageTheme] = useState<string>("blueboard");

  const client = useMemo(() => subgraphClient, []);

  return settings?.eula?.agreed === false ? (
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
