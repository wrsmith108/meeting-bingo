import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';
import { useGame } from './hooks/useGame';

type Screen = 'landing' | 'category' | 'game' | 'win';

export default function App() {
  const { game, setGame, startGame, handleWin, resetGame } = useGame();
  const [screen, setScreen] = useState<Screen>(
    game.status === 'playing' ? 'game' :
    game.status === 'won' ? 'win' : 'landing'
  );

  return (
    <>
      {screen === 'landing' && (
        <LandingPage onStart={() => setScreen('category')} />
      )}
      {screen === 'category' && (
        <CategorySelect
          onSelect={(categoryId) => {
            startGame(categoryId);
            setScreen('game');
          }}
          onBack={() => setScreen('landing')}
        />
      )}
      {screen === 'game' && game.card && (
        <GameBoard
          game={game}
          setGame={setGame}
          onWin={(winningLine, winningWord) => {
            handleWin(winningLine, winningWord);
            setScreen('win');
          }}
        />
      )}
      {screen === 'win' && (
        <WinScreen
          game={game}
          onPlayAgain={() => setScreen('category')}
          onHome={() => {
            resetGame();
            setScreen('landing');
          }}
        />
      )}
    </>
  );
}
