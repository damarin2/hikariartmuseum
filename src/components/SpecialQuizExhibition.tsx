// src/components/SpecialQuizExhibition.tsx
import { useState } from "react";
import { specialExhibitionQuizzes } from "../data/quizzes";

export default function SpecialQuizExhibition() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const quiz = specialExhibitionQuizzes[currentIndex];

  const handleAnswer = (choice: string) => {
    alert(
      choice === quiz.correctAnswer
        ? "🎉 正解！"
        : "❌ ちがうよ〜"
    );
  };

  const nextQuiz = () => {
    if (currentIndex < specialExhibitionQuizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("全問終了！おつかれさま！");
    }
  };

  return (
    <div className="quiz-exhibition">
      <h2>🎨 ひかりのクイズ企画展</h2>

      <div className="quiz-card">
        <img src={quiz.imageUrl} alt="quiz" className="quiz-image" />

        <h3 className="quiz-question">{quiz.question}</h3>

        <div className="quiz-choices">
          {quiz.choices.map((choice) => (
            <button
              key={choice}
              className="quiz-choice-btn"
              onClick={() => handleAnswer(choice)}
            >
              {choice}
            </button>
          ))}
        </div>

        <p className="quiz-explanation">{quiz.explanation}</p>

        <button className="quiz-next-btn" onClick={nextQuiz}>
          次のクイズへ ➡️
        </button>
      </div>
    </div>
  );
}
