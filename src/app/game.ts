import { Color } from "./color";
import { Piece } from "./piece";
import { Player } from "./player";
import { Position } from "./position";

export class Game {
  public lastMovedPieceId: number;
  public selected: Position; // todo:: rename to selectedPiece
  validMoves: Position[] = [];
  capturedPieces: Piece[] = [];

  public positions: Piece[][] = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  public players: Player[] = [
    new Player(Color.white, true),
    new Player(Color.black, false),
  ];

  constructor(private allPieces: Piece[]) {
    for (let piece of this.allPieces) {
      this.positions[piece.startingPosition.r][piece.startingPosition.c] = piece;
    }
  };
}
