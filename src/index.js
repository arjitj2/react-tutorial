import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const button = props.winner ? 
    <button className="square" onClick={props.onClick} style={{color:'red'}}>
      {props.value}
    </button>
    :
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  return button
}

class Board extends React.Component {
  renderSquare(i) {
    var winner = false
    if (this.props.winners.indexOf(i) > -1) {
      winner = true
    }
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        winner= {winner}
      />
    )
  }

  render() {
    const arrs = []
    for (var j = 0; j < 3; j++) {
      const items = []
      for (var i = 0; i < 3; i++) {
        items.push(this.renderSquare(j*3+i))
      }
      arrs.push(
        <div className="board-row">{items}</div>
      )
    }
    

    return (
      <div>
        {arrs}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          square_clicked: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      descending: true,
      winners: Array(3).fill(null)
    }
  }

  handleClick(i) {
    const history = this.state.history
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        col_clicked: (i%3) + 1,
        row_clicked: Math.floor(i/3) + 1
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    })
  }

  jumpTo(step) {
    const history = this.state.history.slice(0, step + 1)
    this.setState({
      history: history,
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  switchOrder() {
    this.setState({
      descending: !this.state.descending
    })
  }

  setWinners(winner_arr) {
    if (this.state.winners[0] !== null) {
      return
    }
    this.setState({
      winners: winner_arr
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + '. Square clicked: (' + step.col_clicked + ',' + step.row_clicked + ').' 
        : 'Go to game start'

      const button = (move !== this.state.stepNumber) ?
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
        :
        <li key={move} >
          <button 
            style={{fontWeight: "bold"}} 
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
        
      return button
    })

    if (!this.state.descending) {
      moves.sort((a, b) => {
        return b.key - a.key
      })
    }

    let status
    if (winner) {
      status = 'Winner: ' + winner[0]
      this.setWinners(winner[1])
    } else {
      status = "Next player: " + (this.state.xIsNext? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winners={this.state.winners}
          />
        </div>
        <div className="game-info">
          <div>
            {status}
          </div>
          <button onClick={() => this.switchOrder()}>
            Switch sort order
          </button>
          <ol>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a,b,c]];
    }
  }
  return null;
}