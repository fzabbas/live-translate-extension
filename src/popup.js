/*global chrome*/
import './App.scss';
import React, { useState } from 'react';
import {apiKey} from "./utils/googleTranslate";
import axios from "axios";
import LANGUAGES from "./data/languages.json";

// `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=text&source=EN&target=FR`

function App() {
  const [translatedFrom, setTranslatedFrom] = useState("")
  const [translatedText, setTranslatedText] = useState("Highlight or enter text to translate!")
  const defaultLanguage = navigator.language.split('-')[0]

  // console.log(chrome.tabs)
  // async function getCurrentTab() {
  //   let queryOptions = { active: true, currentWindow: true };
  //   let [tab] = await chrome.tabs.query(queryOptions);
  //   console.log(tab, "current tab")
  //   return tab;
  // }
  if (translatedText === "Highlight or enter text to translate!") {
    chrome.tabs.query({active: true, currentWindow: true}, 
    (tabs) => {
      console.log("Tab query!")
      chrome.scripting.executeScript(
        {
          target: {tabId: tabs[0].id},
          func: () => {
            return window.getSelection().toString();
          }
        },
        (injectionResults) =>
        {
          if(!injectionResults[0].result || (translatedFrom === injectionResults[0].result)) {
            return;
          }
          axios.get(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${injectionResults[0].result}&target=${defaultLanguage}`)
          .then(resp => {
            setTranslatedFrom("This was translated from: " + resp.data.data.translations[0].detectedSourceLanguage)
            setTranslatedText(resp.data.data.translations[0].translatedText)
          }
          )
        }
        )
    })
  }
  
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const targetLanguage = e.target.targetLanguage.value
    const userInput = e.target.input.value
    console.log("Handle submit!")
    axios.get(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${userInput}&target=${targetLanguage}`)
    .then(resp => {
      setTranslatedFrom("This was translated from: " + resp.data.data.translations[0].detectedSourceLanguage)
      setTranslatedText(resp.data.data.translations[0].translatedText)
    }
    )
  }

  

  return (
    <div className="extension">
      <h1 className="extension__heading">Line Translation</h1>
      <form className="extension__form" onSubmit={handleSubmit}>
        <label className="extension__label"> Input 
          <input className="extension__input" type="text" name="input"></input>
        </label>
        <select className="extension__dropdown" name="targetLanguage">
          {LANGUAGES.languages.map((language) => (
            <option className="extension__option" 
              value={language.language}
              selected={language.language === defaultLanguage ? "selected" : ""}
            >
              {language.language.toUpperCase()}
            </option>
          ))}
        </select>
        <button className="extension__button"  type="submit">Translate</button>
      </form>
      <p className="extension__copy">{translatedText}</p>
      <p className="extension__copy">{translatedFrom}</p>
    </div>
  );
}

export default App;
