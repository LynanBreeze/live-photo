import { useState, useEffect, useRef } from "react";
import * as LivePhotosKit from "livephotoskit";
import queryString from "query-string";
import "./App.css";

const LivePhotosKitReact = ({ className, photoSrc, videoSrc }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const player = LivePhotosKit.Player(nodeRef.current);
    player.photoSrc = photoSrc;
    player.videoSrc = videoSrc;
  }, []);

  return <div ref={nodeRef} className={className}></div>;
};

const LivePhoto = (props) => {
  const { photoSrc, videoSrc, muted, loop, useApple } = props;
  const [imageReady, setImageReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoRunning, setVideoRunning] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  const playVideo = () => {
    if (videoRunning) {
      videoRef.current.pause();
    } else {
      setVideoPlaying(true);
      videoRef.current.play();
    }
  };

  const openPreview = (url) => {
    window.top.postMessage(url, window.location.origin);
  };

  const onClick = (e) => {
    if (!/trigger/.test(e.target.className) && !videoPlaying) {
      openPreview(photoSrc);
    }
  };

  const onImageLoad = () => {
    setImageReady(true);
    if (
      /iphone/i.test(navigator.userAgent) &&
      /micromessenger/i.test(navigator.userAgent)
    ) {
      setTimeout(() => {
        setVideoReady(true);
      }, 500);
    }
  };

  return (
    <div className='live-photo' onClick={onClick}>
      {useApple ? (
        <LivePhotosKitReact
          className='live-img'
          photoSrc={photoSrc}
          videoSrc={videoSrc}
        />
      ) : (
        <>
          <div
            className='live-trigger'
            onClick={playVideo}
            style={{ opacity: Number(videoReady) }}
          >
            <div
              className='trigger-icon'
              style={{
                animationPlayState: videoRunning ? "running" : "paused",
              }}
            ></div>
            <span className='trigger-text'>LIVE</span>
          </div>
          <img
            className='live-img'
            src={photoSrc}
            onLoad={onImageLoad}
            style={{ opacity: Number(imageReady) }}
          />
          <video
            playsInline
            webkit-playsinline
            loop={loop}
            muted={muted}
            ref={videoRef}
            className='live-video'
            src={videoSrc}
            style={{ opacity: Number(videoPlaying) }}
            onCanPlay={() => setVideoReady(true)}
            onLoadedMetadata={() => setVideoReady(true)}
            onPlaying={() => setVideoRunning(true)}
            onPause={() => setVideoRunning(false)}
            onEnded={() => setVideoPlaying(false)}
          ></video>
        </>
      )}
    </div>
  );
};

function App() {
  const [photoSrc, setPhotoSrc] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [useApple, setUseApple] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const { picUrl, videoUrl, photoSrc, videoSrc, muted, loop, useApple } =
      parsed;
    setPhotoSrc(picUrl || photoSrc);
    setVideoSrc(videoUrl || videoSrc);
    setMuted(!!muted);
    setUseApple(!!useApple);
    setLoop(!!loop);
  }, []);

  return (
    <>
      {!!photoSrc && !!videoSrc ? (
        <LivePhoto
          photoSrc={photoSrc}
          videoSrc={videoSrc}
          muted={muted}
          useApple={useApple}
          loop={loop}
        />
      ) : null}
    </>
  );
}

export default App;
