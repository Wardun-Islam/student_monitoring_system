import "./App.css";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import StudentList from "./Components/StudentList";
import EditProfile from "./Components/EditProfile";
import ClassPage from "./Components/ClassPage";
import PostAssignment from "./Components/PostAssignment";
import AssignmentPage from "./Components/AssignmentPage";
import StudentImagePage from "./Components/StudentImagePage";
import { PrivateRoute } from "./Components/PrivateRoute";
import { UserProtectedRoute } from "./Components/UserProtectedRoute";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { SocketContext, socket } from "./service/socket";

function App() {
  return (
    <Router>
      <SocketContext.Provider value={socket}>
        <Switch>
          <PrivateRoute path="/home" exact={true} component={Home} />
          <PrivateRoute path="/profile" exact={true} component={Profile} />
          <PrivateRoute
            path="/editprofile"
            exact={true}
            component={EditProfile}
          />
          <PrivateRoute
            path="/class:class_id"
            exact={true}
            component={ClassPage}
          />
          <PrivateRoute
            path="/postassignment:class_id"
            exact={true}
            component={PostAssignment}
          />
          <PrivateRoute
            path="/assignment:assignment_id"
            exact={true}
            component={AssignmentPage}
          />
          <PrivateRoute
            path="/students:assignment_id"
            exact={true}
            component={StudentList}
          />
          <PrivateRoute
            path="/student/identification/result"
            exact={true}
            component={StudentImagePage}
          />
          <UserProtectedRoute path="/signin" exact={true} component={SignIn} />
          <UserProtectedRoute path="/" exact={true} component={SignIn} />
          <UserProtectedRoute path="/signup" exact={true} component={SignUp} />
        </Switch>
        {/* <PdfViewer  /> */}
      </SocketContext.Provider>
    </Router>
  );
}

export default App;
