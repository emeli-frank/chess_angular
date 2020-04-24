import { Position } from './position';
import { Color } from './color';

export class Piece {
  color: Color
  startingPosition: Position;

  constructor(color: Color, startingPosition: Position) {
    this.color = color;
    this.startingPosition = startingPosition;
  }

  get name(): string {
    let name: string;

    if (this instanceof King) {
      name = 'king';
    } else if (this instanceof Queen) {
      name = 'queen';
    } else if (this instanceof Rook) {
      name = 'rook'
    } else if (this instanceof Knight) {
      name = 'knight';
    } else if (this instanceof Bishop) {
      name = 'bishop';
    } else if (this instanceof Pawn) {
      name = 'pawn';
    }

    return name;
  }

  get colorName(): string {
    return (this.color == Color.black) ? 'black' : 'white';
  }

  canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean {
    return (this instanceof Pawn);
  }

  getValidPositions(initialPos: Position, board: Piece[][]): Position[] {
    return [];
  }
}

export class King extends Piece {
  constructor(color: Color, startingPosition: Position) {
    super(color, startingPosition)
  }

  canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean {
    /* let legalPos: Position[] = [];
    let testPos: Position;

    testPos = new Position(initialPos.r - 1, initialPos.c - 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c + 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c - 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c + 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c - 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c + 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    console.log("legal positions:", legalPos); */

    return inPositions(this.getValidPositions(initialPos, board), intendedPos);

    /* if (
      // move one step diagonally in any direction
      Math.abs(initialPos.r - intendedPos.r) == 1 && Math.abs(initialPos.c - intendedPos.c) == 1 ||

      // move one step to the left or right
      Math.abs(initialPos.r - intendedPos.r) == 0 && Math.abs(initialPos.c - intendedPos.c) == 1 ||

      // move one step to the top or bottom
      Math.abs(initialPos.c - intendedPos.c) == 0 && Math.abs(initialPos.r - intendedPos.r) == 1 
    ) {
      return true
    } */
    
    return false;
  }

  getValidPositions(initialPos: Position, board: Piece[][]): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    testPos = new Position(initialPos.r - 1, initialPos.c - 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c + 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c - 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c + 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c - 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c + 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    return legalPos
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

function validPos(position: Position, board: Piece[][], color: Color): boolean {
  if ((position.r < 0 || position.r > 7 || position.c < 0 || position.c > 7)) {
    return false
  }

  // this is done separately to avoid errors when position.r and position.c are negative numbers
  // checks to see if friendly piece is in movement path
  if (board[position.r][position.c] && board[position.r][position.c].color == color) {
    return false;
  }

  return true;
}

function inPositions(positions: Position[], position: Position): boolean {
  for (let pos of positions) {
    if (pos.r == position.r && pos.c == position.c) {
      return true
    }
  }

  return false;
}