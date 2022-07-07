import React, { useEffect, useState } from 'react';
import styles from '../styles/Host.module.css';
import Head from 'next/head';
import TextField from '@mui/material/TextField';
import { Fade } from 'react-awesome-reveal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Back from '../components/Back';
import { useHostData, hostDataStateV } from '../atoms/atoms';
import { useResetRecoilState } from 'recoil';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function Host() {

  const resetUser = useResetRecoilState(hostDataStateV);
  const [userData, setUserData] = useHostData();
  const [showRoomId, setShowRoomId] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [questions, setQuestions] = useState([]);
  // const sortedQuestionsState = useRecoilValue(sortedQuestions);

  const connect = async () => { 
    let responseAddPresenter = await fetch(
      `http://localhost:8080/api/presenters/add-presenter`,

      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userData.name }),
      }
    );
    let dataAddPresenter = await responseAddPresenter.json();

    let responseAddRoom = await fetch(
      `http://localhost:8080/api/rooms/add-room`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presenter: { id: dataAddPresenter.id } }),
      }
    );

    let dataAddRoom = await responseAddRoom.json();
    // console.log('presenter', dataAddPresenter);
    setUserData({ ...userData, roomId: dataAddRoom.id, connected: true });
  };

  const fetchData = async () => {
    let response = await fetch(
      `http://localhost:8080/api/questions/get-questions-by-room-id/${userData.roomId}`
    );
    let data = await response.json();

    setQuestions(data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (userData.connected) {
        fetchData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userData.connected]);
  

  const handleClose = () => {
    resetUser();
    window.location.reload();
  };

  const handleCopy = () => {
    setShowCopyMessage(true);
    navigator.clipboard.writeText(userData.roomId);

    setTimeout(() => {
      setShowCopyMessage(false);
    }, 1000);
  };

  const handleAnswer = async (questionId) => {
    let response = await fetch(
      `http://localhost:8080/api/questions/set-answer/${questionId}`
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>HOST PAGE</title>
        <link
          rel="shortcut icon"
          href="https://i.pinimg.com/originals/ae/cd/3e/aecd3efe2cb83779f2fa074e6c8b1fb3.jpg"
        />
      </Head>
      <div className="flex absolute right-5 top-5 items-center gap-4 justify-center">
        <span className="">
          <Back routePath='/' />
        </span>
        <span
          onClick={handleClose}
          className=" text-red-600 cursor-pointer hover:scale-125"
        >
          X
        </span>
      </div>

      {!userData?.connected && (
        <div className="flex flex-col gap-10 items-center">
          <TextField
            style={{
              width: 400,
            }}
            InputLabelProps={{ style: { color: 'white', fontSize: '14px' } }}
            sx={{ input: { color: 'whitesmoke' } }}
            id="outlined-basic"
            label="Write Your Name"
            variant="outlined"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />

          <button className={styles.button} onClick={connect}>
            <span></span>
            <span></span>
            <span></span>
            <span></span> Create Room
          </button>
        </div>
      )}

      {userData?.connected && (
        <div className="h-screen p-4">
          <div className="w-full h-[15%] items-center flex flex-col sm:gap-1  lg:gap-10">
            <p className="sm:text-2xl md:text-4xl tracking-wider text-white  animate-pulse transition-all ease-out duration-500 hover:scale-90">
              Welcome, {userData.name}
            </p>
            {/* <p className="text-red-300 sm:tracking-tight md:tracking-wider sm:text-xl md:text-2xl">
                Your Room Id : {hostData?.randomRoomId}
              </p> */}
            <div className="flex flex-row gap-4 items-center">
              <p className="text-red-300 sm:tracking-tight md:tracking-wider sm:text-sm lg:text-2xl relative">
                Your Room Id :{!showRoomId ? ' **' : userData?.roomId}
              </p>
              <div>
                {showRoomId ? (
                  <span
                    className="cursor-pointer"
                    onClick={() => setShowRoomId(false)}
                  >
                    <VisibilityOffIcon
                      className="hover:scale-90"
                      style={{ fontSize: 40, color: 'red' }}
                    />
                  </span>
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => setShowRoomId(true)}
                  >
                    <VisibilityIcon
                      className="hover:scale-90"
                      style={{ fontSize: 40, color: 'green' }}
                    />
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 items-center">
                <span
                  className="hover:scale-90 transition-all ease-in-out duration-500 cursor-pointer"
                  onClick={handleCopy}
                >
                  <ContentCopyIcon
                    style={{ fontSize: 30, color: 'Highlight' }}
                  />
                </span>
                {showCopyMessage && (
                  <span className="text-[10px] text-indigo-400 transition-all ease-in-out duration-500">
                    Copyied{' '}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-white px-10 pb-10 pt-5 h-[85%] sm:border-none md:border-4 border-yellow-700 w-screen flex flex-col overflow-y-auto">
            {questions?.map((question, i) => (
              <Fade key={i}>
                <div className="flex flex-row justify-between p-1 sm:text-sm md:text-sm lg:text-lg">
                  <p className="text-white  lg:text-lg p-1   ">
                    {question.status === 'MESSAGE' && (
                      <span className="">{question.participant.name} :</span>
                    )}

                    {question.question}
                  </p>

                  <div className="flex flex-row gap-6">
                    {question.status === 'MESSAGE' && (
                      <div className="relative  hover:scale-125 transition-all ease-in-out text-xs ">
                        <TagFacesIcon fontSize="large" color="info" />
                        <span className="absolute bottom-0 -right-1 text-white">
                          {question.votedParticipants.length}
                        </span>
                      </div>
                    )}

                    {question?.answered ? (
                      <span
                        onClick={() => handleAnswer(question.id)}
                        className="cursor-pointer ease-in-out duration-300 hover:bg-green-400 rounded-full"
                      >
                        <ThumbUpIcon fontSize="large" color="success" />
                      </span>
                    ) : (
                      <span
                        onClick={() => handleAnswer(question.id)}
                        className="cursor-pointer ease-in-out duration-300 hover:bg-purple-500 rounded-full"
                      >
                        <ThumbDownIcon fontSize="large" color="secondary" />
                      </span>
                    )}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Host;
