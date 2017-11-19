import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game';

class App extends Component {
  render() {
    return (
      <Game 
        challengeSize={6} 
        challengeRange={[2, 9]} 
        initialSeconds={10}
      />
    );
  }
}

export default App;
