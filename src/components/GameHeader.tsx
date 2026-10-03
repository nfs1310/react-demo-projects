import React from 'react'

const GameHeader = ({ scores, moves, onReset }: { scores: number; moves: number; onReset: () => void }) => {
    return (
        <div className="game-header">
            <h1>🎮 Memory Card Game</h1>

            <div className="stats">
                <div className="stat-item">
                    <span className="stat-label">Score:</span>{" "}
                    <span className="stat-value">{scores}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Moves:</span>{" "}
                    <span className="stat-value">{moves}</span>
                </div>
            </div>
            <div className="reset-btn" onClick={onReset}>Reset Game</div>
        </div>
    )
}

export default GameHeader
