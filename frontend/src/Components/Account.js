import React from "react";
import { Col, Row } from "react-bootstrap";
import Login from "../Login";
import Register from "../Register";

export default function Account() {
  return (
    <div class="row mx-md-n5">
      <div class="col px-md-5">
        <div class="p-3 border bg-light">
          <Login />
        </div>
      </div>
    </div>
  );
}