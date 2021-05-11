import { Position } from './position';
import { Color } from './color';
import { Game } from './game';

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

  abstract canMove(initialPos: Position, intendedPos: Position, game: Game): boolean;

  abstract getValidPositions(initialPos: Position, game: Game): Position[];

  abstract move(from: Position, to: Position, game: Game): Piece[][];

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

  canMove(initialPos: Position, intendedPos: Position, game: Game): boolean {
    return inPositions(this.getValidPositions(initialPos, game), intendedPos);
  }

  getValidPositions(initialPos: Position, game: Game): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    testPos = new Position(initialPos.r - 1, initialPos.c - 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c + 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c - 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r, initialPos.c + 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c - 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c + 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    return legalPos
  }

  move(from: Position, to: Position, game: Game): Piece[][] {
    /* let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null */

    switchBoardCellElemPos(game.positions, from, to)

    this.onMove(from, to);

    return game.positions;
  }

}

export class Queen extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, game: Game): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    let b = new Bishop(0, this.color, null);
    let bPos = b.getValidPositions(initialPos, game);
    let r = new Rook(0, this.color, null);
    let rPos = r.getValidPositions(initialPos, game);

    legalPos = bPos.concat(rPos);

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, game: Game): boolean {
    return inPositions(this.getValidPositions(initialPos, game), intendedPos);
  }

  move(from: Position, to: Position, game: Game): Piece[][] {
    /* let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null */

    switchBoardCellElemPos(game.positions, from, to)

    this.onMove(from, to);

    return game.positions;
  }
}

export class Rook extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, game: Game): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r, initialPos.c - i);
      let foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.empty) {
        legalPos.push(testPos);
      } else if (foobar == CellState.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == CellState.outOfBound || CellState.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r, initialPos.c + i);
      let foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.empty) {
        legalPos.push(testPos);
      } else if (foobar == CellState.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == CellState.outOfBound || CellState.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r - i, initialPos.c);
      let foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.empty) {
        legalPos.push(testPos);
      } else if (foobar == CellState.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == CellState.outOfBound || CellState.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r + i, initialPos.c);
      let foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.empty) {
        legalPos.push(testPos);
      } else if (foobar == CellState.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == CellState.outOfBound || CellState.friendly) {
        break;
      }
    }

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, game: Game): boolean {
    return inPositions(this.getValidPositions(initialPos, game), intendedPos);
  }

  move(from: Position, to: Position, game: Game): Piece[][] {
    /* let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null */

    switchBoardCellElemPos(game.positions, from, to)

    this.onMove(from, to);

    return game.positions;
  }
}

export class Knight extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, game: Game): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    testPos = new Position(initialPos.r - 2, initialPos.c - 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 2, initialPos.c + 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c - 2);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r - 1, initialPos.c + 2);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 2, initialPos.c + 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 2, initialPos.c - 1);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c + 2);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    testPos = new Position(initialPos.r + 1, initialPos.c - 2);
    if (validPos(testPos, game.positions, this.color)) {
      legalPos.push(testPos);
    }

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, game: Game): boolean {
    return inPositions(this.getValidPositions(initialPos, game), intendedPos);
  }

  move(from: Position, to: Position, game: Game): Piece[][] {
    /* let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null */

    switchBoardCellElemPos(game.positions, from, to)

    this.onMove(from, to);

    return game.positions;
  }
}

