const WinMessage = ({ moves }: { moves: number }) => {
  return (
    <div className="win-message">
      <h2>Congratulations!</h2>
      <p>You won the game in {moves} moves!</p>
    </div>
  );
};

export default WinMessage;
