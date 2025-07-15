import './phunsuong.css';

export default function PhunSuong({ isMisting }) {
  return (
    <div className="mist-container">
      <div className="sprayer">🧴</div>

      {isMisting && (
        <>
          <div className="spray-jet jet1" />
          <div className="spray-jet jet2" />
          <div className="spray-jet jet3" />
        </>
      )}

      <div className="mushroom1">🍄</div>     
      <div className="mushroom2">🍄</div>
      <div className="mushroom3">🍄</div>
      <div className="mushroom4">🍄</div>

    </div>
  );
}
