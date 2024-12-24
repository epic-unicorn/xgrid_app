import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import ReactPlayer from "react-player/lazy";
import Select from "react-select";
import { Rnd } from "react-rnd";
import "./AuthComponent.css";

const sampleVideos = [
  { url: 'https://www.w3schools.com/html/mov_bbb.mp4', tags: ['apple', 'kaas'] },
  { url: 'https://www.w3schools.com/html/movie.mp4', tags: ['peer', 'kaas'] },
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', tags: ['banaan', 'mango'] },
  { url: 'https://www.w3schools.com/html/mov_bbb.mp4', tags: ['fruit', 'cheese'] },
  { url: 'https://www.w3schools.com/html/movie.mp4', tags: ['banana', 'apple'] },
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', tags: ['mango', 'pear'] },
  { url: 'https://www.w3schools.com/html/mov_bbb.mp4', tags: ['orange', 'grape'] },
  { url: 'https://www.w3schools.com/html/movie.mp4', tags: ['kiwi', 'melon'] },
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', tags: ['berry', 'peach'] },
  { url: 'https://www.w3schools.com/html/mov_bbb.mp4', tags: ['plum', 'nectarine'] },
  { url: 'https://www.w3schools.com/html/movie.mp4', tags: ['apricot', 'fig'] },
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', tags: ['date', 'pomegranate'] },
  { url: 'https://www.w3schools.com/html/mov_bbb.mp4', tags: ['coconut', 'lime'] },
  { url: 'https://www.w3schools.com/html/movie.mp4', tags: ['lemon', 'papaya'] },
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', tags: ['guava', 'lychee'] },
  { url: 'https://www.w3schools.com/html/mov_bbb.mp4', tags: ['passionfruit', 'dragonfruit'] },
  { url: 'https://www.w3schools.com/html/movie.mp4', tags: ['starfruit', 'durian'] },
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', tags: ['jackfruit', 'rambutan'] }
];

function AuthComponent() {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [videos, setVideos] = useState([]);
  const [videoCount, setVideoCount] = useState(2);
  const [selectedTags, setSelectedTags] = useState([]);
  const [useSampleVideos, setUseSampleVideos] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (!useSampleVideos) {
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
          extractTags(result.data);
        })
        .catch((error) => {
          error = new Error();
        });
    } else {
      // Use sample videos
      setVideos(sampleVideos);
      extractTags(sampleVideos);
    }
  }, [useSampleVideos]);

  // Extract unique tags from videos
  const extractTags = (videos) => {
    const tags = new Set();
    videos.forEach(video => {
      if (video.tags) {
        video.tags.forEach(tag => tags.add(tag));
      }
    });
    setAvailableTags([...tags].map(tag => ({ value: tag, label: tag })));
  };

  // logout
  function logout() {
    cookies.remove("TOKEN", { path: "/account" });
    window.location.href = "/";
  }

  // handle video count change
  function handleVideoCountChange(event) {
    setVideoCount(event.target.value);
  }

  // handle tag selection change
  function handleTagSelectionChange(selectedOptions) {
    setSelectedTags(selectedOptions.map(option => option.value));
  }

  // filter videos by selected tags
  const filteredVideos = videos.filter(video => {
    return selectedTags.every(tag => video.tags && video.tags.includes(tag));
  });

  return (
    <>
      <header className="header-bar">
        <h1>Video Player App</h1>
        <button type="button" className="btn btn-danger" onClick={() => logout()}>
          Logout
        </button>
      </header>
      <div className="container-fluid h-10">
        <h2>Videos {videos.length}</h2>

        <div>
          <label htmlFor="videoCount">Number of videos to show: </label>
          <input
            type="number"
            id="videoCount"
            value={videoCount}
            onChange={handleVideoCountChange}
            min="0"
            max={videos.length}
          />
        </div>

        <div>
          <label htmlFor="tagSelection">Filter by tags: </label>
          <Select
            id="tagSelection"
            isMulti
            options={availableTags}
            onChange={handleTagSelectionChange}
          />
        </div>

        <div>
          <button type="button" onClick={() => setUseSampleVideos(!useSampleVideos)}>
            {useSampleVideos ? 'Show Actual Videos' : 'Show Sample Videos'}
          </button>
        </div>

        <div className="video-grid">
          {filteredVideos.slice(0, videoCount).map((video, index) => (
            <Rnd
              key={`${index}-${video.url}`}
              default={{
                x: 0,
                y: 0,
                width: 320,
                height: 180,
              }}
              minWidth={160}
              minHeight={90}
              bounds="parent"
            >
              <ReactPlayer playing controls muted url={video.url} width="100%" height="100%" />
            </Rnd>
          ))}
        </div>
      </div>
    </>
  );
}

export default AuthComponent;