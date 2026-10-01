
import React from 'react'

const Card = ({ card }: { card: any }) => {
    return (
        <div className="card">
            <div className='card-back'>
                {card}
            </div>
        </div>
    )
}

export default Card
