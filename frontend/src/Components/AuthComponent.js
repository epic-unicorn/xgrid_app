import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import ReactPlayer from "react-player/lazy";

function AuthComponent() {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: "http://localhost:3000/get-videos",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(configuration)
      .then((result) => {
        setVideos(result.data);
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
    <>
      <div class="container-fluid h-10">
        <h2>Videos {videos.length}</h2>

        <button type="button" class="btn btn-danger" onClick={() => logout()}>
          Logout
        </button>

        <div>
          <ReactPlayer playing controls muted />
          <ReactPlayer playing controls muted />
        </div>
      </div>
    </>
  );
}

export default AuthComponent;
