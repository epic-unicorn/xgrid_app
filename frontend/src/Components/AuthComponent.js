import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import ReactPlayer from "react-player/lazy";
import Select from "react-select";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "./AuthComponent.css";

const sampleVideos = [
  { url: 'https://www.w3schools.com/html/mov_bbb.mp4', data: { tags: ['apple', 'kaas'], title: 'title1', duration: '8min' } },
  { url: 'https://www.w3schools.com/html/movie.mp4', data: { tags: ['apple', 'kaas'], title: 'title2', duration: '8.2min' } },
  { url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
];

function AuthComponent() {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [videos, setVideos] = useState([]);
  const [videoCount, setVideoCount] = useState(2);
  const [selectedTags, setSelectedTags] = useState([]);
  const [useSampleVideos, setUseSampleVideos] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [currentVideoIndexes, setCurrentVideoIndexes] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    if (!useSampleVideos) {
      const configuration = {
        method: "get",
        url: "http://localhost:3000/xnxx",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(configuration)
        .then((result) => {
          setVideos(result.data);
          extractTags(result.data);
          initializeVideoIndexes(result.data.length);
          initializeLayout(result.data.length);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Use sample videos
      setVideos(sampleVideos);
      extractTags(sampleVideos);
      initializeVideoIndexes(sampleVideos.length);
      initializeLayout(sampleVideos.length);
    }
  }, [useSampleVideos, videoCount]);

  // Extract unique tags from videos
  const extractTags = (videos) => {
    const tags = new Set();
    videos.forEach(video => {
      if (video.data.tags) {
        video.data.tags.forEach(tag => tags.add(tag));
      }
    });
    setAvailableTags([...tags].map(tag => ({ value: tag, label: tag })));
  };

  // Initialize video indexes
  const initializeVideoIndexes = (count) => {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i % videos.length);
    }
    setCurrentVideoIndexes(indexes);
  };

  // Initialize layout
  const initializeLayout = (count) => {
    const newLayout = [];
    for (let i = 0; i < count; i++) {
      newLayout.push({ i: i.toString(), x: i % 4, y: Math.floor(i / 4), w: 1, h: 1 });
    }
    setLayout(newLayout);
  };

  // Load next video
  const loadNextVideo = (index, event) => {
    if (event) {
      event.stopPropagation(); // Stop the event from propagating to the drag handler
    }
    setCurrentVideoIndexes(prevIndexes => {
      const newIndexes = [...prevIndexes];
      newIndexes[index] = (newIndexes[index] + 1) % videos.length;
      return newIndexes;
    });
  };

  // Remove video
  const removeVideo = (index, event) => {
    if (event) {
      event.stopPropagation(); // Stop the event from propagating to the drag handler
    }
    setCurrentVideoIndexes(prevIndexes => {
      const newIndexes = [...prevIndexes];
      newIndexes.splice(index, 1);
      return newIndexes;
    });
    setLayout(prevLayout => {
      const newLayout = [...prevLayout];
      newLayout.splice(index, 1);
      return newLayout;
    });
  };

  // logout
  function logout() {
    cookies.remove("TOKEN", { path: "/account" });
    window.location.href = "/";
  }

  // handle video count change
  function handleVideoCountChange(event) {
    const count = parseInt(event.target.value, 10);
    setVideoCount(count);
    initializeVideoIndexes(count);
    initializeLayout(count);
  }

  // handle tag selection change
  function handleTagSelectionChange(selectedOptions) {
    setSelectedTags(selectedOptions.map(option => option.value));
  }

  // filter videos by selected tags
  const filteredVideos = videos.filter(video => {
    return selectedTags.every(tag => video.data.tags && video.data.tags.includes(tag));
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

        <GridLayout
          className="video-grid"
          layout={layout}
          cols={4}
          rowHeight={window.innerHeight / 4}
          width={window.innerWidth}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          draggableCancel=".overlay button"
        >
          {filteredVideos.slice(0, videoCount).map((video, index) => (
            <div key={index} className="video-item" data-grid={layout[index]}>
              {currentVideoIndexes[index] !== undefined && videos[currentVideoIndexes[index]] && (
                <>
                  <div className="video-header">
                    <h3>{videos[currentVideoIndexes[index]].data.title}</h3>
                    <p>{videos[currentVideoIndexes[index]].data.duration}</p>
                  </div>
                  <ReactPlayer
                    className="react-player"
                    playing
                    controls
                    muted
                    url={videos[currentVideoIndexes[index]].url}
                    width="100%"
                    height="100%"
                    onEnded={() => loadNextVideo(index)}
                  />
                </>
              )}
              <div className="overlay">
                <button onClick={(event) => loadNextVideo(index, event)}>Next Video</button>
                <button onClick={(event) => removeVideo(index, event)}>Remove Video</button>
              </div>
            </div>
          ))}
        </GridLayout>
      </div>
    </>
  );
}

export default AuthComponent;