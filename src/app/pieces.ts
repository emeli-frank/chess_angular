import {} from './app.component'
import { Position } from './position'
import { King, Queen, Piece, Rook, Knight, Bishop, Pawn } from './piece'
import { Color } from './color'

export const allPieces: Piece[] = [
  new King(1, Color.black, new Position(0, 4)),
  new Queen(2, Color.black, new Position(0, 3)),
  new Rook(3, Color.black, new Position(0, 0)),
  new Rook(4, Color.black, new Position(0, 7)),
  new Knight(5, Color.black, new Position(0, 1)),
  new Knight(6, Color.black, new Position(0, 6)),
  new Bishop(7, Color.black, new Position(0, 2)),
  new Bishop(8, Color.black, new Position(0, 5)),
  new Pawn(9, Color.black, new Position(1, 0)),
  new Pawn(10, Color.black, new Position(1, 1)),
  new Pawn(11, Color.black, new Position(1, 2)),
  new Pawn(12, Color.black, new Position(1, 3)),
  new Pawn(13, Color.black, new Position(1, 4)),
  new Pawn(14, Color.black, new Position(1, 5)),
  new Pawn(15, Color.black, new Position(1, 6)),
  new Pawn(16, Color.black, new Position(1, 7)),

  new King(17, Color.white, new Position(7, 4)),
  new Queen(18, Color.white, new Position(7, 3)),
  new Rook(19, Color.white, new Position(7, 0)),
  new Rook(20, Color.white, new Position(7, 7)),
  new Knight(21, Color.white, new Position(7, 1)),
  new Knight(22, Color.white, new Position(7, 6)),
  new Bishop(23, Color.white, new Position(7, 2)),
  new Bishop(24, Color.white, new Position(7, 5)),
  new Pawn(25, Color.white, new Position(6, 0)),
  new Pawn(26, Color.white, new Position(6, 1)),
  new Pawn(27, Color.white, new Position(6, 2)),
  new Pawn(28, Color.white, new Position(6, 3)),
  new Pawn(29, Color.white, new Position(6, 4)),
  new Pawn(30, Color.white, new Position(6, 5)),
  new Pawn(31, Color.white, new Position(6, 6)),
  new Pawn(32, Color.white, new Position(6, 7)),
]
