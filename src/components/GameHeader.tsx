import React from 'react'

const GameHeader = ({ scores, moves }: { scores: number; moves: number }) => {
    return (
        <div className="game-header">
            <h1>🎮 Memory Card Game</h1>
            <div className="stats">
                <div className="stat-item">
                    <span className="stat-value">Scores</span>{" "}
                    <span className="stat-label">{scores}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">Moves</span>{" "}
                    <span className="stat-label">{moves}</span>
                </div>
            </div>
        </div>
    )
}

export default GameHeader
