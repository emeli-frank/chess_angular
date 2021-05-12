import { Color } from "./color";
import { Piece } from "./piece";
import { Player } from "./player";
import { Position } from "./position";

export class Game {
  public lastMovedPieceId: number;
  public selectedPosition: Position; // todo:: rename to selectedPiece
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

  get selectedPiece(): Piece { return this.selectedPosition ? this.positions[this.selectedPosition.r][this.selectedPosition.c] : null }

  constructor(private allPieces: Piece[]) {
    for (let piece of this.allPieces) {
      this.positions[piece.startingPosition.r][piece.startingPosition.c] = piece;
    }
  };

  getCell(r: number, c: number): Piece { // can be Piece or null
    return this.positions[r][c];
  }

  switchBoardCellElemPos(pos1: Position, pos2: Position) {
    let pos1Elem = this.positions[pos1.r][pos1.c];
    this.positions[pos1.r][pos1.c] = null;
  
    let pos2Elem = this.positions[pos2.r][pos2.c];
    this.positions[pos2.r][pos2.c] = null;
  
  
    this.positions[pos1.r][pos1.c] = pos2Elem;
    this.positions[pos2.r][pos2.c] = pos1Elem;
  }
  
  clearSelectionAndMoveHint() {
    this.selectedPosition = null;
    this.validMoves = [];
  }

  onCellClick(pos: Position) {
    const piece = this.getCell(pos.r, pos.c);
    if (piece) { // clicked cell contains a piece
      if (this.players[piece.color].hasTurn) { // piece clicked belongs to player with turn
        const selectedPiece = this.selectedPiece;
        if (selectedPiece) { // a piece previously sleected
          if (selectedPiece == piece) { // selected piece was clicked again
            this.clearSelectionAndMoveHint(); // clear selection and legal moves
          } else {
            this.clearSelectionAndMoveHint(); // cear selection and legal moves
            this.selectedPosition = pos;
            this.validMoves = piece.getValidPositions(pos, this); // select piece and show legal moves
          }
        } else { // no piece previously selected
          // selecte pice and show legal moves
            this.selectedPosition = pos;
            this.validMoves = piece.getValidPositions(pos, this); // select piece and show legal moves
        }
      } else { // opponents piece clicked, a capture should be intented
        if (this.selectedPosition) {
          const pieceToMove = this.getCell(this.selectedPosition.r, this.selectedPosition.c);
          if (!pieceToMove.canMove(this.selectedPosition, pos, this)) { // if move is invalid
            this.clearSelectionAndMoveHint();
            return;
          }
          pieceToMove.move(this.selectedPosition, pos, this);
          this.clearSelectionAndMoveHint();
          this.togglePlayerTurn();
        } else {
          return; // do nothing
        }
      }
    } else { // cell does not contain a piece
      const selectedPiece = this.selectedPiece;
      if (!selectedPiece) {
        return; // do nothing
      } else { // a piece was previously selected
        if (!selectedPiece.canMove(this.selectedPosition, pos, this)) { // if move is invalid
          this.clearSelectionAndMoveHint();
          return;
        } else { // move from this.selected to pos is valid
          selectedPiece.move(this.selectedPosition, pos, this); // move piece
          this.togglePlayerTurn();
          this.clearSelectionAndMoveHint();
        }
      }
    }
  }

  capture(captorsPos: Position, capturedPos: Position) {
    this.capturedPieces.push(this.getCell(capturedPos.r, capturedPos.c));
    this.positions[capturedPos.r][capturedPos.c] = this.getCell(captorsPos.r, captorsPos.c);
    this.positions[captorsPos.r][captorsPos.c] = null;
  }

  togglePlayerTurn() {
    this.players[0].hasTurn = !this.players[0].hasTurn;
    this.players[1].hasTurn = !this.players[1].hasTurn;
  }
}
