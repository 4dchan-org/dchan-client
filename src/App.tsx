import {
  HashRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { SingletonHooksContainer } from "react-singleton-hook";

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
} from "src/pages";
import {
  LockBanner,
  EULA,
  ModalOverlay,
  ScrollToHashElement,
} from "src/components";
import { useEula, useTimeTravel } from "src/hooks";
import { AppContext } from "./contexts/AppContext";
import TimeTravelEffect from "./components/TimeTravelEffect";

function App() {
  const [eula] = useEula();
  const { isTimeTraveling } = useTimeTravel();
  console.log("isTimeTraveling", isTimeTraveling);

  const IdRefRouter = () => {
    const { id } = useParams();
    return id?.indexOf("0x") === 0 ? <IdReferencePage /> : <BoardListPage />;
  };

  const RefRouter = () => {
    const { board_name } = useParams();
    return board_name?.indexOf("0x") === 0 ? <ReferencePage /> : <BoardPage />;
  };

  return eula === false ? (
    <EULA />
  ) : (
    <Router basename="/">
      <AppContext>
        <TimeTravelEffect>
          <ScrollToHashElement />
          <SingletonHooksContainer />
          <LockBanner />
          <div className="App text-center">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="_/boards" element={<BoardListPage />} />
              <Route path="_/admin" element={<AdminPage />} />
              <Route path="_/posts" element={<PostsPage />} />
              <Route path=":id" element={<IdRefRouter />} />
              <Route path=":board_name/:board_id" element={<RefRouter />} />
              <Route
                path=":board_name/:board_id/archive"
                element={<ArchivePage />}
              />
              <Route
                path=":board_name/:board_id/:view_mode"
                element={<BoardPage />}
              />
              <Route
                path=":board_name/:board_id/:user_id/:thread_n/:focus_user_id/:focus_post_n"
                element={<ThreadPage />}
              />
              <Route
                path=":board_name/:board_id/:user_id/:thread_n/:focus_user_id"
                element={<ThreadPage />}
              />
              <Route
                path=":board_name/:board_id/:user_id/:thread_n/:focus_post_n"
                element={<ThreadPage />}
              />
              <Route
                path=":board_name/:board_id/:user_id/:thread_n/:post_n"
                element={<ThreadPage />}
              />
              <Route
                path=":board_name/:board_id/:user_id/:thread_n"
                element={<ThreadPage />}
              />
            </Routes>
            <ModalOverlay />
          </div>
          </TimeTravelEffect>
      </AppContext>
    </Router>
  );
}

export default App;
