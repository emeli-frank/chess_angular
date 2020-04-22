import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  cells: Tile[] = [];
  private positionSubject: BehaviorSubject<Piece[][]>
  position$: Observable<Piece[][]>;

  constructor() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let tileColor = ((i + j) % 2) ? Color.black : Color.white;
        this.cells.push(new Tile(tileColor));
      }
    }
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

    let pieces: Piece[] = [
      new King(Color.black, new Position(0, 4)),
      new Queen(Color.black, new Position(0, 3)),
      new Rook(Color.black, new Position(0, 0)),
      new Rook(Color.black, new Position(0, 7)),
      new Knight(Color.black, new Position(0, 1)),
      new Knight(Color.black, new Position(0, 6)),
      new Bishop(Color.black, new Position(0, 2)),
      new Bishop(Color.black, new Position(0, 5)),
      new Pawn(Color.black, new Position(1, 0)),
      new Pawn(Color.black, new Position(1, 1)),
      new Pawn(Color.black, new Position(1, 2)),
      new Pawn(Color.black, new Position(1, 3)),
      new Pawn(Color.black, new Position(1, 4)),
      new Pawn(Color.black, new Position(1, 5)),
      new Pawn(Color.black, new Position(1, 6)),
      new Pawn(Color.black, new Position(1, 7)),

      new King(Color.white, new Position(7, 4)),
      new Queen(Color.white, new Position(7, 3)),
      new Rook(Color.white, new Position(7, 0)),
      new Rook(Color.white, new Position(7, 7)),
      new Knight(Color.white, new Position(7, 1)),
      new Knight(Color.white, new Position(7, 6)),
      new Bishop(Color.white, new Position(7, 2)),
      new Bishop(Color.white, new Position(7, 5)),
      new Pawn(Color.white, new Position(6, 0)),
      new Pawn(Color.white, new Position(6, 1)),
      new Pawn(Color.white, new Position(6, 2)),
      new Pawn(Color.white, new Position(6, 3)),
      new Pawn(Color.white, new Position(6, 4)),
      new Pawn(Color.white, new Position(6, 5)),
      new Pawn(Color.white, new Position(6, 6)),
      new Pawn(Color.white, new Position(6, 7)),
    ]

    for (let piece of pieces) {
      positions[piece.startingPosition.x][piece.startingPosition.y] = piece;
    }

    console.log(positions);

    this.positionSubject = new BehaviorSubject<Piece[][]>(positions);
    this.position$ = this.positionSubject.asObservable();
  }

}

class Tile {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }
}

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

enum Color {
  white = 1,
  black,
}

class Piece {
  color: Color
  startingPosition: Position;

  constructor(color: Color, startingPosition: Position) {
    this.color = color;
    this.startingPosition = startingPosition;
  }
}

class King extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

class Queen extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

class Rook extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

class Knight extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

class Bishop extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

class Pawn extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}
