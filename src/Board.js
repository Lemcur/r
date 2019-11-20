import React, { Component } from 'react';
import Square from './Square'
import _ from 'lodash'
class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coordinations: []
      }],
      xIsNext: true,
      stepNumber: 0,
      movesOrderAscending: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    const coordinations = current.coordinations.slice()
    if (this.calculateWinner(squares) || squares[i]){
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    coordinations.push({col: (i % 3) + 1, row: (Math.floor(i / 3)) + 1})
    this.setState({
      history: history.concat([{
        squares: squares,
        coordinations: coordinations
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    })
  }

  renderSquares() {
    let squareRows = []

    for(let i = 0; i < 3; i++) {
      squareRows.push(this.renderSquareRow(i))
    }

    return squareRows
  }

  renderSquareRow(i) {
    let squares = []

    for(let j = 0; j < 3; j++) {
      let square = this.renderSquare(i*3 + j)
      squares.push(square)
    }

    return <div className="board-row">{squares}</div>
  }

  renderSquare(i) {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const squares = current.squares.slice()

    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => this.handleClick(i)}
      />
    )
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2 === 0)
    })
  }

  orderMoves() {
    this.setState({movesOrderAscending: !this.state.movesOrderAscending})
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for(let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return squares[a]
    }
  }

  render() {
    const history = this.state.history
    const current = history[history.length - 1];
    const winner = this.calculateWinner(current.squares);
    const coordinations = current.coordinations
    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} [${coordinations[move-1].col},${coordinations[move-1].row}]`:
        'Go to game start'
      let bold = (move === this.state.stepNumber ? 'bolded' : '')

      return (
        <li key={move}>
          <button
            className={bold}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      )
    })


    if (!this.state.movesOrderAscending) {
      moves.sort((a, b) => {
        return b.key - a.key
      })
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="board">
          {this.renderSquares()}
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => {this.orderMoves()}}>
            Sort moves
          </button>
        </div>
      </div>
    )
  }
}

export default Board