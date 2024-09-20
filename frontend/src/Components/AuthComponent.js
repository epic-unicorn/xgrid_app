import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Row, Col } from "react-bootstrap";
import Cookies from "universal-cookie";

function AuthComponent() {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const configuration = {
      method: "get",
      url: "http://localhost:3000/auth-endpoint",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(configuration)
      .then((result) => {
        setMessage(result.data.message);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  // logout
  const logout = () => {
    cookies.remove("TOKEN", { path: "/account" });
    window.location.href = "/";
  };

  return (
    <div class="container-fluid h-10">
      <h3 className="text-center text-danger">{message}</h3>
      <Button type="submit" variant="danger" onClick={() => logout()}>
        Logout
      </Button>

      <Button type="submit" variant="info">
        Refresh videos
      </Button>

      <div>
        <Row>
          <Col>
            <video id="t" width="100%" controls autoPlay muted />
          </Col>
          <Col>
            <video id="t" width="100%" controls autoPlay muted />
          </Col>
        </Row>
        <Row>
          <Col>
            <video id="t" width="100%" controls autoPlay muted />
          </Col>
          <Col>
            <video id="t" width="100%" controls autoPlay muted />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AuthComponent;
