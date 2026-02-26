import { useCallback } from 'react';
import { CategoryId, GameState, WinningLine } from '../types';
import { generateCard } from '../lib/cardGenerator';
import { useLocalStorage } from './useLocalStorage';

const INITIAL_STATE: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export function useGame() {
  const [game, setGame] = useLocalStorage<GameState>('meeting-bingo-game', INITIAL_STATE);

  const startGame = useCallback((categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1,
    });
  }, [setGame]);

  const handleWin = useCallback((winningLine: WinningLine, winningWord: string) => {
    setGame(prev => ({
      ...prev,
      status: 'won',
      completedAt: Date.now(),
      winningLine,
      winningWord,
    }));
  }, [setGame]);

  const resetGame = useCallback(() => {
    setGame(INITIAL_STATE);
  }, [setGame]);

  return { game, setGame, startGame, handleWin, resetGame };
}
