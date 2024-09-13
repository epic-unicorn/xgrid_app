import { Container, Col, Row } from "react-bootstrap";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import AuthComponent from "./AuthComponent";
import Account from "./Account";
import HomeComponent from "./HomeComponent";
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>XGRID</h1>

          <section id="navigation">
            <a href="/">Home</a>
            <a href="/account">Account</a>
            <a href="/auth">XGRID</a>
          </section>
        </Col>
      </Row>

      <Switch>
        <Route exact path="/" component={HomeComponent} />
        <Route exact path="/account" component={Account} />
        <ProtectedRoutes path="/auth" component={AuthComponent} />
      </Switch>
    </Container>
  );
}

export default App;
