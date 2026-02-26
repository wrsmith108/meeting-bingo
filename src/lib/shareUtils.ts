import { BingoCard, GameState } from '../types';

export function generateShareText(game: GameState): string {
  if (!game.card) return '';

  const elapsed = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 60000)
    : 0;

  const grid = game.card.squares
    .map(row =>
      row.map(sq => {
        if (sq.isFreeSpace) return '⭐';
        if (sq.isFilled) return '🟦';
        return '⬜';
      }).join('')
    )
    .join('\n');

  return [
    '🎯 Meeting Bingo!',
    '',
    grid,
    '',
    `⏱️ ${elapsed} min | 📊 ${game.filledCount}/24 squares`,
    game.winningWord ? `🏆 Winning word: "${game.winningWord}"` : '',
    '',
    'Play at meetingbingo.vercel.app',
  ].filter(Boolean).join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function canNativeShare(): boolean {
  return !!navigator.share;
}

export async function nativeShare(game: GameState): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share({
      title: 'Meeting Bingo',
      text: generateShareText(game),
    });
    return true;
  } catch {
    return false;
  }
}

export function getCardEmoji(card: BingoCard): string {
  return card.squares
    .map(row =>
      row.map(sq => {
        if (sq.isFreeSpace) return '⭐';
        if (sq.isFilled) return '🟦';
        return '⬜';
      }).join('')
    )
    .join('\n');
}
