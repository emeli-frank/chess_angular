import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { Piece, King, Queen, Rook, Knight, Bishop, Pawn } from './piece';
import { Color } from './color';
import { pieces } from './pieces';
import { Position } from './position';

import { trigger, transition, animate, style } from '@angular/animations';

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
  @ViewChild('board') board: ElementRef;

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

    console.log(positions);

    this.positionSubject = new BehaviorSubject<Piece[][]>(positions);
    this.position$ = this.positionSubject.asObservable();

    // this.position$.subscribe((value) => console.log(value));
  }

  assetName(piece: Piece): string {
    let color: string;
    let name: string;

    color = (piece.color == 1) ? 'white' : 'black';
    if (piece instanceof King) {
      name = 'king';
    } else if (piece instanceof Queen) {
      name = 'queen';
    } else if (piece instanceof Rook) {
      name = 'rook'
    } else if (piece instanceof Knight) {
      name = 'knight';
    } else if (piece instanceof Bishop) {
      name = 'bishop';
    } else if (piece instanceof Pawn) {
      name = 'pawn';
    }

    return `${name}-${color}`;
  }

  setBoardSize() {
    let offsetWidth = this.board.nativeElement.offsetWidth;
    this.board.nativeElement.style.height = `${offsetWidth}px`;
  }

  translate(r: number, c: number) {
    return `translate(${c * 100}%, ${r * 100}%)`
  }

  /* do(r: number, c: number) {
    let subscription = this.position$.subscribe((position) => {
      if (position[r][c]) {
        this.select(new Position(r, c));
        console.log("selected position: ", this.selected);
      } else {
        this.move();
      }
    })
    // subscription.unsubscribe();
    
  } */

  select(piece: Piece, r: number, c: number) {
    console.log("selecting");
    let position = new Position(r, c)
    this.selected = position;
  }

  move(r: number, c: number) {
    if (this.selected == null) {
      return;
    }

    let pieceToMove: Piece = this.positionSubject.value[this.selected.r][this.selected.c];
    console.log("piec is: ", pieceToMove);
    if (!this.canMove(pieceToMove, this.selected, new Position(r, c))) {
      this.selected = null;
      return;
    }

    let newPosition: Piece[][] = this.positionSubject.value;
    let temp = newPosition[this.selected.r][this.selected.c];
    newPosition[this.selected.r][this.selected.c] = null;
    newPosition[r][c] = temp;
    this.positionSubject.next(newPosition);

    this.selected = null;


    // todo:: unselect as d last thing whether success or failure
  }

  canMove(piece: Piece, initialPos: Position, intendedPos: Position): boolean {
    return piece.canMove(initialPos ,intendedPos, this.positionSubject.value);
    /* if (piece instanceof King) {
      if (
        // move one step diagonally in any direction
        Math.abs(initialPos.r - intendedPos.r) == 1 && Math.abs(initialPos.c - intendedPos.c) == 1 ||

        // move one step to the left or right
        Math.abs(initialPos.r - intendedPos.r) == 0 && Math.abs(initialPos.c - intendedPos.c) == 1 ||

        // move one step to the top or bottom
        Math.abs(initialPos.c - intendedPos.c) == 0 && Math.abs(initialPos.r - intendedPos.r) == 1 
      ) {
        return true
      }
      
      return false;
    } */

    return true;
  }

}
