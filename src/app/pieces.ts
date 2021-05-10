import {} from './app.component'
import { Position } from './position'
import { King, Queen, Piece, Rook, Knight, Bishop, Pawn } from './piece'
import { Color } from './color'

export const allPieces: Piece[] = [
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