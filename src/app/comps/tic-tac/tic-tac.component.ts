import { Component, OnInit } from '@angular/core';
import { TicTac } from 'src/app/services/tic-tac';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tic-tac',
  templateUrl: './tic-tac.component.html',
  styleUrls: ['./tic-tac.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonText,
  ],
})
export class TicTacComponent implements OnInit {
  gameStats: any = {
    totalGame: 0,
    totalWin: 0,
    totalLoose: 0,
    totalDraw: 0,
  };
  isReset = true;
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  constructor(public gameService: TicTac) {}
  ngOnInit() {}

  canClick = true;
  onSquareClick(square: any) {
    if (!this.canClick) return;
    this.canClick = false;
    setTimeout(() => {
      this.canClick = true;
    }, 1500);
    if (square.state || this.gameService.gameOver) return;

    square.state = this.gameService.activePlayer;
    this.gameService.changePlayerTurn(square);
    this.updateStats();
    if (!this.gameService.gameOver && this.isComputerTurn()) {
      setTimeout(() => {
        this.computerMove();
      }, 500);
    }
  }

  restart() {
    this.isReset = true;
    this.gameService.newGame();
  }
  isComputerTurn(): boolean {
    return this.gameService.activePlayer === 'O';
  }

  computerMove() {
    if (this.gameService.gameOver) return;

    switch (this.difficulty) {
      case 'easy':
        this.easyMove();
        break;
      case 'medium':
        this.mediumMove();
        break;
      case 'hard':
        this.hardMove();
        break;
    }

    this.updateStats();
  }
  easyMove() {
    const empty = this.getEmptySquares();
    const choice = empty[this.getRandomIntInclusive(0, empty.length - 1)];

    choice.state = 'O';
    this.gameService.changePlayerTurn(choice);
  }
  mediumMove() {
    const board = this.gameService.getBoard;

    let move = this.findBestMove(board, 'O');
    if (!move) {
      move = this.findBestMove(board, 'X');
    }

    if (!move) {
      const empty = this.getEmptySquares();
      move = empty[this.getRandomIntInclusive(0, empty.length - 1)];
    }

    move.state = 'O';
    this.gameService.changePlayerTurn(move);
  }
  findBestMove(board: any[], player: string) {
    for (let pattern of this.winPatterns) {
      const [a, b, c] = pattern;

      const states = [board[a].state, board[b].state, board[c].state];

      if (
        states.filter((s) => s === player).length === 2 &&
        states.includes(null)
      ) {
        const index = pattern[states.indexOf(null)];
        return board[index];
      }
    }
    return null;
  }
  hardMove() {
    const bestMove = this.minimax(this.gameService.getBoard, 'O');

    bestMove.square.state = 'O';
    this.gameService.changePlayerTurn(bestMove.square);
  }
  minimax(board: any[], player: string): any {
    const emptySquares = board.filter((s) => !s.state);

    if (this.checkWinner(board, 'X')) return { score: -10 };
    if (this.checkWinner(board, 'O')) return { score: 10 };
    if (emptySquares.length === 0) return { score: 0 };

    const moves: any[] = [];

    for (let square of emptySquares) {
      const move: any = {};
      move.square = square;

      square.state = player;

      const result = this.minimax(board, player === 'O' ? 'X' : 'O');
      move.score = result.score;

      square.state = null;
      moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -1000;
      for (let move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = 1000;
      for (let move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    }

    return bestMove;
  }
  checkWinner(board: any[], player: string): boolean {
    return this.winPatterns.some((pattern) =>
      pattern.every((i) => board[i].state === player)
    );
  }

  updateStats() {
    if (!this.gameService.gameOver || !this.isReset) return;

    this.isReset = false;
    this.gameStats.totalGame++;

    if (this.gameService.winner) {
      if (this.gameService.activePlayer === 'X') {
        this.gameStats.totalWin++;
      } else {
        this.gameStats.totalLoose++;
      }
    } else {
      this.gameStats.totalDraw++;
    }
  }

  getEmptySquares() {
    return this.gameService.getBoard.filter((s: any) => !s.state);
  }

  getRandomIntInclusive(min: number, max: number): number {
    const minCeiled: number = Math.ceil(min);
    const maxFloored: number = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }
}
