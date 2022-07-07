import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserState } from '../../atoms/atoms';
import { AttentionSeeker, Fade } from 'react-awesome-reveal';
import Back from '../../components/Back';

function Feedback() {
  const router = useRouter();
  const { id } = router.query;
  const [questionState, setQuestionState] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');

  const fetchData = () => {
    if (id === undefined || id === null) {
      return;
    }
    let response = fetch(
      `http://localhost:8080/api/questions/get-all-questions-by-participant-id/${id}`
    ).then((res) =>
      res.json().then((data) => {
        console.log(data);
        setQuestionState(data);
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  });

  const handleFeedback = async (questionId) => {
    if (feedbackText.length < 5) {
      return;
    }
    let response = await fetch(
      `http://localhost:8080/api/questions/add-feedback/${questionId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: feedbackText,
      }
    );
    setFeedbackText('');
  };

  if (!questionState || questionState === undefined || questionState === null) {
    return (
      <div>
        <Back routePath="/user" />
        Loading
      </div>
    );
  } else {
    return (
      <div className="h-screen bg-cyan-900 bg-gradient-to-b p-10 flex flex-col gap-10 ">
        <span className=" absolute right-5 top-5">
          <Back routePath="/user" />
        </span>

        <AttentionSeeker effect="tada">
          <p className="text-center font-serif tracking-widest text-4xl font-bold ">
            YOUR QUESTİONS
          </p>
        </AttentionSeeker>
        <h4 className="text-center font-serif tracking-widest text-2xl text-white/60 animate-pulse">
          You can give feedback to answered questions
        </h4>

        <input
          placeholder="Write your feedback"
          className="h-[35px]"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />

        {questionState?.map((question, i) => (
          <Fade key={i}>
            <div className="p-4 border-b-2 border-cyan-600 flex flex-row justify-between items-center  text-white">
              <div className="flex flex-col gap-3 ">
                <span>Your Question :</span>
                <h3 className="text-2xl font-mono text-gray-200">
                  {question.question}
                </h3>
              </div>

              {question.feedback && (
                <div className="flex flex-col gap-3 ">
                  <span>Your feedback :</span>
                  <p>{question.feedback}</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {question.answered && !question.feedback && (
                  <div className="flex flex-row gap-4 items-center">
                    <button
                      onClick={() => handleFeedback(question.id)}
                      className="p-3 bg-orange-900 rounded-md text-sm hover:scale-105 transition-all ease-in-out duration-500"
                    >
                      Add Feedback
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 items-center">
                <p className="text-sm">{`${question.room.presenter.name}' room`}</p>
                <p className="text-xs">{`Voted by ${question.votedParticipants.length} people`}</p>
              </div>

              {console.log(question)}
            </div>
          </Fade>
        ))}
      </div>
    );
  }
}

export default Feedback;

// export async function getServerSideProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }
