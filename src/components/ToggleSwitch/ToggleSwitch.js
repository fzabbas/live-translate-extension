import "./ToggleSwitch.scss"
import sun from "../../assets/icons/sun-line.svg"
import moon from "../../assets/icons/moon-line.svg"


export default function ToggleSwitch({handleCheck}) {
    return (
        <div class="container">
            <img class="icon" src={sun} alt="Sun"/>
            <label htmlFor="checkbox" className="darkmode">
                <input type="checkbox" onChange={handleCheck} className="darkmode__button off" id="checkbox" />
                <span className="darkmode__slider"></span>
            </label>
            <img class="icon" src={moon} alt="Moon" />
        </div>
    )
}