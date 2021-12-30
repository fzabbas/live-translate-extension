import './App.css';
import React, { useState } from 'react';
import {apiKey} from "./utils/googleTranslate";
import axios from "axios";
import LANGUAGES from "./data/languages.json"

// `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=text&source=EN&target=FR`

function App() {
  const [translatedText, setTranslatedText] = useState("No input given")

  const defaultLanguage = navigator.language.split('-')[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    const targetLanguage = e.target.targetLanguage.value
    const userInput = e.target.input.value
    console.log(defaultLanguage, "default language")


    // setTranslatedText(e.target.input.value)
    axios.get(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${userInput}&target=${targetLanguage}`)
    .then(resp => (
      setTranslatedText(resp.data.data.translations[0].translatedText)
    )
    )
  }

  

  return (
    <div className="App">
      <h1>Line Translation</h1>
      <form onSubmit={handleSubmit}>
        <label> Input 
          <input type="text" name="input"></input>
        </label>
        <select name="targetLanguage">
          {LANGUAGES.languages.map((language) => (
            <option 
              value={language.language}
              selected={language.language === defaultLanguage ? "selected" : ""}
            >
              {language.language.toUpperCase()}
            </option>
          ))}
        </select>
        
        <button  type="submit">Translate</button>
      </form>
      <p>Translated text</p>
      <p>{translatedText}</p>
    </div>
  );
}

export default App;
