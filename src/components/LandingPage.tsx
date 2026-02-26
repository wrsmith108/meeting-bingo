import { Button } from './ui/Button';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Meeting Bingo</h1>
        <p className="text-lg text-gray-600 mb-2">Turn any meeting into a game.</p>
        <p className="text-sm text-gray-500 mb-8">
          Auto-detects buzzwords using speech recognition!
        </p>

        <Button onClick={onStart} className="text-lg px-8 py-3">
          New Game
        </Button>

        <p className="text-xs text-gray-400 mt-6">
          Audio processed locally. Never recorded.
        </p>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">How It Works</h2>
          <div className="grid grid-cols-2 gap-4 text-left text-sm text-gray-600">
            <div>1. Pick a buzzword category</div>
            <div>2. Enable microphone</div>
            <div>3. Join your meeting</div>
            <div>4. Watch squares fill!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
