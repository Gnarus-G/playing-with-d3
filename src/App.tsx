import ForceBubbles from "./ForceBubbles";
import "./App.css";
import ForceBubblesAlternate from "./ForceBubblesAlternate";

export default function App() {
  return (
    <div className="App">
      <ForceBubblesAlternate width={1000} height={500} />
      <ForceBubbles width={1000} height={500} />
    </div>
  );
}
