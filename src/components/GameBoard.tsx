import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState, Toast as ToastType } from '../types';
import { BingoCard } from './BingoCard';
import { TranscriptPanel } from './TranscriptPanel';
import { GameControls } from './GameControls';
import { ToastContainer } from './ui/Toast';
import { generateCard } from '../lib/cardGenerator';
import { checkForBingo, countFilled } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface Props {
  game: GameState;
  setGame: React.Dispatch<React.SetStateAction<GameState>>;
  onWin: (winningLine: NonNullable<GameState['winningLine']>, winningWord: string) => void;
}

export function GameBoard({ game, setGame, onWin }: Props) {
  const speech = useSpeechRecognition();
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType['type'] = 'info') => {
    const id = String(++toastIdRef.current);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (!game.card || game.status === 'won') return;

    setGame(prev => {
      if (!prev.card) return prev;
      const square = prev.card.squares[row][col];
      if (square.isFreeSpace) return prev;

      const newSquares = prev.card.squares.map((r, ri) =>
        r.map((s, ci) =>
          ri === row && ci === col
            ? { ...s, isFilled: !s.isFilled, filledAt: !s.isFilled ? Date.now() : null }
            : s
        )
      );

      const newCard = { ...prev.card, squares: newSquares };
      const winningLine = checkForBingo(newCard);

      if (winningLine) {
        onWin(winningLine, square.word);
      }

      return {
        ...prev,
        card: newCard,
        filledCount: countFilled(newCard),
        ...(winningLine ? { status: 'won' as const, winningLine, winningWord: square.word, completedAt: Date.now() } : {}),
      };
    });
  }, [game.card, game.status, setGame, onWin]);

  // Handle speech results
  useEffect(() => {
    if (!speech.isListening || !game.card || game.status === 'won') return;

    const alreadyFilled = new Set(
      game.card.squares.flat()
        .filter(sq => sq.isFilled && !sq.isFreeSpace)
        .map(sq => sq.word.toLowerCase())
    );

    const newDetected = detectWordsWithAliases(
      speech.transcript,
      game.card.words,
      alreadyFilled,
    );

    if (newDetected.length > 0) {
      setDetectedWords(prev => [...prev, ...newDetected]);

      for (const word of newDetected) {
        addToast(`Detected: "${word}"`, 'success');

        // Auto-fill the matching square
        setGame(prev => {
          if (!prev.card) return prev;
          const newSquares = prev.card.squares.map(r =>
            r.map(s =>
              s.word.toLowerCase() === word.toLowerCase() && !s.isFilled
                ? { ...s, isFilled: true, isAutoFilled: true, filledAt: Date.now() }
                : s
            )
          );
          const newCard = { ...prev.card, squares: newSquares };
          const winningLine = checkForBingo(newCard);

          if (winningLine) {
            onWin(winningLine, word);
          }

          return {
            ...prev,
            card: newCard,
            filledCount: countFilled(newCard),
            ...(winningLine ? { status: 'won' as const, winningLine, winningWord: word, completedAt: Date.now() } : {}),
          };
        });
      }
    }
  }, [speech.transcript, speech.isListening, game.card, game.status, setGame, onWin, addToast]);

  const handleToggleListening = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
      setGame(prev => ({ ...prev, isListening: false }));
    } else {
      speech.startListening();
      setGame(prev => ({ ...prev, isListening: true }));
    }
  }, [speech, setGame]);

  const handleNewCard = useCallback(() => {
    if (!game.category) return;
    speech.stopListening();
    speech.resetTranscript();
    setDetectedWords([]);
    const card = generateCard(game.category);
    setGame(prev => ({
      ...prev,
      card,
      status: 'playing',
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1,
    }));
  }, [game.category, speech, setGame]);

  if (!game.card) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Meeting Bingo</h1>
          <span className="text-sm text-gray-500">
            {game.filledCount - 1}/24 filled
          </span>
        </div>

        <BingoCard
          card={game.card}
          winningLine={game.winningLine}
          onSquareClick={handleSquareClick}
        />

        {!speech.isSupported && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            Speech recognition is not supported in this browser. You can still play manually by tapping squares.
          </div>
        )}

        {speech.isSupported && (
          <TranscriptPanel
            transcript={speech.transcript}
            interimTranscript={speech.interimTranscript}
            detectedWords={detectedWords}
            isListening={speech.isListening}
          />
        )}

        <GameControls
          isListening={speech.isListening}
          isSpeechSupported={speech.isSupported}
          onToggleListening={handleToggleListening}
          onNewCard={handleNewCard}
          onBack={() => {
            speech.stopListening();
            window.location.reload();
          }}
        />
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
