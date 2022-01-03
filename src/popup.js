/*global chrome*/
import './App.scss';
import React, { useRef, useState } from 'react';
import {apiKey} from "./utils/googleTranslate";
import axios from "axios";
import LANGUAGES from "./data/languages.json";
import ToggleSwitch from './components/ToggleSwitch/ToggleSwitch';

function App() {
  const buttonRef = useRef(null);
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [translatedText, setTranslatedText] = useState(false)
  const [defaultText, setDefaultText] = useState([
    "Live Translation", 
    "Input", 
    "Translate to:", 
    "Translate",
    "Highlight text or enter text to translate!"
  ])


  const defaultLanguage = navigator.language.split('-')[0]

  if (defaultLanguage !=="en") {
        axios.get(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&format=text&q=${defaultText}&target=${defaultLanguage}`)
    .then(response => {
      const translatedDefaultText = response.data.data.translations[0].translatedText.split(",")
      setDefaultText(translatedDefaultText)
    })
  }


  if (!translatedText) {
    chrome.tabs.query({active: true, currentWindow: true}, 
    (tabs) => {
      chrome.scripting.executeScript(
        {
          target: {tabId: tabs[0].id},
          func: () => {
            return window.getSelection().toString();
          }
        },
        (injectionResults) =>
        {
          if(!injectionResults[0].result) {
            return;
          }
          translateText(injectionResults[0].result, defaultLanguage)
        })
    })
  }
  
  const translateText = (text, targetLanguage) => {
    axios.get(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&format=text&q=${text}&target=${targetLanguage}`)
    .then(resp => {
      setTranslatedText(resp.data.data.translations[0].translatedText)
    }
    )
  }

  const handleCheck = (e) => {
    setDarkModeOn(!darkModeOn)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const targetLanguage = e.target.targetLanguage.value
    const userInput = e.target.input.value
    translateText(userInput, targetLanguage)
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (!e.shiftKey) {
      e.preventDefault()
      buttonRef.current.click()
      }
    }
  }

  

  return (
    <div className={"extension" + (darkModeOn ? " extension--darkmode" : "")}>
      <ToggleSwitch handleCheck={handleCheck}/>
      <h1 className="extension__heading">{defaultText[0]}</h1>
      <form className="extension__form" onSubmit={handleSubmit}>
        <label className="extension__label"> {defaultText[1]}
          <textarea 
          onKeyDown={handleKeyDown}
          className={"extension__input" + (darkModeOn ? " extension__input--darkmode" : "")} 
          name="input"></textarea>
        </label>
        <div className="extension__container">
          <label htmlFor="targetLanguage">{defaultText[2]}</label>
            <select 
            className={"extension__dropdown" + (darkModeOn ? " extension__dropdown--darkmode" : "")} 
            name="targetLanguage" 
            id="targetLanguage">
              {LANGUAGES.languages.map((language) => (
                <option className="extension__option" 
                value={language.language}
                selected={language.language === defaultLanguage ? "selected" : ""}
                >
                  {language.language.toUpperCase()}
                </option>
              ))}
            </select>
        </div>
        <button 
        className={"extension__button" + (darkModeOn ? " extension__button--darkmode" : "")} 
        ref={buttonRef}
        type="submit">{defaultText[3]}
        </button>
      </form>
      <p className="extension__translation">{translatedText || defaultText[4]}</p>
    </div>
  );
}

export default App;
