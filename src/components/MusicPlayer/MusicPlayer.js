import { useRef, useState } from "react";

import { FaPlay, FaPause, FaShuffle } from "react-icons/fa6";
import { GiNextButton, GiPreviousButton } from "react-icons/gi";
import { RiPlayListFill } from "react-icons/ri";

import "./MusicPlayer.css";

const musics = [
  {
    id: 1,
    name: "Nistar",
    author: "Unknown",
    picture: "img/nistar.jpg",
    src: "music/nistar.mp3",
  },
  {
    id: 2,
    name: "Tarik",
    author: "Unknown",
    picture: "img/tarik.jpg",
    src: "music/tarik.mp3",
  },
  {
    id: 3,
    name: "Zakhm",
    author: "Unknown",
    picture: "img/zakhm.jpg",
    src: "music/zakhm.mp3",
  },
];

function getTimeFormat(seconds) {
  let minute = Math.floor(seconds / 60);
  if (minute < 10) minute = `0${minute}`;
  let second = Math.floor(seconds % 60);
  if (second < 10) second = `0${second}`;
  return `${minute}:${second}`;
}

const MusicPlayer = () => {
  const [currentMusic, setCurrentMusic] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [shuffle, setShuffle] = useState(false);
  const [playlist, setPlaylist] = useState(false);
  const [first, setFirst] = useState(true);
  const audioRef = useRef();
  const seekbarRef = useRef();

  function setUpMusic() {
    seekbarRef.current.max = audioRef.current.duration;
    seekbarRef.current.value = 0;
    setDuration(() => audioRef.current.duration);
    if (!first) {
      playPause();
    } else {
      setFirst(false);
    }
  }

  function changeMusic(type) {
    if (shuffle) {
      let randomNum = currentMusic;
      while (randomNum === currentMusic) {
        randomNum = Math.floor(Math.random() * (musics.length - 0.5));
      }
      setCurrentMusic(() => randomNum);
    } else {
      if (typeof type === "number") {
        const index = musics.findIndex(music => music.id === type)
        setCurrentMusic(() => index)
      }else if (type === "NEXT") {
        currentMusic === musics.length - 1
          ? setCurrentMusic(() => 0)
          : setCurrentMusic((prev) => prev + 1);
      } else {
        currentMusic === 0
          ? setCurrentMusic(() => musics.length - 1)
          : setCurrentMusic((prev) => prev - 1);
      }
    }
  }

  function timeUpdating() {
    seekbarRef.current.value = audioRef.current.currentTime;
    setCurrentTime(() => getTimeFormat(audioRef.current.currentTime));
  }

  function changeTime() {
    audioRef.current.currentTime = seekbarRef.current.value;
  }

  function playPause() {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(() => true);
    } else {
      audioRef.current.pause();
      setIsPlaying(() => false);
    }
  }

  return (
    <div className="MusicPlayer">
      <audio
        src={musics[currentMusic].src}
        ref={audioRef}
        onEnded={changeMusic.bind(this, "NEXT")}
        onTimeUpdate={timeUpdating}
        onLoadedData={setUpMusic}
      ></audio>
      <div className="MusicPlayer__pictureBox">
        <img
          src={musics[currentMusic].picture}
          alt={musics[currentMusic].name}
          className="MusicPlayer__pictureBox-picture"
        />
      </div>
      <div className="MusicPlayer__information">
        <h2 className="MusicPlayer__name">{musics[currentMusic].name}</h2>
        <p className="MusicPlayer__author">{musics[currentMusic].author}</p>
      </div>
      <div className="MusicPlayer__timeSec">
        <input
          type="range"
          className="MusicPlayer__seekbar"
          ref={seekbarRef}
          onChange={changeTime}
          min={0}
          max={duration}
        />
        <div className="MusicPlayer__timeSec-time align-items jc-sb">
          <span>{currentTime}</span>
          <span>{getTimeFormat(duration)}</span>
        </div>
      </div>
      <div className="MusicPlayer__controls align-items jc-sb">
        <button
          className={`MusicPlayer__button go-center ${shuffle ? "active" : ""}`}
          onClick={() => {
            setShuffle((prev) => !prev);
          }}
        >
          <FaShuffle className="MusicPlayer__button-icon" />
        </button>
        <button className="MusicPlayer__button go-center" onClick={changeMusic}>
          <GiPreviousButton className="MusicPlayer__button-icon" />
        </button>
        <button className="MusicPlayer__button go-center" onClick={playPause}>
          {isPlaying ? (
            <FaPause className="MusicPlayer__button-icon" />
          ) : (
            <FaPlay className="MusicPlayer__button-icon" />
          )}
        </button>
        <button
          className="MusicPlayer__button go-center"
          onClick={changeMusic.bind(this, "NEXT")}
        >
          <GiNextButton className="MusicPlayer__button-icon" />
        </button>
        <button
          className="MusicPlayer__button go-center"
          onClick={() => {
            setPlaylist(true);
          }}
        >
          <RiPlayListFill className="MusicPlayer__button-icon" />
        </button>
      </div>
      <div className={`MusicPlayer__playlist ${playlist ? "active" : ""}`}>
        <div className="MusicPlayer__playlist-outer" onClick={() => {
          setPlaylist(false)
        }}></div>
        <ul className="MusicPlayer__playlist-inner">
          <div className="MusicPlayer__playlist-header align-items jc-sb">
            <h2 className="align-items gp-10">
              <RiPlayListFill className="MusicPlayer__button-icon" />
              Playlist
            </h2>
          </div>
          {musics.map((music) => {
            return (
              <li
                className="MusicPlayer__music align-items gp-10"
                key={music.id}
                onClick={() => {
                  changeMusic(music.id)
                  setPlaylist(false)
                }}
              >
                <img
                  src={music.picture}
                  alt={music.name}
                  className="MusicPlayer__music-picture"
                />
                <div>
                  <h3>{music.name}</h3>
                  <p>{music.author}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;
