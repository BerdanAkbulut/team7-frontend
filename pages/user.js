import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import styles from '../styles/User.module.css';
import Head from 'next/head';
import TextField from '@mui/material/TextField';
import { Fade } from 'react-awesome-reveal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Back from '../components/Back';
import { useUserState, userStateV } from '../atoms/atoms';
import { useResetRecoilState } from 'recoil';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useRouter } from 'next/router';
function User() {
  // var stompClient = null;
  // let socket = new SockJS('http://localhost:8080/ws');
  // stompClient = over(socket);
  const router = useRouter();
  const [userData, setUserData] = useUserState();
  const [questions, setQuestions] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const [showRoomId, setShowRoomId] = useState(false);
  const [userId, setUserId] = useState(null);
  const resetUser = useResetRecoilState(userStateV);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const connect = async () => {
    let response = await fetch(
      `http://88.245.19.100:8080/api/rooms/get-room-by-id/${userData.roomId}` /*  `${
        process.env.PROJECT_URL || 'http://localhost:8080'
      }/api/rooms/get-room-by-id/${userData.roomId}`    */
    );
    let data = await response.json();
    if (response.status === 200) {
      let addParticipantResponse = await fetch(
        `http://88.245.19.100:8080/api/participants/add-participant`, //        `http://${process.env.PROJECT_URL}/api/participants/add-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userData.name, email: userData.email }),
        }
      );
      let participantResponse = await addParticipantResponse.json();

      if (addParticipantResponse.status === 200) {
        setUserData({
          ...userData,
          participantId: participantResponse.id,
          connected: true,
        });
      } else {
        setEmailError('This email already been taken');
      }
    }
    if (response.status === 500) {
      setError('There is no such a room !');
    }
  };

  async function handleSendMessage(e) {
    if (e.key === 'Enter') {
      if (textMessage.length === 0) return;

      let question = {
        question: textMessage,
        participant: { id: userData.participantId },
        status: 'MESSAGE',
      };

      let response = await fetch(
        `http://88.245.19.100:8080/api/questions/addMessage/${userData.roomId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(question),
        }
      );
      let data = await response.json();

      if (response.status === 200) {
      }

      setTextMessage('');
    }
  }

  const onError = () => {
    console.log('error');
  };

  const fetchData = async () => {
    let response = await fetch(
      `http://88.245.19.100:8080/api/questions/get-questions-by-room-id/${userData.roomId}` //http://${process.env.PROJECT_URL}/api/questions/get-questions-by-room-id/${userData.roomId}
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (userData.connected) {
        fetchData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    setShowCopyMessage(true);
    navigator.clipboard.writeText(userData.roomId);

    setTimeout(() => {
      setShowCopyMessage(false);
    }, 1000);
  };

  const handleClose = () => {
    resetUser();
    window.location.reload();
  };

  const upVoteCountHandler = async (questionId) => {
    // console.log('participant',participantId);
    //console.log('question',questionId)
    let response = await fetch(
      `http://88.245.19.100:8080/api/questions/vote-question/${userData.participantId}/${questionId}`
    );
    let data = await response.json();
    console.log(data);
  };

  // const handleLikeColor = (votedUsers) => {
  //   votedUsers?.map((vote) => {
  //     if (parseInt(vote.id) === parseInt(userId)) {
  //       setColor(true);
  //     } else {
  //       setColor(false);
  //     }
  //   });
  // };
  return (
    <div className={styles.container}>
      <Head>
        <title>USER PAGE</title>
        <link
          rel="shortcut icon"
          href="https://i.pinimg.com/originals/ae/cd/3e/aecd3efe2cb83779f2fa074e6c8b1fb3.jpg"
        />
      </Head>
      <div className="flex absolute right-5 top-5 items-center gap-4 justify-center">
        <span className="">
          <Back />
        </span>
        <span
          onClick={handleClose}
          className=" text-red-600 cursor-pointer hover:scale-125"
        >
          X
        </span>
      </div>
      {!userData.connected ? (
        <div className="centerIt top-[50%] items-center flex flex-col  gap-10 w-full">
          <div className="flex flex-col gap-16 w-[500px]">
            <TextField
              sx={{ input: { color: 'whitesmoke' } }}
              InputLabelProps={{ style: { color: 'white', fontSize: '14px' } }}
              id="outlined-basic"
              label="Write Your Name"
              variant="filled"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            <TextField
              sx={{ input: { color: 'whitesmoke' } }}
              InputLabelProps={{ style: { color: 'white', fontSize: '14px' } }}
              id="outlined-basic"
              label="Write Your Email"
              variant="filled"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <TextField
              sx={{ input: { color: 'whitesmoke' } }}
              InputLabelProps={{ style: { color: 'white', fontSize: '14px' } }}
              id="outlined-basic"
              label="Write Room Id"
              variant="filled"
              value={userData.roomId}
              onChange={(e) =>
                setUserData({ ...userData, roomId: e.target.value })
              }
            />
          </div>

          <button className={styles.button} onClick={connect}>
            Connect
          </button>
          {emailError && <span className="text-white">{emailError}</span>}
          {error && <span className="text-white">{error}</span>}
        </div>
      ) : (
        <div className="h-screen overflow-x-hidden  ">
          <div className="items-center justify-center flex flex-col sm:gap-2 md:gap-3 lg:gap-8 overflow-hidden">
            <p className="sm:text-sm md:text-2xl lg:text-4xl tracking-wider text-white  animate-pulse transition-all ease-out duration-500 hover:scale-90">
              Welcome, {userData?.name}
            </p>
            {userId && <p className="text-white text-3xl">{userId}</p>}
            <div className="flex flex-row sm:gap-2 md:gap-4 lg:gap-10 items-center overflow-hidden">
              <p className="text-red-300 sm:tracking-tight md:tracking-wider sm:text-sm md:text-lg lg:text-2xl relative">
                Room Id :{!showRoomId ? ' **' : userData?.roomId}
              </p>
              <div className="overflow-hidden">
                {showRoomId ? (
                  <span onClick={() => setShowRoomId(false)}>
                    <VisibilityOffIcon style={{ fontSize: 40, color: 'red' }} />
                  </span>
                ) : (
                  <span onClick={() => setShowRoomId(true)}>
                    <VisibilityIcon style={{ fontSize: 40, color: 'green' }} />
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 items-center overflow-hidden">
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
              <button
                onClick={() => router.push(`/user/${userData.participantId}`)}
                className="text-black sm:p-[2px] lg:p-2 rounded-md bg-orange-400 transition-all ease-in-out duration-500 hover:bg-amber-700 hover:text-white"
              >
                My Feedbacks
              </button>
            </div>
          </div>

          <div className="text-white sm:px-2 md:px-4 lg:px-10 pb-12  sm:border-none md:border-4 border-yellow-700 w-screen flex flex-col overflow-y-auto overflow-x-hidden ">
            {questions?.map((question, i) => (
              <Fade key={i}>
                <span> {console.log(question)}</span>
                <div className="flex flex-row justify-between sm:text-sm md:text-sm lg:text-lg">
                  <p className="text-white  p-1">
                    {question.status === 'MESSAGE' && (
                      <span className="">{question.participant.name} :</span>
                    )}
                    {question.question}
                  </p>

                  <div className="flex flex-row gap-6">
                    {question.status === 'MESSAGE' && (
                      <div
                        onClick={() => upVoteCountHandler(question.id)}
                        className="relative cursor-pointer hover:scale-90 transition-all ease-in-out text-xs "
                      >
                        <TagFacesIcon fontSize="large" color="info" />
                        <span className="absolute bottom-0 -right-1 text-white">
                          {question.votedParticipants.length}
                        </span>
                      </div>
                    )}
                    {question?.answered ? (
                      <span className="ease-in-out duration-300 hover:scale-125">
                        <ThumbUpIcon fontSize="large" color="success" />
                      </span>
                    ) : (
                      <span className="ease-in-out duration-300 hover:scale-125">
                        <ThumbDownIcon fontSize="large" color="secondary" />
                      </span>
                    )}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
          <input
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onKeyDown={(e) => handleSendMessage(e)}
            placeholder="Enter your message"
            className="w-[98%] centerIt p-1  bottom-0 rounded-md hover:border-none focus:border-none "
          />
        </div>
      )}
    </div>
  );
}

export default User;
