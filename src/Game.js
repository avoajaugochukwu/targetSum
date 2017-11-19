import React, { Component } from 'react';

const randomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Number extends Component {
    render() {
        return <div className="number">{this.props.value}</div>;
    }
}

export default class Game extends Component {
    render() {
        return (
          <div className="game">
            <div className="target">42</div>
            <Number value={8} />
            <Number value={5} />
            <Number value={12} />
            <Number value={13} />
            <Number value={5} />
            <Number value={16} />
            <div className="footer">
              <div className="timer-value">10</div>
              <button>Start</button>
            </div>
          </div>
        );
    }
}