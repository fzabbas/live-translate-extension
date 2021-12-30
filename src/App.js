import './App.css';
import React, { useState } from 'react';
import {apiKey} from "./utils/googleTranslate"

console.log(apiKey)
function App() {
  const [translatedText, setTranslatedText] = useState("No input given")

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(e.target.input.value)
    setTranslatedText(e.target.input.value)
  }
  return (
    <div className="App">
      <h1>Line Translation</h1>
      <form onSubmit={handleSubmit}>
        <label> Input 
          <input type="text" name="input"></input>
        </label>
        <button  type="submit">Translate</button>
      </form>
      <p>Translated text</p>
      <p>{translatedText}</p>
    </div>
  );
}

export default App;
