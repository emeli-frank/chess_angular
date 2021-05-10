import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { Piece, Pawn } from './piece';
import { allPieces } from './pieces';
import { Position } from './position';
import { Player } from './player';
import { Color } from './color';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private positionSubject: BehaviorSubject<Piece[][]>
  position$: Observable<Piece[][]>;
  allPieces: Piece[];
  boardSize: number;
  selected: Position;
  validMoves: Position[] = [];
  // validMoves: Position[] = [new Position(0, 0), new Position(1, 1), new Position(2, 2), new Position(4, 2)];
  @ViewChild('board') board: ElementRef;
  players: Player[] = [];
  capturedPieces: Piece[] = [];

  constructor() {
    this.players.push(new Player(Color.white, true))
    this.players.push(new Player(Color.black, false))

    let positions: Piece[][] = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ];

    this.allPieces = allPieces;

    for (let piece of this.allPieces) {
      positions[piece.startingPosition.r][piece.startingPosition.c] = piece;
    }

    this.positionSubject = new BehaviorSubject<Piece[][]>(positions);
    this.position$ = this.positionSubject.asObservable();
  }

  ngAfterViewInit(): void {
    this.setBoardSize();
    fromEvent(window, 'resize').subscribe((evt: any) => {
      this.setBoardSize();
    });
  }

  get currentBoard(): Piece[][] {
    return this.positionSubject.value;
  }

  private setBoardSize() {
    let offsetWidth = this.board.nativeElement.offsetWidth;
    this.board.nativeElement.style.height = `${offsetWidth}px`;
  }

  translate(r: number, c: number): string {
    return `translate(${c * 100}%, ${r * 100}%)`
  }

  // this method is called when a piece that has turn is clicks
  pieceClicked(piece: Piece, r: number, c: number) {
    /* 
     * capturing oponents piece 
     */
    if (!this.players[piece.color].hasTurn &&  // owner of the clicked piece does not have turn
      this.selected != null // a piece is selected
      ) {
      this.capture(r,c);
      this.selected = null;
      this.validMoves = [];

      this.players[piece.color].hasTurn = true;
      this.players[(piece.color + 1) % 2].hasTurn = false;
      return;
    }

    // ignore selection if player doesn't have turn
    if (!this.players[piece.color].hasTurn) {
      this.selected = null;
      this.validMoves = [];
      return;
    }

    // if the same piece is already selected, deselect
    if (this.selected && piece == this.positionSubject.value[this.selected.r][this.selected.c]) {
      this.selected = null;
      this.validMoves = [];
      return;
    }

    let position = new Position(r, c)
    this.selected = position;
    this.validMoves = piece.getValidPositions(new Position(r, c), this.positionSubject.value)
  }

  // this method is called when player clicks on an empty cell
  emptyCellClicked(r: number, c: number) {
    // get piece to move, if it cannot be moved, return and reset selected and valid moves
    let pieceToMove: Piece = this.positionSubject.value[this.selected.r][this.selected.c];
    if (!this.canMove(pieceToMove, this.selected, new Position(r, c))) {
      this.selected = null;
      this.validMoves = [];
      return;
    }

    let pos: Piece[][] = this.positionSubject.value;
    let p1 = pos[r][c];
    let p2 = pos[this.selected.r][this.selected.c];
    pos[r][c] = p2;
    pos[this.selected.r][this.selected.c] = p1; // p1 is null
    this.positionSubject.next(pos);

    p2.onMove(this.selected, new Position(r, c));

    this.selected = null;
    this.validMoves = [];

    this.players[pieceToMove.color].hasTurn = false;
    this.players[(pieceToMove.color + 1) % 2].hasTurn = true;
  }

  private canMove(piece: Piece, initialPos: Position, intendedPos: Position): boolean {
    return piece.canMove(initialPos ,intendedPos, this.positionSubject.value);
  }

  private capture(r: number, c: number) {
    // get piece to move, if it cannot be moved, return and reset selected and valid moves
    let pieceToMove: Piece = this.positionSubject.value[this.selected.r][this.selected.c];
    if (!this.canMove(pieceToMove, this.selected, new Position(r, c))) {
      this.selected = null;
      this.validMoves = [];
      return;
    }

    let pos: Piece[][] = this.positionSubject.value;
    let toCapture = pos[r][c];
    let captor = pos[this.selected.r][this.selected.c];
    pos[r][c] = captor;
    this.capturedPieces.push(toCapture);
    // this.capturedPieces = [toCapture];
    pos[this.selected.r][this.selected.c] = null; // todo:: add captured piece to captured array
    this.positionSubject.next(pos);
  }

}
