import { Position } from './position';
import { Color } from './color';

export abstract class Piece {
  color: Color
  startingPosition: Position;

  constructor(public id: number, color: Color, startingPosition: Position) {
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

  abstract canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean;

  abstract getValidPositions(initialPos: Position, board: Piece[][]): Position[];

  abstract move(from: Position, to: Position, board: Piece[][]): Piece[][];

  onMove(from: Position, to: Position) {
    if (this instanceof Pawn) {
      // check if pawn moved and if it jumpled 2 squares and set approprait flags
      if (!this.hasMoved && Math.abs(to.r - from.r) == 2) {
        this.moveTwiceInFirstMove = true;
      }

      this.hasMoved = true;
    }
  }
}

export class King extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean {
    return inPositions(this.getValidPositions(initialPos, board), intendedPos);
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

  move(from: Position, to: Position, board: Piece[][]): Piece[][] {
    let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null

    this.onMove(from, to);

    return board;
  }

}

export class Queen extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, board: Piece[][]): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    let b = new Bishop(0, this.color, null);
    let bPos = b.getValidPositions(initialPos, board);
    let r = new Rook(0, this.color, null);
    let rPos = r.getValidPositions(initialPos, board);

    legalPos = bPos.concat(rPos);

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean {
    return inPositions(this.getValidPositions(initialPos, board), intendedPos);
  }

  move(from: Position, to: Position, board: Piece[][]): Piece[][] {
    let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null

    this.onMove(from, to);

    return board;
  }
}

export class Rook extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, board: Piece[][]): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r, initialPos.c - i);
      let foobar = foo(testPos, board, this.color);
      if (foobar == bar.empty) {
        legalPos.push(testPos);
      } else if (foobar == bar.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == bar.outOfBound || bar.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r, initialPos.c + i);
      let foobar = foo(testPos, board, this.color);
      if (foobar == bar.empty) {
        legalPos.push(testPos);
      } else if (foobar == bar.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == bar.outOfBound || bar.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r - i, initialPos.c);
      let foobar = foo(testPos, board, this.color);
      if (foobar == bar.empty) {
        legalPos.push(testPos);
      } else if (foobar == bar.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == bar.outOfBound || bar.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r + i, initialPos.c);
      let foobar = foo(testPos, board, this.color);
      if (foobar == bar.empty) {
        legalPos.push(testPos);
      } else if (foobar == bar.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == bar.outOfBound || bar.friendly) {
        break;
      }
    }

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean {
    return inPositions(this.getValidPositions(initialPos, board), intendedPos);
  }

  move(from: Position, to: Position, board: Piece[][]): Piece[][] {
    let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null

    this.onMove(from, to);

    return board;
  }
}

export class Knight extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, board: Piece[][]): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    testPos = new Position(initialPos.r - 2, initialPos.c - 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 2, initialPos.c + 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c - 2);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c + 2);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 2, initialPos.c + 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 2, initialPos.c - 1);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c + 2);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c - 2);
    if (validPos(testPos, board, this.color)) {
      legalPos.push(testPos);
    }

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean {
    return inPositions(this.getValidPositions(initialPos, board), intendedPos);
  }

  move(from: Position, to: Position, board: Piece[][]): Piece[][] {
    let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null

    this.onMove(from, to);

    return board;
  }
}

export class Bishop extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, board: Piece[][]): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r - i, initialPos.c - i);
      let foobar = foo(testPos, board, this.color);
      if (foobar == bar.empty) {
        legalPos.push(testPos);
      } else if (foobar == bar.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == bar.outOfBound || bar.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r - i, initialPos.c + i);
      let foobar = foo(testPos, board, this.color);
      if (foobar == bar.empty) {
        legalPos.push(testPos);
      } else if (foobar == bar.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == bar.outOfBound || bar.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r + i, initialPos.c - i);
      let foobar = foo(testPos, board, this.color);
      if (foobar == bar.empty) {
        legalPos.push(testPos);
      } else if (foobar == bar.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == bar.outOfBound || bar.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r + i, initialPos.c + i);
      let foobar = foo(testPos, board, this.color);
      if (foobar == bar.empty) {
        legalPos.push(testPos);
      } else if (foobar == bar.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == bar.outOfBound || bar.friendly) {
        break;
      }
    }

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean {
    return inPositions(this.getValidPositions(initialPos, board), intendedPos);
  }

  move(from: Position, to: Position, board: Piece[][]): Piece[][] {
    let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null

    this.onMove(from, to);

    return board;
  }
}

