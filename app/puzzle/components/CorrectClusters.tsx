import { Graphics } from '@pixi/react';
import * as PIXI from "pixi.js";
import { Piece } from "../types";

const CorrectClusters = ({ pieces, pieceWidth, pieceHeight }: { pieces: Piece[], pieceWidth: number, pieceHeight: number }) => {
    const getCorrectClusters = () => {
        const correctClusters: Piece[][] = [];
        const visited = new Set(); 
    
        const areAdjacent = (piece1: Piece, piece2: Piece) => {
            const { row: row1, col: col1 } = piece1.currentPosition;
            const { row: row2, col: col2 } = piece2.currentPosition;
    

            return (row1 === row2 && Math.abs(col1 - col2) === 1) ||
                   (col1 === col2 && Math.abs(row1 - row2) === 1);
        };
    
        const dfs = (piece: Piece, cluster: Piece[]) => {
            visited.add(piece);
            cluster.push(piece);
    
            pieces.forEach(nextPiece => {
                if (!visited.has(nextPiece) && nextPiece.currentPosition.row === nextPiece.correctPosition.row && nextPiece.currentPosition.col === nextPiece.correctPosition.col && areAdjacent(piece, nextPiece)) {
                    dfs(nextPiece, cluster);
                }
            });
        };
    
        pieces.forEach(piece => {
            if (!visited.has(piece) && piece.currentPosition.row === piece.correctPosition.row && piece.currentPosition.col === piece.correctPosition.col) {
                const cluster: Piece[] = [];
                dfs(piece, cluster);
                correctClusters.push(cluster);
            }
        });
    
        return correctClusters;
    };

    const drawClusterBorders = (g: PIXI.Graphics, clusters: Piece[][]) => {
        g.clear();
        g.lineStyle(2, 0xACFFAC, 1); // Green border
        g.zIndex = 10;
    
        clusters.forEach(cluster => {
            cluster.forEach(piece => {
                const { col, row } = piece.currentPosition;
    
                // Check which sides of the piece need borders
                const topPiece = cluster.find(p => p.currentPosition.row === row - 1 && p.currentPosition.col === col);
                const bottomPiece = cluster.find(p => p.currentPosition.row === row + 1 && p.currentPosition.col === col);
                const leftPiece = cluster.find(p => p.currentPosition.col === col - 1 && p.currentPosition.row === row);
                const rightPiece = cluster.find(p => p.currentPosition.col === col + 1 && p.currentPosition.row === row);
    
                const x = col * pieceWidth;
                const y = row * pieceHeight;
    
                g.moveTo(x, y);
    
                if (!topPiece) {
                    g.lineTo(x + pieceWidth, y);
                } else {
                    g.moveTo(x + pieceWidth, y);
                }
    
                if (!rightPiece) {
                    g.lineTo(x + pieceWidth, y + pieceHeight);
                } else {
                    g.moveTo(x + pieceWidth, y + pieceHeight);
                }
    
                if (!bottomPiece) {
                    g.lineTo(x, y + pieceHeight);
                } else {
                    g.moveTo(x, y + pieceHeight);
                }
    
                if (!leftPiece) {
                    g.lineTo(x, y);
                }
            });
        });
    
        g.endFill();
    };

  return (
    <Graphics draw={(g) => drawClusterBorders(g, getCorrectClusters())}/>
  )
};

export default CorrectClusters;