import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Feedback() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [state, setState] = useState(false);

  const fetchData = async () => {
    if (id === undefined || null) {
      return;
    }

    let response = await fetch(
      `http://localhost:8080/api/questions/get-all-questions-by-participant-id/${id}`
    );
    let data = await response.json();
    setState(true);
    console.log(data);
    setQuestions(data);
  };

  useEffect(() => {
    const { id } = router.query;
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Give feedback</h1>
      <h1>Give feedback</h1>

      <div>
        {questions.map((question) => {
          <span>{question.question}</span>;
        })}
      </div>
    </div>
  );
}

export default Feedback;
