import React, { Component } from 'react';

const randomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Number extends Component {
    render() {
        return (
            <div className="number"
                style={{ opacity: this.props.clickable ? 1 : 0.3 }}
                onClick={() => console.log(this.props.id)}
            >
                {this.props.value}
            </div>
        );
    }
}

export default class Game extends Component {
    challengeNumbers = Array
        .from({ length: this.props.challengeSize })
        .map(() => randomNumberBetween(...this.props.challengeRange));

    target = _.sampleSize(
        this.challengeNumbers,
        this.props.challengeSize - 2
    ).reduce((acc, curr) => acc + curr, 0)

    state = {
        gameStatus: 'new', //new, playing, won, lost
        remainingSeconds: this.props.initialSeconds,
        selectedIds: [],
    }

    static = {
        'playing': '#ccc',
        'won': 'green',
        'lost': 'red',
    }

    isNumberAvailable = (numberIndex) => this.state.selectedIds.indexOf(numberIndex) === 1;

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

    // selectNumber

    render() {
        return (
          <div className="game">
            <div 
                className="target"
                style={{ backgroundColor: Game.bgcolors[gameStatus] }}
            >
                {this.state.gameStatus === 'new' ? '?' : this.target}
            </div>
            <div className="challenge-numbers">
                {this.challengeNumbers.map((value, index) =>
                <Number 
                    key={index} 
                    id={index}
                    value={value}
                    clickable={this.isNumberAvailable(index)}
                />
                )}
            </div>
            <div className="footer">
                {this.state.gameStatus === 'new' ? (
                    <button>Start</button>
                ) : (
                    <div className="timer-value">{this.state.remainingSeconds}</div>      
                )}
                {['won', 'lost'].includes(this.state.gameStatus) && (
                    <button>Play Again</button>
                )}
              <button>Start</button>
            </div>
          </div>
        );
    }
}