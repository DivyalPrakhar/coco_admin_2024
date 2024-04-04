import React from "react";
import { Switch, Route } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export const AppRoutes = (props) => {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/prot1" component={Test} />
      <Route path="/prot2" component={Test} />
    </Switch>
  );
};


const Test = (props) => {
  return (
   <div>
     Test
   </div>
  );
};
