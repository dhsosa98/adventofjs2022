import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import './App.css'
import gear from './assets/images/gear.svg'
import { createPortal } from 'react-dom'

function App() {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(15)

  const [isRunning, setIsRunning] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const ring = useRef(null)

  const startTimer = () => {
    if (minutes <= 0 && seconds <= 0) return;
    if (isRunning) {
      setIsRunning(false)
      return;
    }
    setIsRunning(true)
  }

  useEffect(()=>{
    let interval;
    if (!isRunning) {
      clearInterval(interval)
      return;
    };
    const callback = () => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds <= 0) {
        if (minutes <= 0) {
          clearInterval(interval)
          setIsRunning(false)
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }
    interval = setInterval(callback, 1000);
    return () => clearInterval(interval)
  }, [minutes, seconds, isRunning])

  useEffect(()=>{
    if (isRunning) {
      ring.current.className = "ring";
      return;
    }
  }, [isRunning])

  useEffect(()=>{
    if (minutes <= 0 && seconds <= 0) {
      ring.current.className = "ring ending"
      return;
    }
  }, [minutes, seconds])

    
  const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes
  const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds

  return (
    <div className="wrapper">
      <div ref={ring} className="ring ">
        <svg width="518" height="518" viewBox="0 0 518 518">
          <circle stroke-width="9px" x="0" y="y" cx="259" cy="259" r="254" />
        </svg>
      </div>

      <div className="timer">
        <div className="time">
          <div className="minutes">
            <input type="text" value={minutesFormatted} disabled />
          </div>
          <div className="colon">:</div>
          <div className="seconds">
            <input type="text" value={secondsFormatted} disabled />
          </div>
        </div>
        <button className="start" onClick={startTimer}>{!isRunning ? "Start" : "Stop"}</button>
        <button className="settings" onClick={()=>setIsModalOpen(true)}>
          <img src={gear} alt="Settings" />
        </button>
        {isModalOpen && <SettingsModal setIsModalOpen={setIsModalOpen} setMinutes={setMinutes} minutes={minutes} setSeconds={setSeconds} seconds={seconds} />}
      </div>
  </div>
  )
}


const SettingsModal = ({setIsModalOpen, minutes, setMinutes, seconds, setSeconds}) => {
  return createPortal(
    <SettingsTimer setIsModalOpen={setIsModalOpen} setMinutes={setMinutes} minutes={minutes} setSeconds={setSeconds} seconds={seconds}   />,
    document.getElementById('modal')
  )
}

const SettingsTimer = ({setIsModalOpen, minutes, setMinutes, seconds, setSeconds}) => {

  const minutesInput = useRef(null)
  const secondsInput = useRef(null)

  useEffect(()=>{
    minutesInput.current.value = minutes
    secondsInput.current.value = seconds
  }, [minutes, seconds])
  
  const handleSaveSettings = () => {
    setMinutes(minutesInput.current.value === "" ? 0 : minutesInput.current.value)
    setSeconds(secondsInput.current.value === "" ? 0 : secondsInput.current.value)
    setIsModalOpen(false)
  }

  return (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <div className="settings-modal-header">
          <h2>Settings</h2>
          <button className="close-settings-modal" onClick={()=>setIsModalOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="settings-modal-body">
          <div className="settings-modal-body-item">
            <label htmlFor="minutes">Minutes</label>
            <input type="number" id="minutes" ref={minutesInput} />
          </div>
          <div className="settings-modal-body-item">
            <label htmlFor="seconds">Seconds</label>
            <input type="number" id="seconds" ref={secondsInput} />
          </div>
        </div>
        <div className="settings-modal-footer">
          <button className="save-settings" onClick={handleSaveSettings}>Save</button>
        </div>
      </div>
    </div>
  )
}


export default App
