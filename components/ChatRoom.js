import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

var stompClient = null;
function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    message: '',
    connected: false,
    receiver: '',
    roomId: '',
  });

  const connectAsS = () => {
    let socket = new SockJS('http://localhost:8080/ws');
    stompClient = over(socket);
  };
  const connect = () => {
    let socket = new SockJS('http://localhost:8080/ws');
    stompClient = over(socket);
    console.log(socket);
    console.log(stompClient);

    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log('successfull connection to socket');
    const randomRoomId = Math.floor(Math.random() * 10000);

    setUserData({
      ...userData,
      connected: true,
      roomId: randomRoomId,
    });

    stompClient.subscribe(
      '/user/' + randomRoomId + '/private',
      onPrivateMessageReceived
    );
  };

  const onPrivateMessageReceived = (payload) => {
    let payloadData = JSON.parse(payload.body);
    setMessages([...messages, payloadData]);
  };

  const onError = () => {
    console.log('socket error');
  };

  const sendMessage = () => {
    if (stompClient) {
      stompClient.send(
        '/private-message',
        {},
        JSON.stringify({
          message: 'NASILSIN',
          sender: 'Berdan',
          receiver: 'deniz',
          status: 'MESSAGE',
        })
      );
    } else {
      console.log('em');
    }
  };

  return (
    <div>
      {!userData.connected ? (
        <div>
          <div>
            <h1>Participant</h1>
            <input
              placeholder="Adınızı girin"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            <input
              placeholder="Room Id"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            <button onClick={connect}>Connect to Room</button>
          </div>
          <div>
            <h1>Presenter</h1>
            <input
              placeholder="Adınızı girin"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            <button onClick={connectAsS}>Create a Room</button>
          </div>
        </div>
      ) : (
        <div>
          <h1>My Room Id : {userData?.roomId}</h1>
          <div>
            {messages &&
              messages.map((message, i) => <p key={i}>{message.message}</p>)}
          </div>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>send message</button>

          <div></div>
        </div>
      )}
    </div>
  );
}
export default ChatRoom;
