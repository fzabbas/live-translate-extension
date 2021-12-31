/*global chrome*/
import './App.scss';
import React, { useState } from 'react';
import {apiKey} from "./utils/googleTranslate";
import axios from "axios";
import LANGUAGES from "./data/languages.json";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import toggleOn from "./assets/icons/toggle-on-solid.svg";
import toggleOff from "./assets/icons/toggle-off-solid.svg";

// `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=text&source=EN&target=FR`

function App() {
  const [darkModeOn, setDarkModeOn] = useState(false);
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
  
  const handleCheck = (e) => {
    console.log (e.target)
    setDarkModeOn(!darkModeOn)
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
    <div className={"extension" + (darkModeOn ? " extension--darkmode" : "")}>
      <label htmlFor="checkbox" className="darkmode">
        <input type="checkbox" onChange={handleCheck} className="darkmode__button off" id="checkbox" />
        <span className="darkmode__slider"></span>
      </label>
      <h1 className="extension__heading">Line Translation</h1>
      <form className="extension__form" onSubmit={handleSubmit}>
        <label className="extension__label"> Input 
          <textarea className={"extension__input" + (darkModeOn ? " extension__input--darkmode" : "")} name="input"></textarea>
        </label>
        <div className="extension__container">
          <label htmlFor="targetLanguage">Translate to:</label>
            <select className={"extension__dropdown" + (darkModeOn ? " extension__dropdown--darkmode" : "")} name="targetLanguage" id="targetLanguage">
              {LANGUAGES.languages.map((language) => (
                <option className="extension__option" 
                value={language.language}
                selected={language.language === defaultLanguage ? "selected" : ""}
                >
                  {language.language.toUpperCase()}
                  {language.language === defaultLanguage ? " (default)" : ""}
                </option>
              ))}
            </select>
        </div>
        <button className={"extension__button" + (darkModeOn ? " extension__button--darkmode" : "")} type="submit">Translate</button>
      </form>
      <p className="extension__translation">{translatedText}</p>
      <p className={"extension__from" + + (darkModeOn ? " extension__from--darkmode" : "")}>{translatedFrom}</p>
    </div>
  );
}

export default App;
