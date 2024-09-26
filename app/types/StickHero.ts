export interface Platform {
    x: number;
    width: number;
  }
  
export interface Position {
    x: number;
    y: number;
  }
  
export interface Score {
    total: number;
    bonusStreak: number;
  }
  
export interface BonusText {
    show: boolean;
    amount: number;
  }
  
export type GameState = 'waiting' | 'growing' | 'rotating' | 'moving';