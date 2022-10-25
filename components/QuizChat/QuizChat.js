import styles from "./QuizChat.module.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import TelegramIcon from '@mui/icons-material/Telegram';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
let socket;

const feTch = async ()=>{
  await fetch('api/socket')
}
feTch();

socket = io();
const QuizChat = () => {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const Message = [
    {
      author: 'hi',
      message: "hello",
    },
  ];
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("newIncomingMessage", (msg) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ]);
      console.log("checking");
    });
    return () => {
      socket.off("newIncomingMessage");
    };
  }, []);

  const sendMessage = async () => {
    socket.emit("createdMessage", { author: chosenUsername, message });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: chosenUsername, message },
    ]);
    setMessage("");
    console.log("sent");
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };
  return (
    <div className={styles.mainDiv}>
      <div className="flex items-center p-4 mx-auto min-h-screen justify-center">
        <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
          {!chosenUsername ? (
            <>
              <h3 className="font-bold text-white text-xl">
                How people should call you?
              </h3>
              <input
                type="text"
                placeholder="Identity..."
                value={username}
                className="p-3 rounded-md outline-none"
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                onClick={() => {
                  setChosenUsername(username);
                }}
                className="bg-white rounded-md px-4 py-2 text-xl hover:bg-blue-800 hover:text-white"
              >
                Go!
              </button>
            </>
          ) : (
            <>
              <p className="font-bold text-white text-4xl uppercase">
                Hello {username} !! 
              </p>
              <p className="text-white text-2xl">Get some hints from the other Players!!</p>
              <div className={styles.mainMsgContainer}>
                <div className={`${styles.msgDiv} h-full  overflow-y-scroll`}>
                  {messages.length ? messages.map((msg, i) => {
                    return (
                      <div
                        className="w-full py-1 px-2  border-gray-200"
                        key={i+1}
                      >
                        {msg.author} <PublicRoundedIcon className=" opacity-50" /> {msg.message}
                      </div>
                    );
                  }) : <div className={styles.emptyPara}>Currently there are no messages.Type below to start the conversation!</div>}
                </div>
                <div className=" border-gray-300 w-full flex ">
                  <input
                    type="text"
                    placeholder="New message..."
                    value={message}
                    className="outline-none py-2 px-2 rounded-bl-md flex-1"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyUp={handleKeypress}
                  />
                
                    <button
                      className={styles.sendBtn}
                      onClick={() => sendMessage()}
                    >
                     <TelegramIcon />
                    </button>
             
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default QuizChat;
