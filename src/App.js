import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  let utterance;

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(question);
    axios.post('https://gemini-app-bb53.vercel.app/getResponse', {
      question: question,
    })
    .then(res => {
      console.log(res.data.response);
      setResponse(res.data.response);
    })
    .catch(err => {
      console.log(err);
    })
  }

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
  }

  return (
    <div className="App">
      <div className='box'>
        <div className='profile-pic'>
          <img className='pic' alt='Profile Pic' src={require('../src/assets/user.jpg')} />
        </div>
        <p className='label'>Question</p>
        <textarea onChange={(e) => {setQuestion(e.target.value)}}/>
        <button onClick={submitHandler}>Send</button>
      </div>
      <div className='box'>
        <div className='profile-pic'>
          <img className='pic' alt='Profile Pic' src={require('../src/assets/gemini.png')} />
        </div>
        <p className='label'>Response</p>
        <textarea value={response}/>
        <button onClick={speakHandler}>{isSpeaking ? 'Stop' : 'Speak'}</button>
      </div>
    </div>
  );
}

export default App;
