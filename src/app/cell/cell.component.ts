import { Component, OnInit, Input } from '@angular/core';
import { Color } from '../color';
import { trigger, transition, style, animate } from '@angular/animations';
import { moveAnimation } from '../move-animation'

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  animations: [moveAnimation]
})
export class CellComponent implements OnInit {
  @Input() empty: boolean;
  @Input() row: number;
  @Input() col: number;
  @Input() pieceName: number;
  @Input() colorName: string;

  constructor() { }

  ngOnInit(): void {
  }

  get assetName(): string {
    return `/assets/images/pieces/${this.pieceName}-${this.colorName}.svg`;
  }

  get translate(): string {
    return `translate(${this.col * 100}%, ${this.row * 100}%)`
  }

}
