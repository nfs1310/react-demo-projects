import Card from "./components/Card";
import GameHeader from "./components/GameHeader";

function App() {
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
  return (
    <div className="app">
      <GameHeader scores={0} moves={0} />
      <div className="cards-grid">
        {cardValues.map((value, index) => (
          // <div key={index} className="card">
          //   {value}
          // </div>
          <Card card={value} />
        ))}
      </div>
    </div>
  );
}

export default App;
