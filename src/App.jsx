import React, { Component } from "react";
import "./App.css";
import Library from "./Library";
import SongPage from "./SongPage";
import About from "./About";
import ThemeToggle from "./ThemeToggle";

class App extends Component {
  constructor() {
    super();
    this.state = {
      about: false,
      song: false,
      isrc: "",
      asrc: "",
      error: false,
      title: ""
    };
    this.songClicked = this.songClicked.bind(this);
    this.backClicked = this.backClicked.bind(this);
    this.aboutClicked = this.aboutClicked.bind(this);
  }

  songClicked(audio, image, name, err) {
    this.setState({
      asrc: audio,
      isrc: image,
      title: name,
      error: err,
      song: true
    });
  }

  backClicked() {
    this.setState({
      song: false,
      about: false
    });
  }

  aboutClicked(e) {
    e.preventDefault();
    this.setState({
      about: true
    });
  }

  render() {
    let content;
    if (this.state.song) {
      content = (
        <SongPage
          isrc={this.state.isrc}
          asrc={this.state.asrc}
          title={this.state.title}
          backClicked={this.backClicked}
          error={this.state.error}
        />
      );
    } else if (this.state.about) {
      content = <About backClicked={this.backClicked} />;
    } else {
      content = (
        <Library
          songClicked={this.songClicked}
          aboutClicked={this.aboutClicked}
        />
      );
    }

    // ThemeToggle lives outside the conditional so it's never unmounted and
    // stays in the same spot across every view.
    return (
      <>
        <ThemeToggle />
        <div className="app">{content}</div>
      </>
    );
  }
}

export default App;
