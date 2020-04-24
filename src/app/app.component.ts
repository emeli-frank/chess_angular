import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { Piece } from './piece';
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
    // ignore selection if play doesn't have turn
    // alert(piece.color);
    if (!this.players[piece.color].hasTurn) {
      this.selected = null;
      this.validMoves = [];
      return;
    }
    /* if (this.players[0].hasTurn && piece.color != Color.white ||
      this.players[1].hasTurn && piece.color != Color.black) {
        this.selected = null;
        return;
    } */

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
    if (this.selected == null) {
      return;
    }

    let pieceToMove: Piece = this.positionSubject.value[this.selected.r][this.selected.c];
    if (!this.canMove(pieceToMove, this.selected, new Position(r, c))) {
      this.selected = null;
      this.validMoves = [];
      return;
    }

    let newPosition: Piece[][] = this.positionSubject.value;
    let temp = newPosition[this.selected.r][this.selected.c];
    newPosition[this.selected.r][this.selected.c] = null;
    newPosition[r][c] = temp;
    this.positionSubject.next(newPosition);

    this.selected = null;
    this.validMoves = [];

    this.players[pieceToMove.color].hasTurn = false;
    this.players[(pieceToMove.color + 1) % 2].hasTurn = true;

    /* if (this.players[0].hasTurn) {
      this.players[0].hasTurn = false;
      this.players[1].hasTurn = true;
    } else {
      this.players[1].hasTurn = false;
      this.players[0].hasTurn = true;
    } */
  }

  canMove(piece: Piece, initialPos: Position, intendedPos: Position): boolean {
    return piece.canMove(initialPos ,intendedPos, this.positionSubject.value);
  }

}
