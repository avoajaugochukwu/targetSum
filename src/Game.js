import React, { Component } from 'react';
var _ = require('lodash');

const randomNumberBetween = (min, max) =>
Math.floor(Math.random() * (max - min + 1)) + min;

class Number extends React.PureComponent {
handleClick = () => {
  if (this.props.clickable) {
    this.props.onClick(this.props.id);
  }
};

render() {
  return (
    <div
      className="number"
      style={{ opacity: this.props.clickable ? 1 : 0.3 }}
      onClick={this.handleClick}
    >
      {this.props.value}
    </div>
  );
}
}

export default class Game extends React.Component {
static bgColors = {
  playing: '#ccc',
  won: 'green',
  lost: 'red',
};

state = {
  gameStatus: 'new',
  remainingSeconds: this.props.initialSeconds,
  selectedIds: [],
};

challengeNumbers = Array
  .from({ length: this.props.challengeSize })
  .map(() => randomNumberBetween(...this.props.challengeRange));

target = _.sampleSize(
  this.challengeNumbers,
  this.props.challengeSize - 2
).reduce((acc, curr) => acc + curr, 0);

componentDidMount() {
  if (this.props.autoPlay) {
    this.startGame();
  }
}

componentWillUnmount() {
  clearInterval(this.intervalId);
}

startGame = () => {
  this.setState({ gameStatus: 'playing' }, () => {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        const newRemainingSeconds = prevState.remainingSeconds - 1;
        if (newRemainingSeconds === 0) {
          clearInterval(this.intervalId);
          return { gameStatus: 'lost', remainingSeconds: 0 };
        }
        return { remainingSeconds: newRemainingSeconds };
      });
    }, 1000);
  });
};

isNumberAvailable = (numberIndex) =>
  this.state.selectedIds.indexOf(numberIndex) === -1;

selectNumber = (numberIndex) => {
  if (this.state.gameStatus !== 'playing') {
    return;
  }
  this.setState(
    (prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
      gameStatus: this.calcGameStatus([
        ...prevState.selectedIds,
        numberIndex,
      ]),
    }),
    () => {
      if (this.state.gameStatus !== 'playing') {
        clearInterval(this.intervalId);
      }
    }
  );
};

calcGameStatus = (selectedIds) => {
  const sumSelected = selectedIds.reduce(
    (acc, curr) => acc + this.challengeNumbers[curr],
    0
  );
  if (sumSelected < this.target) {
    return 'playing';
  }
  return sumSelected === this.target ? 'won' : 'lost';
};

render() {
  const { gameStatus, remainingSeconds } = this.state;
  return (
    <div className="game">
      <div
        className="target"
        style={{ backgroundColor: Game.bgColors[gameStatus] }}
      >
        {gameStatus === 'new' ? '?' : this.target}
      </div>
      <div className="challenge-numbers">
        {this.challengeNumbers.map((value, index) => (
          <Number
            key={index}
            id={index}
            value={gameStatus === 'new' ? '?' : value}
            clickable={this.isNumberAvailable(index)}
            onClick={this.selectNumber}
          />
        ))}
      </div>
      <div className="footer">
        {gameStatus === 'new' ? (
          <button onClick={this.startGame}>Start</button>
        ) : (
          <div className="timer-value">{remainingSeconds}</div>
        )}
        {['won', 'lost'].includes(gameStatus) && (
          <button onClick={this.props.onPlayAgain}>Play Again</button>
        )}
      </div>
    </div>
  );
}
}