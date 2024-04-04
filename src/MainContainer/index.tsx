import React, { useEffect, useState } from 'react';
import TopBar from '../TopBar';
import './index.css'

const bombSvg = (
  <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48.5" cy="55.082" r="33.5" fill="black" />
    <rect x="21.4585" y="23.6646" width="11.5857" height="8.64474" transform="rotate(-34.593 21.4585 23.6646)" fill="black" />
    <rect x="20" y="15.271" width="4" height="8.64474" transform="rotate(-34.593 20 15.271)" fill="black" />
    <rect x="12" y="2.70312" width="3" height="12" rx="1.5" transform="rotate(-34.593 12 2.70312)" fill="black" />
    <rect x="7" y="12.8452" width="3" height="12" rx="1.5" transform="rotate(-71.5147 7 12.8452)" fill="black" />
    <rect x="22.8115" width="3" height="12" rx="1.5" transform="rotate(3.87818 22.8115 0)" fill="black" />
    <rect x="34.4839" y="4" width="3" height="12" rx="1.5" transform="rotate(52.2176 34.4839 4)" fill="black" />
    <rect x="18.4839" y="16" width="3" height="12" rx="1.5" transform="rotate(52.2176 18.4839 16)" fill="black" />
  </svg>
);

const flagSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fill-rule="evenodd" d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z" clip-rule="evenodd" />
  </svg>
)

function MainCointainer() {

  const [bombsLeft, setBombsLeft] = useState<number>(10);
  const [board, setBoard] = useState<boardType[][]>([]);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    if (!(timer === 999)) {
      const timerId = setTimeout(() => {
        setTimer(timer + 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timer]);

  //* 9 x 9 = 81 squares, 12.3% bomb

  const rowsNum: number = 9;
  const colsNum: number = 9;
  const mineNum: number = 10;

  interface boardType {
    isMine: boolean,
    revealed: boolean,
    count: number,
    flag: boolean
  }

  function createBoard(row: number, col: number): boardType[][] {
    const board: boardType[][] = [];

    for (let i = 0; i < row; i++) {
      board[i] = []

      for (let j = 0; j < col; j++) {
        board[i][j] = {
          isMine: false,
          revealed: false,
          count: 0,
          flag: false
        }
      }
    }
    return board;
  }

  function placeMine(row: number, col: number, mine: number, board: boardType[][]): void {
    let minesPlaced: number = 0;

    while (minesPlaced < mine) {

      const rows = Math.floor(Math.random() * row);
      const cols = Math.floor(Math.random() * col);

      if (!board[rows][cols].isMine) {
        board[rows][cols].isMine = true;
        minesPlaced++;
      }
    }
  }

  function calculateMines(rows: number, cols: number, board: boardType[][]): void {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!board[i][j].isMine) {
          let count = 0;
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              const ni = i + x;
              const nj = j + y;
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && board[ni][nj].isMine) {
                count++;
              }
            }
          }
          board[i][j].count = count;
        }
      }
    }
  }

  function handleCellClick(row: number, col: number) {
    if (!board[row][col].revealed && !board[row][col].flag) {
      const updatedBoard = [...board];
      updatedBoard[row][col].revealed = true;
      setBoard(updatedBoard);
    }
  }

  function handleRightCellClick(e: React.MouseEvent,row: number, col: number) {
    e.preventDefault();
    if (!board[row][col].revealed) {
      const updatedBoard = [...board];
      if(updatedBoard[row][col].flag) {
        updatedBoard[row][col].flag = false;
        let flagsLeft = bombsLeft + 1;
        setBombsLeft(flagsLeft);
      } else {
        updatedBoard[row][col].flag = true;
        let flagsLeft = bombsLeft - 1;
        setBombsLeft(flagsLeft);
      }
      setBoard(updatedBoard);
    }
  }

  function renderBoard(board: boardType[][]) {

    return (
      <div className="grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((square, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square${square.revealed ? ' revealed' : ''}${square.isMine ? ' mine' : ''}${square.flag ? ' flag-sqr' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightCellClick(e, rowIndex, colIndex)}
                id={square.count > 0 ? `count-${square.count}` : ''}
              >
                {square.revealed ? 
                  (square.isMine ? bombSvg : 
                    (square.count > 0 ? 
                      square.count
                       : '')) : 
                    (square.flag ? flagSvg : '')
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  useEffect(() => {
    const newBoard = createBoard(rowsNum, colsNum);
    placeMine(rowsNum, colsNum, mineNum, newBoard);
    calculateMines(rowsNum, colsNum, newBoard);
    setBoard(newBoard);
  }, []);

  return (
    <div className="main-container">
      <TopBar mines={bombsLeft} timer={timer} />
      {renderBoard(board)}
    </div>
  )
}

export default MainCointainer;
