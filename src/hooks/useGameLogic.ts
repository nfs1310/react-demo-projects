import { useEffect, useState } from "react";
import type CardType from "../interfaces/CardType";


const useGameLogic = ({ cardValues }: { cardValues: string[] }) => {
    const [cards, setCards] = useState<CardType[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<number[]>([]);
    const [scores, setScores] = useState<number>(0);
    const [moves, setMoves] = useState<number>(0);
    const [isLocked, setIsLocked] = useState<boolean>(false);

    const initializeCardGame = () => {
        const shuffleCards = [...cardValues].sort(() => Math.random() - 0.5);

        const shuffledCards = shuffleCards.map((value, index) => ({
            id: index,
            value,
            isFlipped: false,
            isMatched: false,
        }));
        setCards(shuffledCards);
        setScores(0);
        setMoves(0);
        setFlippedCards([]);
        setMatchedCards([]);
        setIsLocked(false);
    }

    useEffect(() => {
        initializeCardGame();
    }, []);

    const handleCardClick = (clickedCard: CardType) => {
        // Prevent flipping a card that is already flipped or matched
        if (clickedCard.isFlipped || clickedCard.isMatched || isLocked || flippedCards.length === 2) {
            return;
        }

        const newCards = cards.map((c) => {
            if (c.id === clickedCard.id) {
                return { ...c, isFlipped: true };
            }
            return c;
        });
        setCards(newCards);

        const newFlippedCards = [...flippedCards, clickedCard.id];
        setFlippedCards(newFlippedCards);

        if (flippedCards.length === 1) {
            setIsLocked(true);
            const firstCard = cards[flippedCards[0]];

            if (firstCard.value === clickedCard.value) {
                setTimeout(() => {
                    setMatchedCards((prev) => [...prev, firstCard.id, clickedCard.id]);
                    setScores((prev) => prev + 1);
                    setCards((prev) => prev.map((c) => {
                        if (c.id === clickedCard.id || c.id === firstCard.id) {
                            return { ...c, isMatched: true };
                        }
                        return c;
                    }));

                    setFlippedCards([]);
                    setIsLocked(false);
                }, 500);
            } else {
                setTimeout(() => {
                    const flippedBackCards = newCards.map((c) => {
                        if (newFlippedCards.includes(c.id)) {
                            return { ...c, isFlipped: false };
                        }
                        return c;
                    });
                    setCards(flippedBackCards);
                    setIsLocked(false);
                    setFlippedCards([]);
                }, 1000);
            }
            setMoves((prev) => prev + 1);
        }
    };

    const isGameWon = matchedCards.length === cards.length && cards.length > 0;

    return {
        cards,
        scores,
        moves,
        isGameWon,
        initializeCardGame,
        handleCardClick
    };
}

export default useGameLogic