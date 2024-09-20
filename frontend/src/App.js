import "./App.css";
import { Switch, Route } from "react-router-dom";
import AuthComponent from "./Components/AuthComponent";
import Account from "./Components/Account";
import HomeComponent from "./Components/HomeComponent";
import ProtectedRoutes from "./ProtectedRoutes";
import { Col } from "react-bootstrap";
  
function App() {
  return (
    <div className="App">
      <div>
        <div class="row mx-md-n5 bg-light">
          <div class="col px-md-5"><div class="p-3"><a href="/">Home</a></div></div>
          <div class="col px-md-5"><div class="p-3"><a href="/account">Login</a></div></div>
          <div class="col px-md-5"><div class="p-3"><a href="/auth">Xgrid</a></div></div>
        </div>
      </div>

      <Switch>
        <Route exact path="/" component={HomeComponent} />
        <Route exact path="/account" component={Account} />
        <ProtectedRoutes path="/auth" component={AuthComponent} />
      </Switch>
    </div>
  );
}

export default App;
