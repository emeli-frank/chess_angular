import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { Piece, King, Queen, Rook, Knight, Bishop, Pawn } from './piece';
import { Color } from './color';
import { pieces } from './pieces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  cells: Tile[] = [];
  private positionSubject: BehaviorSubject<Piece[][]>
  position$: Observable<Piece[][]>;
  pieces: Piece[];
  boardSize: number;
  @ViewChild('board') board: ElementRef;

  constructor() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let tileColor = ((i + j) % 2) ? Color.black : Color.white;
        this.cells.push(new Tile(tileColor));
      }
    }
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
      positions[piece.startingPosition.x][piece.startingPosition.y] = piece;
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

  translate(piece: Piece) {
    return `translate(${piece.startingPosition.y * 100}%, ${piece.startingPosition.x * 100}%)`
  }

}

class Tile {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }
}


