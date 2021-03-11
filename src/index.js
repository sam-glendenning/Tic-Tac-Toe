/**
 * Creates and handles a game of Tic-Tac-Toe
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * A clickable square in the 3x3 game board
 * @param {*} props - the component properties. Includes a function for switching value from null to either X or O depending on who's turn it is
 * @returns {button} - HTML button object
 */
function Square(props) {
    return (
      <button 
        className="square" 
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
  
  /**
   * Receives the state of the board and renders all 9 squares accordingly
   */
  class Board extends React.Component {

    /**
     * Creates a Square component numbered any of 0-8
     * @param {number} i - the assigned square number
     * @returns {Square} - the square component
     */
    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    /**
     * Renders all 9 squares
     * @returns - rendered game board HTML
     */
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  /**
   * Handles the game state of play and generates the board according to this
   * Also declares when a winner is determined
   */
  class Game extends React.Component {

    /**
     * Holds a state of previous moves, allowing for time travel back to older board states
     * Also remembers who's turn it is through a boolean
     * Also remembers number of turns that have taken place through stepNumber
     * @param {*} props 
     */
    constructor(props)
    {
      super(props);
      this.state = {
        history: [
          {
          squares: Array(9).fill(null)
          }
        ],
        xIsNext: true,      // false if O is next
        stepNumber: 0       // add 1 after every turn
      };
    }

    /**
     * Alters the state to a historical version based on which move number is provided. Board is then re-rendered
     * @param {number} step - the move to go back to
     */
    jumpTo(step)
    {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0     // X's turn on every even number of turns, O's otherwise
      })
    }

    /**
     * What happens when a square is clicked
     * Add new move to the board, then add board state to the history and change turn
     * @param {number} i - the number of the square which has been clicked (so we know which square to get info on, see if there is a winner now that square has been clicked, etc.) 
     * @returns - void, returns early if a winner has been decided so that game state and squares are not changed any further
     */
    handleClick(i)
    {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);   // copy the history to enforce data immutability
      const current = history[history.length-1];                                // get the most recent state of the board
      const squares = current.squares.slice();                                  // get copy of array of squares making up this board state
      if (calculateWinner(squares) || squares[i])                               // if we have a winner or the square has already been clicked on, don't change the square
      {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';      // set value of square depending on who's turn it is (who has clicked square)
      this.setState({                                   //overwrite the stored squares array with the modified one
        history: history.concat([                       // now this move has been added, gather state of board and add it to move history
          {
          squares: squares
          }
        ]),
        stepNumber: history.length,     // don't add one, because we could have gone back to previous move
        xIsNext: !this.state.xIsNext    // switch to other player's turn
      });      
    }

    /**
     * First check if there is a winner
     * Add buttons to go back to previous moves
     * If winner, declare this
     * If not, declare who's turn it is and render all buttons and game board
     * @returns 
     */
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {     // map of previous move buttons in the form of a list
        const desc = move ? 'Go to move #' + move : 'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner)
      {
        status = 'Winner: ' + winner;
      }
      else
      {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      // Two side-by-side divs, one containing the board, one for who's turn it is and move button list
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick ={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================

  /**
   * Uses an array of all possible straights to check
   * Runs through all of them on the given board input
   * If any of them contain the same character, either an X or an O, declare that winner
   * Otherwise, return null for no winner
   * @param {string[] | null[]} squares 
   * @returns {string | null} - string declaring winner, null if no winner
   */
  function calculateWinner(squares) {
    // Possible 3-in-a-rows
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
        return squares[a];
      }
    }
    return null;
  }
  
  // Render game component
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  