export class Pawn extends Piece {
  hasMoved: boolean = false;
  moveTwiceInFirstMove: boolean = false;

  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, board: Piece[][]): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;
    let foobar: bar;

    if (this.color == Color.white) {
      testPos = new Position(initialPos.r - 1, initialPos.c - 1);
      foobar = foo(testPos, board, this.color);
      if (foobar == bar.enemy) {
        legalPos.push(testPos);
      } else if (foobar == bar.empty || foobar == bar.outOfBound || bar.friendly) {
        // do nothing;
      }

      testPos = new Position(initialPos.r - 1, initialPos.c + 1);
      foobar = foo(testPos, board, this.color);
      if (foobar == bar.enemy) {
        legalPos.push(testPos);
      } else if (foobar == bar.empty || foobar == bar.outOfBound || bar.friendly) {
        // do nothing;
      }

      for (let i = 1; i <= 2; i++) {
        testPos = new Position(initialPos.r - i, initialPos.c);
        foobar = foo(testPos, board, this.color);
        if (foobar == bar.empty) {
          if (i > 1 && this.hasMoved) {
            break;
          }
          legalPos.push(testPos);
        } else if (foobar == bar.enemy || foobar == bar.outOfBound || bar.friendly) {
          break;
        }
      }
    } else {
      testPos = new Position(initialPos.r + 1, initialPos.c - 1);
      foobar = foo(testPos, board, this.color);
      if (foobar == bar.enemy) {
        legalPos.push(testPos);
      } else if (foobar == bar.empty || foobar == bar.outOfBound || bar.friendly) {
        // do nothing;
      }

      testPos = new Position(initialPos.r + 1, initialPos.c + 1);
      foobar = foo(testPos, board, this.color);
      if (foobar == bar.enemy) {
        legalPos.push(testPos);
      } else if (foobar == bar.empty || foobar == bar.outOfBound || bar.friendly) {
        // do nothing;
      }

      for (let i = 1; i <= 2; i++) {
        testPos = new Position(initialPos.r + i, initialPos.c);
        foobar = foo(testPos, board, this.color);
        if (foobar == bar.empty) {
          if (i > 1 && this.hasMoved) {
            break;
          }
          legalPos.push(testPos);
        } else if (foobar == bar.enemy || foobar == bar.outOfBound || bar.friendly) {
          break;
        }
      }
    }

    // check en passant
    /* testPos = new Position(initialPos.r, initialPos.c - 1);
    let pieceInPos = board[testPos.c][testPos.r];
    if (pieceInPos.id == idOfLastMoved) {
      // do en passant
    } */

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, board: Piece[][]): boolean {
    return inPositions(this.getValidPositions(initialPos, board), intendedPos);
  }

  move(from: Position, to: Position, board: Piece[][]): Piece[][] {
    let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null

    this.onMove(from, to);

    return board;
  }
}

function validPos(position: Position, board: Piece[][], color: Color): boolean {
  if (!withinBound(position)) {
    return false;
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

function withinBound(position: Position): boolean {
  if ((position.r < 0 || position.r > 7 || position.c < 0 || position.c > 7)) {
    return false
  }

  return true;
}

function foo(position: Position, board: Piece[][], color: Color): bar {
  if (!withinBound(position)) {
    return bar.outOfBound;
  }

  if (board[position.r][position.c] && board[position.r][position.c].color == color) {
    return bar.friendly;
  }

  if (board[position.r][position.c] && board[position.r][position.c].color != color) {
    return bar.enemy;
  }

  return bar.empty;
}

enum bar {
  empty,
  enemy,
  outOfBound,
  friendly,
}

function baz(e: bar): string {
  switch (e) {
    case 0:
      return "empty";
    break;
    case 2:
      return "enemy";
    break;
    case 3:
      return "out of bound"
    break;
    case 4: 
      return "friendly";
    break;
  }
}
