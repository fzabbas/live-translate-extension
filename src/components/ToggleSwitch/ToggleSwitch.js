import "./ToggleSwitch.scss"

export default function ToggleSwitch({handleCheck}) {
    return (
        <label htmlFor="checkbox" className="darkmode">
            <input type="checkbox" onChange={handleCheck} className="darkmode__button off" id="checkbox" />
            <span className="darkmode__slider"></span>
        </label>
    )
}