export class Bishop extends Piece {
  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, game: Game): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r - i, initialPos.c - i);
      let foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.empty) {
        legalPos.push(testPos);
      } else if (foobar == CellState.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == CellState.outOfBound || CellState.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r - i, initialPos.c + i);
      let foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.empty) {
        legalPos.push(testPos);
      } else if (foobar == CellState.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == CellState.outOfBound || CellState.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r + i, initialPos.c - i);
      let foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.empty) {
        legalPos.push(testPos);
      } else if (foobar == CellState.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == CellState.outOfBound || CellState.friendly) {
        break;
      }
    }

    for (let i = 1; i <= 8; i++) {
      testPos = new Position(initialPos.r + i, initialPos.c + i);
      let foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.empty) {
        legalPos.push(testPos);
      } else if (foobar == CellState.enemy) {
        legalPos.push(testPos);
        break;
      } else if (foobar == CellState.outOfBound || CellState.friendly) {
        break;
      }
    }

    return legalPos;
  }

  canMove(initialPos: Position, intendedPos: Position, game: Game): boolean {
    return inPositions(this.getValidPositions(initialPos, game), intendedPos);
  }

  move(from: Position, to: Position, game: Game): Piece[][] {
    /* let p1 = board[from.r][from.c];
    let p2 = board[to.r][to.c];
    board[to.r][to.c] = p1;
    board[from.r][from.c] = p2; // p2 is null */

    switchBoardCellElemPos(game.positions, from, to)

    this.onMove(from, to);

    return game.positions;
  }
}

export class Pawn extends Piece {
  hasMoved: boolean = false;
  moveTwiceInFirstMove: boolean = false;

  constructor(id: number, color: Color, startingPosition: Position) {
    super(id, color, startingPosition)
  }

  getValidPositions(initialPos: Position, game: Game): Position[] {
    let legalPos: Position[] = [];
    let testPos: Position;
    let foobar: CellState;

    if (this.color == Color.white) {
      testPos = new Position(initialPos.r - 1, initialPos.c - 1);
      foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.enemy) {
        legalPos.push(testPos);
      } else if (foobar == CellState.empty || foobar == CellState.outOfBound || CellState.friendly) {
        // do nothing;
      }

      testPos = new Position(initialPos.r - 1, initialPos.c + 1);
      foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.enemy) {
        legalPos.push(testPos);
      } else if (foobar == CellState.empty || foobar == CellState.outOfBound || CellState.friendly) {
        // do nothing;
      }

