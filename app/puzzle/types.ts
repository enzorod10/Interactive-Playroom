import * as PIXI from "pixi.js";

export interface Piece{
    texture: PIXI.Texture;
    correctPosition: { row: number, col: number };
    currentPosition: { row: number, col: number };
}