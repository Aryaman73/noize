import React from "react";
import "./Library.css";
import SongCard from "./SongCard";

function Library(props) {
  const audios = [];
  const images = [];
  const list = [];

  const titles = [
    "Waterfall in a forest",
    "Thunderstorm & Rain",
    "Cafe Music",
    "Brown Noise",
    "Rainy Day",
    "Medieval Town",
    "Celestial Noise",
    "Metropolis Soundscape",
    "Snowy Blizzard",
    "Forest Ambience"
  ];

  for (let i = 1; i <= 10; i++) {
    // Served from the Pages site itself (see deploy.yml), so the browser gets
    // Content-Type: audio/mpeg + inline disposition — required for iOS playback.
    // GitHub Releases serve application/octet-stream + attachment, which iOS rejects.
    audios.push(`${import.meta.env.BASE_URL}audio/a${i}.mp3`);
    images.push(`./images/i${i}`);
    list.push([audios[i - 1], images[i - 1], titles[i - 1]]);
  }

  const songs = list.map(arr => {
    return (
      <SongCard
        key={arr.toString()}
        songClicked={props.songClicked}
        asrc={arr[0]}
        isrc={arr[1]}
        title={arr[2]}
        err={false}
      />
    );
  });

  const finalSongs = [];

  for (let i = 0; i < 10; i += 3) {
    finalSongs.push(
      <div className="row" key={i}>
        {songs[i]}
        {songs[i + 1] ? songs[i + 1] : undefined}
        {songs[i + 2] ? songs[i + 2] : undefined}
      </div>
    );
  }

  return (
    <div className="library">
      <div className="header-text">
        <h2>Noize</h2>
        <p>
          <a href="About Page" onClick={e => props.aboutClicked(e)}>
            about
          </a>{" "}
          /{" "}
          <a href="https://github.com/Aryaman73/noize">github</a>
        </p>
      </div>
      {finalSongs}
    </div>
  );
}

export default Library;
