import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Piece } from './piece';
import { allPieces } from './pieces';
import { Position } from './position';
import { Game } from './game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  game: Game;
  boardSize: number;
  @ViewChild('board') board: ElementRef;

  constructor() {
    this.game = new Game(allPieces);
  }

  ngAfterViewInit(): void {
    this.setBoardSize();
    fromEvent(window, 'resize').subscribe((evt: any) => {
      this.setBoardSize();
    });
  }

  private setBoardSize() {
    let offsetWidth = this.board.nativeElement.offsetWidth;
    this.board.nativeElement.style.height = `${offsetWidth}px`;
  }

  translate(r: number, c: number): string {
    return `translate(${c * 100}%, ${r * 100}%)`
  }

  // this method is called when a piece that has turn is clicks
  onPieceClicked(piece: Piece, r: number, c: number) {
    /* 
     * capturing oponents piece 
     */
    if (!this.game.players[piece.color].hasTurn &&  // owner of the clicked piece does not have turn
      this.game.selected != null // a piece is selected
      ) {
      this.capture(r,c);
      this.game.selected = null;
      this.game.validMoves = [];

      this.game.players[piece.color].hasTurn = true;
      this.game.players[(piece.color + 1) % 2].hasTurn = false;
      return;
    }

    // ignore selection if player doesn't have turn
    if (!this.game.players[piece.color].hasTurn) {
      this.game.selected = null;
      this.game.validMoves = [];
      return;
    }

    // if the same piece is already selected, deselect
    if (this.game.selected && piece == this.game.positions[this.game.selected.r][this.game.selected.c]) {
      this.game.selected = null;
      this.game.validMoves = [];
      return;
    }

    let position = new Position(r, c)
    this.game.selected = position;
    this.game.validMoves = piece.getValidPositions(new Position(r, c), this.game)
  }

  // this method is called when player clicks on an empty cell
  onEmptyCellClicked(r: number, c: number) {
    // get piece to move, if it cannot be moved, return and reset selected and valid moves
    let pieceToMove: Piece = this.game.positions[this.game.selected.r][this.game.selected.c];
    if (!this.canMove(pieceToMove, this.game.selected, new Position(r, c))) {
      this.game.selected = null;
      this.game.validMoves = [];
      return;
    }

    const newBorad = pieceToMove.move(this.game.selected, new Position(r, c), this.game);
    this.game.selected = null;
    this.game.validMoves = [];

    this.game.players[pieceToMove.color].hasTurn = false;
    this.game.players[(pieceToMove.color + 1) % 2].hasTurn = true;
  }

  private canMove(piece: Piece, initialPos: Position, intendedPos: Position): boolean {
    return piece.canMove(initialPos ,intendedPos, this.game);
  }

  private capture(r: number, c: number) {
    // get piece to move, if it cannot be moved, return and reset selected and valid moves
    let pieceToMove: Piece = this.game.positions[this.game.selected.r][this.game.selected.c];
    if (!this.canMove(pieceToMove, this.game.selected, new Position(r, c))) {
      this.game.selected = null;
      this.game.validMoves = [];
      return;
    }

    // this.game.lastMovedPieceId = this.game.positions[this.game.selected.r][this.game.selected.c].id;
    let pos: Piece[][] = this.game.positions;
    let toCapture = pos[r][c];
    let captor = pos[this.game.selected.r][this.game.selected.c];
    pos[r][c] = captor;
    this.game.capturedPieces.push(toCapture);
    pos[this.game.selected.r][this.game.selected.c] = null; // todo:: add captured piece to captured array
  }

}
