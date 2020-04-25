import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { Piece, Pawn } from './piece';
import { pieces } from './pieces';
import { Position } from './position';
import { Player } from './player';
import { Color } from './color';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private positionSubject: BehaviorSubject<Piece[][]>
  position$: Observable<Piece[][]>;
  pieces: Piece[];
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
  }

  ngAfterViewInit(): void {
    this.setBoardSize();
    fromEvent(window, 'resize').subscribe((evt: any) => {
      this.setBoardSize();
    });
  }

  ngOnInit(): void {
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

    this.pieces = pieces;

    for (let piece of this.pieces) {
      positions[piece.startingPosition.r][piece.startingPosition.c] = piece;
    }

    this.positionSubject = new BehaviorSubject<Piece[][]>(positions);
    this.position$ = this.positionSubject.asObservable();
  }

  get currentBoard(): Piece[][] {
    return this.positionSubject.value;
  }

  setBoardSize() {
    let offsetWidth = this.board.nativeElement.offsetWidth;
    this.board.nativeElement.style.height = `${offsetWidth}px`;
  }

  translate(r: number, c: number) {
    return `translate(${c * 100}%, ${r * 100}%)`
  }

  select(piece: Piece, r: number, c: number) {
    // capturing oponents piece
    if (!this.players[piece.color].hasTurn && 
      this.positionSubject.value[this.selected.r][this.selected.c].color != piece.color) {
      this.capture(r,c);
      this.selected = null;
      this.validMoves = [];

      this.players[piece.color].hasTurn = true;
      this.players[(piece.color + 1) % 2].hasTurn = false;
      return;
    }

    // ignore selection if play doesn't have turn
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
    console.log("selecting");
    let position = new Position(r, c)
    this.selected = position;
    this.validMoves = piece.getValidPositions(new Position(r, c), this.positionSubject.value)
  }

  move(r: number, c: number) {
    // if no piece is selected just return, this should not happen
    if (this.selected == null) {
      return;
    }

    // get piece to move, if it cannot be moved, return and reset selected and valid moves
    let pieceToMove: Piece = this.positionSubject.value[this.selected.r][this.selected.c];
    if (!this.canMove(pieceToMove, this.selected, new Position(r, c))) {
      this.selected = null;
      this.validMoves = [];
      return;
    }

    /* let pos: Piece[][] = this.positionSubject.value;
    let temp = pos[this.selected.r][this.selected.c];
    pos[this.selected.r][this.selected.c] = null;
    pos[r][c] = temp;
    this.positionSubject.next(pos); */

    let pos: Piece[][] = this.positionSubject.value;
    let p1 = pos[r][c];
    let p2 = pos[this.selected.r][this.selected.c];
    pos[r][c] = p2;
    pos[this.selected.r][this.selected.c] = p1;
    this.positionSubject.next(pos);

    // TODO:: move this to the piece or pawn class
    if (p2 instanceof Pawn) {
      p2.hasMoved = true;
    }
    // TODO:: move this to the piece or pawn class
    if (p2 instanceof Pawn && Math.abs(r - this.select.r) ==2) {
      p2.moveTwiceInFirstMove = true;
    }

    this.selected = null;
    this.validMoves = [];

    this.players[pieceToMove.color].hasTurn = false;
    this.players[(pieceToMove.color + 1) % 2].hasTurn = true;
  }

  canMove(piece: Piece, initialPos: Position, intendedPos: Position): boolean {
    return piece.canMove(initialPos ,intendedPos, this.positionSubject.value);
  }

  capture(r: number, c: number) {
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
