import type CardType from "../interfaces/CardType"

const Card = ({ card, onClick }: { card: CardType; onClick: (card: CardType) => void }) => {
    return (
        <div className={`card ${card.isFlipped ? "flipped" : ""}`} onClick={() => onClick(card)}>
            <div className='card-front'>
                ?
            </div>
            <div className='card-back'>
                {card.value}
            </div>
        </div>
    )
}

export default Card
