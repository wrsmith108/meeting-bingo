import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types';
import { BingoCard } from './BingoCard';
import { Button } from './ui/Button';
import { generateShareText, copyToClipboard, canNativeShare, nativeShare } from '../lib/shareUtils';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const elapsed = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 60000)
    : 0;

  const handleShare = async () => {
    const text = generateShareText(game);
    if (canNativeShare()) {
      await nativeShare(game);
    } else {
      const success = await copyToClipboard(text);
      if (success) alert('Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-bounce-in">
          BINGO!
        </h1>

        {game.card && (
          <div className="mb-6">
            <BingoCard
              card={game.card}
              winningLine={game.winningLine}
              onSquareClick={() => {}}
            />
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <div>Time to BINGO: {elapsed} min</div>
          {game.winningWord && <div>Winning word: "{game.winningWord}"</div>}
          <div>Squares filled: {game.filledCount - 1}/24</div>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={handleShare}>Share Result</Button>
          <Button variant="secondary" onClick={onPlayAgain}>
            Play Again
          </Button>
        </div>

        <Button variant="ghost" onClick={onHome} className="mt-4">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
