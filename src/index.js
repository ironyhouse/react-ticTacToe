import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/*  
    Компонент Square отображает одиночную кнопку <button>, а Board отображает 9 квадратов. 
    Компонент Game отображает Board со значениями чисел-заполнителей. 
*/
function Square(props) {
    /* Заполняет компонент Square значением, когда мы щелкаем по нему */
    return (
        <button className="square" onClick={props.onClick}>
        {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
        <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
        );
    }

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

class Game extends React.Component {
    /* Заполняет массив значением null */
constructor(props) {
    super(props);
    this.state = {
    history: [
        {
        squares: Array(9).fill(null)
        }
    ],
    stepNumber: 0,
    xIsNext: true
    };
}
/* Игнорируем клики если кто-то выйграл или все квадраты заполнены */
handleClick(i) {
    /* Cоздает копию массива (вместо мутации) */
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
    return;
    }
    /* чередование «Х» и «О» */
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
    history: history.concat([
        {
        squares: squares
        }
    ]),
    stepNumber: history.length,
    xIsNext: !this.state.xIsNext
    });
}
/* Вернуться на орпеделенный ход */
jumpTo(step) {
    this.setState({
    stepNumber: step,
    xIsNext: (step % 2) === 0
    });
}

render() {
    const history = this.state.history;
    /*  Отрисовывает ход */
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
    const desc = move ?
        'Go to move #' + move :
        'Restart Game';
    return (
            <div key={move}>
                <div onClick={() => this.jumpTo(move)}>{desc}</div>
            </div>
        );
    });

    let status;
    if (winner) {
    /* Отображаем Победителя  */ 
    status = "Winner: " + winner;
    } else {
    /* Отображаем какой игрок должен ходить  */ 
    status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
    <div className="game">

        <div className="game-info">
            <h2>{status}</h2>
        </div>  
        <div className="game-board">
            <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
            />
        </div>
        <div  className="game-moves">{moves}</div>

    </div>
    );
}
}

// ========================================
ReactDOM.render(<Game />, document.getElementById("root"));

/* Проверка победителя */
function calculateWinner(squares) {
const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    return squares[a];
    }
}
return null;
}
  