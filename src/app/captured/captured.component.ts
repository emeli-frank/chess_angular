import { Component, OnInit, Input } from '@angular/core';
import { Piece } from '../piece';
import { Color } from '../color';

@Component({
  selector: 'app-captured',
  templateUrl: './captured.component.html',
  styleUrls: ['./captured.component.scss']
})
export class CapturedComponent implements OnInit {
  private _captured: Piece[] = [];
  @Input() type: Color;

  @Input() 
  set captured(captured: Piece[]) {
    this._captured = captured
  }

  get captured(): Piece[] { 
    let pieces: Piece[] = [];
    for (let piece of this._captured) {
      if (piece.color == this.type) {
        continue;
      }

      pieces.push(piece);
    }

    return pieces;
  }

  ngOnInit(): void {
  }

  assetName(piece: Piece): string {
    console.warn("type", this.type);
    let colorName: string = (piece.color == Color.white) ? 'white' : 'black';
    return `/assets/images/pieces/${piece.name}-${colorName}.svg`;
  }

}
