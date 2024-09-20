// VideoGrid.js
import React, { useEffect, useRef, useState } from "react";
import "./VideoGrid.css";

function VideoGrid({ numVideos, videoSources }) {
  const videosRef = useRef([]);  
  useEffect(() => {
    console.log("Video sources changed:", videoSources);

    // Remove event listeners for old videos
    videosRef.current.forEach((video) => {
      video.removeEventListener("ended", handleVideoEnded);
      video.removeEventListener("mouseenter", handleMouseEnter);
      video.removeEventListener("mouseleave", handleMouseLeave);
    });

    videosRef.current = document.querySelectorAll(".video-container video");

    videosRef.current.forEach((video) => {
      video.addEventListener("ended", handleVideoEnded);
      video.addEventListener("mouseenter", handleMouseEnter);
      video.addEventListener("mouseleave", handleMouseLeave);
    });
  }, [videoSources]);

  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const handleVideoMouseEnter = (index) => {
    setHoveredVideo(index);
    setIsButtonVisible(true);
  };

  const handleVideoMouseLeave = () => {
    setIsButtonVisible(false);
    setTimeout(() => {
      if (!isButtonVisible) {
        setHoveredVideo(null);
      }
    }, 200); // Adjust the delay as needed
  };

  const handleVideoEnded = (event) => {
    const video = event.target;
    const newSource =
      videoSources[Math.floor(Math.random() * videoSources.length)];

    // Check if the video is already in the process of changing its source
    if (!video.isChangingSource) {
      // Set the flag to indicate that the source change is in progress
      video.isChangingSource = true;

      const handleMetadataLoaded = () => {
        video.removeEventListener("loadedmetadata", handleMetadataLoaded);
        // Play the video only after the new source is fully loaded
        video
          .play()
          .then(() => {
            // Reset the flag once the video starts playing
            video.isChangingSource = false;
          })
          .catch((error) => {
            console.error("Error playing video:", error);
            // Reset the flag in case of an error
            video.isChangingSource = false;
          });
      };

      // Add event listener for 'loadedmetadata' before changing the source
      video.addEventListener("loadedmetadata", handleMetadataLoaded);

      // Change the video source
      video.src = newSource;
    }
  };

  const handleLoadNewVideo = () => {
    const video = document.querySelector(`#video-${hoveredVideo}`);
    if (video && !video.isChangingSource) {
      const newSource = videoSources[Math.floor(Math.random() * videoSources.length)];
      video.isChangingSource = true;

      const handleMetadataLoaded = () => {
        video.removeEventListener('loadedmetadata', handleMetadataLoaded);
        video.play()
          .then(() => {
            video.isChangingSource = false;
          })
          .catch(error => {
            console.error('Error playing video:', error);
            video.isChangingSource = false;
          });
      };

      video.addEventListener('loadedmetadata', handleMetadataLoaded);
      video.src = newSource;
    }
  };

  const handleMouseEnter = (event) => {
    const video = event.target;
    video.playbackRate = 0.5; // Set the playback rate to slow motion
  };

  const handleMouseLeave = (event) => {
    const video = event.target;
    video.playbackRate = 1; // Restore the normal playback rate
  };

  // Generate video elements based on the number of videos
  const videoElements = [];
  for (let i = 0; i < numVideos; i++) {
    videoElements.push(
        <div key={i} className="video-container" onMouseEnter={() => handleVideoMouseEnter(i)} onMouseLeave={handleVideoMouseLeave}>
        <video
          id={`video-${i}`}
          controls
          autoPlay
          muted
          onEnded={handleVideoEnded}
        >
          <source src={videoSources[i % videoSources.length]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {hoveredVideo === i && isButtonVisible && (
          <button className="load-new-video-btn" onClick={handleLoadNewVideo}>Load New Video</button>
        )}
      </div>
    );
  }

  return <div className="video-grid">{videoElements}</div>;
}

export default VideoGrid;