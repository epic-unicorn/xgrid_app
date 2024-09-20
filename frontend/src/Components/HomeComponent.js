import React, { useEffect, useState } from "react";
import axios from "axios";

function HomeComponent() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const configuration = {
      method: "get",
      url: "http://localhost:3000/home-endpoint",
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
      <h3 className="text-center text">{message}</h3>
    </div>
  );
}

export default HomeComponent;
