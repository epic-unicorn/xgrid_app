import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import ReactPlayer from "react-player/lazy";
import Select from "react-select";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "./AuthComponent.css";

const sampleVideos = [
  { url: 'https://www.pexels.com/download/video/28878958/', data: { tags: ['apple', 'kaas'], title: 'title1', duration: '8min' } },
  { url: 'https://www.pexels.com/download/video/30014322/', data: { tags: ['apple', 'kaas'], title: 'title2', duration: '8.2min' } },
  { url: 'https://www.pexels.com/download/video/29304849/', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
  { url: 'https://www.pexels.com/download/video/29967249/', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
  { url: 'https://www.pexels.com/download/video/5150392/', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
  { url: 'https://www.pexels.com/download/video/30043379/', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
  { url: 'https://www.pexels.com/download/video/30043379/', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
  { url: 'https://www.pexels.com/download/video/30043379/', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
  { url: 'https://www.pexels.com/download/video/30043379/', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
  { url: 'https://www.pexels.com/download/video/30043379/', data: { tags: ['apple', 'kaas'], title: 'title3', duration: '10min' } },
];

function AuthComponent() {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [videos, setVideos] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [useSampleVideos, setUseSampleVideos] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [currentVideoIndexes, setCurrentVideoIndexes] = useState([]);
  const [layout, setLayout] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!useSampleVideos) {
      fetchVideos();
    } else {
      // Use sample videos
      setVideos(sampleVideos);
    }
  }, [useSampleVideos]);

  useEffect(() => {
    extractTags(filteredVideos);
  }, [videos, selectedTags, searchTerm]);

  const fetchVideos = () => {
    if(!useSampleVideos){
    const configuration = {
      method: "get",
      url: `http://localhost:3000/xnxx?filter=${searchTerm}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(configuration)
      .then((result) => {
        setVideos(Array.isArray(result.data) ? result.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };

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

  // Add new video
  const addNewVideo = () => {
    setCurrentVideoIndexes(prevIndexes => [...prevIndexes, prevIndexes.length % videos.length]);
    setLayout(prevLayout => [...prevLayout, { i: prevLayout.length.toString(), x: prevLayout.length % 4, y: Math.floor(prevLayout.length / 4), w: 1, h: 1 }]);
  };

  // Remove video
  const removeVideo = (index, event) => {
    if (event) {
      event.stopPropagation(); // Stop the event from propagating to the drag handler
    }
    setCurrentVideoIndexes(prevIndexes => prevIndexes.filter((_, i) => i !== index));
    setLayout(prevLayout => prevLayout.filter((_, i) => i !== index));
  };

  // Load random next video
  const loadNextVideo = (index, event) => {
    if (event) {
      event.stopPropagation(); // Stop the event from propagating to the drag handler
    }
    setCurrentVideoIndexes(prevIndexes => {
      const newIndexes = [...prevIndexes];
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * videos.length);
      } while (nextIndex === newIndexes[index] && videos.length > 1);
      newIndexes[index] = nextIndex;
      return newIndexes;
    });
  };

  // logout
  function logout() {
    cookies.remove("TOKEN", { path: "/account" });
    window.location.href = "/";
  }

  // handle tag selection change
  function handleTagSelectionChange(selectedOptions) {
    setSelectedTags(selectedOptions.map(option => option.value));
  }

  // handle search input change
  function handleSearchInputChange(event) {
    setSearchTerm(event.target.value);
  }

  // handle search form submit
  function handleSearchSubmit(event) {
    event.preventDefault();
    fetchVideos();
  }

  // filter videos by selected tags
  const filteredVideos = videos.filter(video => {
    return selectedTags.every(tag => video.data.tags && video.data.tags.includes(tag));
  });

  return (
    <>
      <header className="header-bar">
        <button type="button" className="btn btn-danger" onClick={() => logout()}>
          Logout
        </button>

        <div>Videos {videos.length}</div>
        <button type="button" onClick={() => setUseSampleVideos(!useSampleVideos)}>
            {useSampleVideos ? 'Show Actual Videos' : 'Show Sample Videos'}
        </button>

        <form onSubmit={handleSearchSubmit}>
          <label htmlFor="search">Search: </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button type="submit">Search</button>
        </form>
        
        <label htmlFor="tagSelection">Filter by tags: </label>
        <Select
          id="tagSelection"
          isMulti
          options={availableTags}
          onChange={handleTagSelectionChange}
        />
      
        <div>
          <button type="button" onClick={addNewVideo}>Add New Video</button>
          <button type="button" onClick={fetchVideos}>Refresh Video List</button>
        </div>
      </header>

      <div className="container-fluid h-10">
        <GridLayout
          className="video-grid"
          layout={layout}
          cols={4}
          rowHeight={window.innerHeight / 4}
          width={window.innerWidth}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          draggableCancel=".button-bar button"
        >
          {currentVideoIndexes.map((videoIndex, index) => (
            <div key={index} className="video-item" data-grid={layout[index]}>
              {videos[videoIndex] && (
                <>
                  <div className="video-header">
                    <p>{videos[videoIndex].data.title} {videos[videoIndex].data.duration}</p>
                  </div>
                  <div className="video-container">
                    <ReactPlayer
                      className="react-player"
                      playing
                      controls
                      muted
                      url={videos[videoIndex].url}
                      width="100%"
                      height="100%"
                      onEnded={() => loadNextVideo(index)}
                    />
                  </div>
                  <div className="button-bar">
                    <button onClick={(event) => loadNextVideo(index, event)}>Next Video</button>
                    <button onClick={(event) => removeVideo(index, event)}>Remove Video</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </GridLayout>
      </div>
    </>
  );
}

export default AuthComponent;