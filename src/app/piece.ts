import { Position } from './position';

enum Color {
  white = 1,
  black,
}

export class Piece {
  color: Color
  startingPosition: Position;

  constructor(color: Color, startingPosition: Position) {
    this.color = color;
    this.startingPosition = startingPosition;
  }
}

export class King extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

export class Queen extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

export class Rook extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

export class Knight extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

export class Bishop extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}

export class Pawn extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }
}