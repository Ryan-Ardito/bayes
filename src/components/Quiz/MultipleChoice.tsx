import { useState } from "react";
import styles from "./Quiz.module.css";

interface Option {
  text: string;
  correct?: boolean;
}

interface Props {
  question: string;
  options: Option[];
  explanation: string;
}

export function MultipleChoice({ question, options, explanation }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizQuestion}>{question}</div>
      {options.map((opt, i) => {
        let className = styles.option;
        if (answered) {
          className += ` ${styles.optionDisabled}`;
          if (opt.correct) className += ` ${styles.optionCorrect}`;
          else if (i === selected) className += ` ${styles.optionIncorrect}`;
        }
        return (
          <button
            key={i}
            className={className}
            onClick={() => handleSelect(i)}
          >
            {opt.text}
          </button>
        );
      })}
      {answered && <div className={styles.explanation}>{explanation}</div>}
    </div>
  );
}
