import * as PIXI from "pixi.js";
import { Piece } from "./types";

export const sliceImage = async (imageUrl: string, pieceDimensions: { width: number, height: number }, rowsAndCols: number) => {
    if (!imageUrl || pieceDimensions.height <= 0) return [];
    const pieceWidth = pieceDimensions.width;
    const pieceHeight = pieceDimensions.height;

    try {
        const texture = await PIXI.Texture.fromURL(imageUrl);
        const pieces: Piece[] = [];

        for (let row = 0; row < rowsAndCols; row++) {
            for (let col = 0; col < rowsAndCols; col++) {
                if (col * pieceWidth + pieceWidth > texture.width || row * pieceHeight + pieceHeight > texture.height) {
                    console.error(`Piece ${row}-${col} exceeds texture dimensions`);
                    continue;
                }

                const pieceTexture = new PIXI.Texture(
                    texture.baseTexture,
                    new PIXI.Rectangle(
                        col * pieceWidth,
                        row * pieceHeight,
                        pieceWidth,
                        pieceHeight
                    )
                );
                pieces.push({
                    texture: pieceTexture,
                    currentPosition: { row, col },
                    correctPosition: { row, col },
                });
            }
        }
        return pieces;
    } catch (error) {
        console.error("Error loading texture:", error);
        return [];
    }
}