      for (let i = 1; i <= 2; i++) {
        testPos = new Position(initialPos.r - i, initialPos.c);
        foobar = getCellState(testPos, game.positions, this.color);
        if (foobar == CellState.empty) {
          if (i > 1 && this.hasMoved) {
            break;
          }
          legalPos.push(testPos);
        } else if (foobar == CellState.enemy || foobar == CellState.outOfBound || CellState.friendly) {
          break;
        }
      }
    } else {
      testPos = new Position(initialPos.r + 1, initialPos.c - 1);
      foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.enemy) {
        legalPos.push(testPos);
      } else if (foobar == CellState.empty || foobar == CellState.outOfBound || CellState.friendly) {
        // do nothing;
      }

      testPos = new Position(initialPos.r + 1, initialPos.c + 1);
      foobar = getCellState(testPos, game.positions, this.color);
      if (foobar == CellState.enemy) {
        legalPos.push(testPos);
      } else if (foobar == CellState.empty || foobar == CellState.outOfBound || CellState.friendly) {
        // do nothing;
      }

      for (let i = 1; i <= 2; i++) {
        testPos = new Position(initialPos.r + i, initialPos.c);
        foobar = getCellState(testPos, game.positions, this.color);
        if (foobar == CellState.empty) {
          if (i > 1 && this.hasMoved) {
            break;
          }
          legalPos.push(testPos);
        } else if (foobar == CellState.enemy || foobar == CellState.outOfBound || CellState.friendly) {
          break;
        }
      }
    }

    // check en passant
    /* testPos = new Position(initialPos.r, initialPos.c - 1);
    let pieceInPos = game.positions[testPos.c][testPos.r];
    if (pieceInPos && withinBound(testPos) && pieceInPos instanceof Pawn && pieceInPos.id == game.lastMovedPieceId) {
      if (this.color == Color.white) {
        legalPos.push(new Position(testPos.r -1, testPos.c));
      } else {
        legalPos.push(new Position(testPos.r + 1, testPos.c));
      }
    }

    testPos = new Position(initialPos.r, initialPos.c + 1);

    pieceInPos = game.positions[testPos.r][testPos.c];
    if (pieceInPos && withinBound(testPos) && pieceInPos instanceof Pawn && pieceInPos.id == game.lastMovedPieceId) {
      if (this.color == Color.white) {
        legalPos.push(new Position(testPos.r -1, testPos.c));
      } else {
        legalPos.push(new Position(testPos.r + 1, testPos.c));
      }
    } */

    let enPassanePos = this.enPassantPos(initialPos, game);
    if (enPassanePos) {
      legalPos.push(enPassanePos);
    }

    return legalPos;
  }

  enPassantPos(currentPos: Position, game: Game): Position {
    let legalPos: Position;
    let testPos: Position;
    let pieceInPos: Piece;

    testPos = new Position(currentPos.r, currentPos.c - 1);
    if (withinBound(testPos)) {
      pieceInPos = game.positions[testPos.r][testPos.c];
      if (pieceInPos && pieceInPos instanceof Pawn && pieceInPos.id == game.lastMovedPieceId) {

        if (this.color == Color.white) {
          legalPos = new Position(testPos.r -1, testPos.c);
        } else {
          legalPos = new Position(testPos.r + 1, testPos.c);
        }
        return legalPos;
      }
    }
    
    testPos = new Position(currentPos.r, currentPos.c + 1);
    if (withinBound(testPos)) {
      pieceInPos = game.positions[testPos.r][testPos.c];
      if (pieceInPos && withinBound(testPos) && pieceInPos instanceof Pawn && pieceInPos.id == game.lastMovedPieceId) {
        if (this.color == Color.white) {
          legalPos = new Position(testPos.r -1, testPos.c);
        } else {
          legalPos = new Position(testPos.r + 1, testPos.c);
        }
        return legalPos;
      }
    }

    return null;
  }

  canMove(initialPos: Position, intendedPos: Position, game: Game): boolean {
    return inPositions(this.getValidPositions(initialPos, game), intendedPos);
  }

  move(from: Position, to: Position, game: Game): Piece[][] {
    const lastMovedPieceId = game.positions[from.r][from.c].id;
    let enPassanePos = this.enPassantPos(from, game);

    if (enPassanePos && to.isEqual(enPassanePos)) {
      switchBoardCellElemPos(game.positions, from, to);
      game.capturedPieces.push(game.positions[from.r][to.c]);
      game.positions[from.r][to.c] = null;
    } else {
      switchBoardCellElemPos(game.positions, from, to);
    }

    this.onMove(from, to);

    game.lastMovedPieceId = lastMovedPieceId;

    return game.positions;
  }
}

// returns only if position is within bound and a if a friendly piece is not occupying
// that position 
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

// returns true only if position is contained in positions array
function inPositions(positions: Position[], position: Position): boolean {
  for (let pos of positions) {
    if (pos.r == position.r && pos.c == position.c) {
      return true
    }
  }

  return false;
}

// returns true only if position.r and position.c are actual positions inside the board
// e.g. 
//  {r: 4, c: 6} => true
//  {r: -1, c: 6} => false
function withinBound(position: Position): boolean {
  if ((position.r < 0 || position.r > 7 || position.c < 0 || position.c > 7)) {
    return false
  }

  return true;
}

// returns state of a particular position on the board
function getCellState(position: Position, board: Piece[][], color: Color): CellState {
  if (!withinBound(position)) {
    return CellState.outOfBound;
  }

  if (board[position.r][position.c] && board[position.r][position.c].color == color) {
    return CellState.friendly;
  }

  if (board[position.r][position.c] && board[position.r][position.c].color != color) {
    return CellState.enemy;
  }

  return CellState.empty;
}

enum CellState {
  empty,
  enemy,
  outOfBound,
  friendly,
}

// exchanges positions of 2 elements on the board (2D-array)
function switchBoardCellElemPos(board: Piece[][], pos1: Position, pos2: Position) {
  let pos1Elem = board[pos1.r][pos1.c];
  board[pos1.r][pos1.c] = null;

  let pos2Elem = board[pos2.r][pos2.c];
  board[pos2.r][pos2.c] = null;


  board[pos1.r][pos1.c] = pos2Elem;
  board[pos2.r][pos2.c] = pos1Elem;
}
