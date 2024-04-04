import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { useAuthUser, useIsAuthenticated } from "../App/Context";
import { RoleType } from "../Constants";
import { ROUTES } from "../Constants/Routes";
import { LoginRoute } from "./Login";
import { AppRoutes } from "./ProtectedApp";
import {XIIExamResult} from '../routes/XIIExamResult'
import {XExamResult} from '../routes/XExamResult'
import { XCompareResult } from '../routes/newXResult'

const AppRouter = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute path="/login" component={LoginRoute} />
        <Route path={ROUTES.PRINT_XII_RESULT} component={XIIExamResult}/>
        <Route path={ROUTES.PRINT_X_COMPARE_RESULT} component={XCompareResult}/>
        <Route path={ROUTES.PRINT_X_EXAM_RESULT} component={XExamResult}/>
      
        <ProtectedRoute path="/" component={AppRoutes} />
      </Switch>
    </BrowserRouter>
  );
};

const PublicRoute = (props) => {
  const auth = useIsAuthenticated();
  const authuser = useAuthUser();

  const path =
    authuser?.staff?.staffRole === "SUPPORT_EXECUTIVE"
      ? ROUTES.TICKETS
      : authuser?.staff?.staffRole === "HEAD_TEACHER" ||
        authuser?.staff?.staffRole === "TEACHER"
        ? ROUTES.DOUBTS_PANEL :
        authuser?.staff?.staffRole === "DELIVERY_ACCESS" ?
          ROUTES.OFFLINE_ORDERS
          : "/";
  return !auth ? <Route {...props} /> : <Redirect to={path} />;
};

const ProtectedRoute = (props) => {
  const auth = useIsAuthenticated();
  return auth ? <Route {...props} /> : <Redirect to={"/login"} />;
};

export default AppRouter;
