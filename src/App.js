import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  let utterance;
  let recognition;

  if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false; // Stop after one input
    recognition.interimResults = false; // Show only the final result
    recognition.lang = 'en-US'; // Set the language
  } else {
    alert('Speech Recognition not supported in this browser.');
  }

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(question);
    axios
      .post('https://gemini-app-bb53.vercel.app/getResponse', {
        question: question,
      })
      .then((res) => {
        console.log(res.data.response);
        setResponse(res.data.response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const speakHandler = () => {
    if (!isSpeaking) {
      // Start speaking
      utterance = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);

      // Handle the end of speech
      utterance.onend = () => {
        setIsSpeaking(false);
      };
    } else {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startRecording = () => {
    if (!recognition) return;

    // Clear the existing question
    setQuestion('');
    setIsRecording(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript); // Set the new transcription as the question
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  return (
    <div className="App">
      <div className="box">
        <div className="profile-pic">
          <img className="pic" alt="Profile Pic" src={require('../src/assets/user.jpg')} />
        </div>
        <p className="label">Question</p>
        <div className="textarea-container">
          <textarea onChange={(e) => setQuestion(e.target.value)} value={question} />
          <button className="mic-button" onClick={startRecording}>
            {isRecording ? '🎙️ Recording...' : '🎤'}
          </button>
        </div>
        <button onClick={submitHandler}>Send</button>
      </div>
      <div className="box">
        <div className="profile-pic">
          <img className="pic" alt="Profile Pic" src={require('../src/assets/gemini.png')} />
        </div>
        <p className="label">Response</p>
        <div className="textarea-container">
          <textarea value={response} readOnly />
        </div>
        <button onClick={speakHandler}>{isSpeaking ? 'Stop' : 'Speak'}</button>
      </div>
    </div>
  );
}

export default App;
