"use client";

import { useEffect, useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const TOTAL = 10;

const QuizGame = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      setFinished(false);
      setScore(0);
      setCurrent(0);
      setSelected(null);

      const res = await fetch("/api/quiz", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data?.questions) {
        throw new Error("Quiz not loaded");
      }

      setQuestions(data.questions.slice(0, TOTAL));
    } catch (err) {
      console.error(err);
      setError("Quiz is not loaded ❌");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (selected === questions[current].answer) {
      setScore((s) => s + 1);
    }

    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  // ⏳ Loading
  if (loading) {
    return <p className="text-center mt-10">Loading quiz...</p>;
  }

  // ❌ Error UI
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-6">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={loadQuiz}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // 🎉 Finished
  if (finished) {
    return (
      <div className="max-w-xl mx-auto text-center p-6">
        <h2 className="text-2xl font-bold mb-3">Quiz Finished 🎉</h2>
        <p className="text-lg mb-4">
          Score: <b>{score}</b> / {questions.length}
        </p>
        <button
          onClick={loadQuiz}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Load New Quiz
        </button>
      </div>
    );
  }

  if (!questions.length) return null;

  const q = questions[current];

  return (
    <div className="max-w-xl mx-auto p-6">
      <h3 className="mb-2 font-semibold">
        Question {current + 1} / {questions.length}
      </h3>

      <p className="mb-4 text-lg">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(opt)}
            className={`w-full text-left px-4 py-2 border rounded
              ${
                selected === opt
                  ? "bg-green-100 border-green-500"
                  : "hover:bg-gray-50"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={nextQuestion}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {current + 1 === questions.length ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default QuizGame;
