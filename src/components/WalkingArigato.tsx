export default function WalkingArigato() {
 
  const text = "ARIGATO";
  const letters = text.split("");

  return (
    <div className="walking-text-container">
      {letters.map((char, index) => (
        <span
          key={index}
          className="walking-letter"
          
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}