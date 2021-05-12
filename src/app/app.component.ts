import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { concat, fromEvent } from 'rxjs';
import { allPieces } from './pieces';
import { Position } from './position';
import { Game } from './game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  game: Game;
  boardSize: number;
  @ViewChild('board') board: ElementRef;

  constructor() {
    this.game = new Game(allPieces);
  }

  ngAfterViewInit(): void {
    this.setBoardSize();
    fromEvent(window, 'resize').subscribe((evt: any) => {
      this.setBoardSize();
    });
  }

  private setBoardSize() {
    let offsetWidth = this.board.nativeElement.offsetWidth;
    this.board.nativeElement.style.height = `${offsetWidth}px`;
  }

  translate(r: number, c: number): string {
    return `translate(${c * 100}%, ${r * 100}%)`
  }

  onCellClick(r: number, c: number) {
    this.game.onCellClick(new Position(r, c));
  }

}
