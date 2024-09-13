import React, { useEffect, useState } from "react";
import axios from "axios";

function HomeComponent() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const configuration = {
      method: "get",
      url: "http://localhost:3000/free-endpoint",
    };
    
    axios(configuration)
      .then((result) => {
        setMessage(result.data.message);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);
  return (
    <div>
      <h1 className="text-center">Free Component</h1>
      <h3 className="text-center text-danger">{message}</h3>
    </div>
  );
}

export default HomeComponent;
