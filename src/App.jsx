import { useState, useEffect, useRef } from "react";
import * as LivePhotosKit from "livephotoskit";
import queryString from "query-string";
import "./App.css";
import { useVideoDownloader } from "./useVideoDownloader";
import { useVisible } from "./useVisible";
import { CircleProgress } from "./Progress";

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
  const { photoSrc, videoSrc, muted, loop, useApple, volume } = props;
  const [imageReady, setImageReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoRunning, setVideoRunning] = useState(false);
  const videoRef = useRef(null);

  const { ref: livePhotoRef } = useVisible({
    threshold: 0.2,
    onChange: (v) => {
      if (!v && videoRunning) {
        videoRef.current.pause();
      }
    },
  });

  const { progress, blobUrl, download } = useVideoDownloader();

  useEffect(() => {
    if (videoSrc) {
      download(videoSrc);
    }
  }, [videoSrc, download]);

  const playVideo = (e) => {
    e.stopPropagation();
    if (progress !== 100) return;
    if (videoRunning) {
      videoRef.current.pause();
    } else {
      setVideoPlaying(true);
      videoRef.current.play();
      if (!muted) {
        videoRef.current.volume = volume / 100;
      }
    }
  };

  const openPreview = (url) => {
    setTimeout(() => {
      window.top.postMessage(url, window.location.origin);
    }, 0);
  };

  const onClick = (e) => {
    if (!/trigger/.test(e.target.className) && !videoPlaying) {
      openPreview(photoSrc);
    }
  };

  const onImageLoad = () => {
    setImageReady(true);
  };

  return (
    <div ref={livePhotoRef} className='live-photo' onClick={onClick}>
      {useApple ? (
        <LivePhotosKitReact
          className='live-img'
          photoSrc={photoSrc}
          videoSrc={videoSrc}
        />
      ) : (
        <>
          <div className='live-trigger' onClick={playVideo}>
            <div className='icon-wrap'>
              <div
                className={`trigger-icon ${progress === 100 ? "ready" : ""}`}
                style={{
                  animationPlayState: videoRunning ? "running" : "paused",
                }}
              ></div>
              <CircleProgress
                className={`progress-circle ${progress === 100 ? "loaded" : ""}`}
                size={25}
                strokeWidth={3}
                progress={progress}
                children={""}
              />
            </div>
            <span className='trigger-text'>LIVE</span>
          </div>
          <img
            className='live-img'
            src={photoSrc}
            onLoad={onImageLoad}
            style={{ opacity: Number(imageReady) }}
          />
          {!!blobUrl && (
            <video
              playsInline
              webkit-playsinline='true'
              loop={loop}
              muted={muted}
              ref={videoRef}
              className='live-video'
              src={blobUrl}
              style={{ opacity: Number(videoPlaying) }}
              onPlaying={() => setVideoRunning(true)}
              onPause={() => setVideoRunning(false)}
              onEnded={() => setVideoPlaying(false)}
            ></video>
          )}
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
  const [volume, setVolume] = useState(100);
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const {
      picUrl,
      videoUrl,
      photoSrc,
      videoSrc,
      muted,
      loop,
      useApple,
      volume,
    } = parsed;
    setPhotoSrc(picUrl || photoSrc);
    setVideoSrc(videoUrl || videoSrc);
    setMuted(!!muted);
    setVolume(volume || 100);
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
          volume={volume}
        />
      ) : null}
    </>
  );
}

export default App;
