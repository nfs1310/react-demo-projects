import { useEffect, useState } from "react";
import Card from "./components/Card";
import GameHeader from "./components/GameHeader";
import type CardType from "./interfaces/CardType";

const cardValues = [
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
];

function App() {
  const [cards, setCards] = useState<CardType[]>([]);

  const initializeCardGame = () => {
    // const shuffledCards = [...cardValues].sort(() => Math.random() - 0.5);
    // setCards(shuffledCards);
    const shuffledCards = cardValues.map((value, index) => ({
      id: index,
      value, 
      isFlipped: false,
      isMatched: false,
    }));
    setCards(shuffledCards);
  }

  useEffect(() => {
    initializeCardGame();
  }, []);

  const handleCardClick = (clickedCard: CardType) => {
    // Prevent flipping a card that is already flipped or matched
    if (clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    // Flip the clicked card
    const updatedCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);
  };

  return (
    <div className="app">
      <GameHeader scores={0} moves={0} />
      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
