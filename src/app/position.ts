export class Position {
  r: number;
  c: number;

  constructor(r: number, c: number) {
    this.r = r;
    this.c = c;
  }

  isEqual(pos: Position): boolean {
    return pos.r == this.r && pos.c == pos.c;
  }

  toString(): string {
    return JSON.stringify({r: this.r, c: this.c});
  }
}
