import { Button } from './ui/Button';

interface Props {
  isListening: boolean;
  isSpeechSupported: boolean;
  onToggleListening: () => void;
  onNewCard: () => void;
  onBack: () => void;
}

export function GameControls({
  isListening,
  isSpeechSupported,
  onToggleListening,
  onNewCard,
  onBack,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      {isSpeechSupported && (
        <Button
          variant={isListening ? 'primary' : 'secondary'}
          onClick={onToggleListening}
        >
          {isListening ? '⏹️ Stop Listening' : '🎤 Start Listening'}
        </Button>
      )}
      <Button variant="secondary" onClick={onNewCard}>
        🔄 New Card
      </Button>
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>
    </div>
  );
}
