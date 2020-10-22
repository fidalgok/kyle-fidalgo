import React from 'react'
import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import Dropdown from '../src/components/timerDropdown';


const statusTypes = {
    running: 'running',
    done: 'done',
    pause: 'pause',

}

const clockTypes = {
    work: 'work',
    break: 'break'
}

const workTime = 25; // minutes
const breakTime = 10; // minutes

export default function timer() {
    const [time, setTime] = useState(timeInMs(workTime)); //useState(2000) <-- for testing
    const [status, setStatus] = useState(statusTypes.pause);
    const [clockType, setClockType] = useState(clockTypes.work)
    const [showAlarmControls, setShowAlarmControls] = useState(false)
    const [playNachoooo, { stop: stopNacho }] = useSound('/nachoooo.mp3', {
        volume: 0.5,
        interrupt: true,
        loop: true,
        onplay: () => {
            setShowAlarmControls(true);
        }
    })
    function handleStart() {
        // change status to start
        setStatus('running')

    }
    function handlePause() {
        setStatus('pause');
    }

    function handleEnd() {
        playNachoooo({ loop: true })
        setStatus(statusTypes.done)
    }

    function handleReset() {
        setStatus('pause')
        if (clockType === clockTypes.work) {

            return setTime(timeInMs(workTime))
        }
        setTime(timeInMs(breakTime))
    }
    function handleChangeClockType(e) {
        e.persist();
        // set clock type to work or break
        setClockType(e.target.value)
        setTime(timeInMs(e.target.value === clockTypes.work ? workTime : breakTime))
        if (status !== 'pause') {
            setStatus(statusTypes.pause)
        }
    }

    // timer effects
    useEffect(() => {
        // controls timer interval

        const runningClock = setInterval(() => {
            if ((clockType === clockTypes.work || clockType === clockTypes.break) && status !== statusTypes.pause) {
                // timer is running a work or break cycle
                if (time > 0) {

                    setTime(time - 1000)
                }
            }
        }, 1000 - new Date().getMilliseconds()) // accounts for timeout weirdness enough for me
        if (time === 0) {
            handleEnd();
        }

        return () => {
            // clean up the timeout function

            clearInterval(runningClock);
        }
    }, [status, time])

    useEffect(() => {
        document.title = `${calcMinutes(time)}:${calcSeconds(time)} - Pomodoro Timer`;
    }, [time])
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div>

                <h1 className="mb-8 text-lg text-center">{clockType === clockTypes.work ? 'Time to go to work!' : 'Time for a break!'}</h1>
                <div className="mb-8 text-5xl">
                    <p className="text-center">

                        <span>{calcMinutes(time)}</span>:
                <span>{calcSeconds(time) < 10 ? `0${calcSeconds(time)}` : calcSeconds(time)}</span>
                    </p>
                </div>
                <div className="flex justify-center">
                    <button
                        className="btn btn-red"
                        onClick={() => {
                            if (status === statusTypes.pause) {
                                return handleStart();
                            }
                            handlePause();
                        }}
                        disabled={status === statusTypes.done}
                    >
                        {status === statusTypes.pause ? 'Start' : status === statusTypes.done ? 'Stopped' : 'Pause'}
                    </button>
                    <button className="btn" onClick={handleReset}>Reset</button>
                    <select className={`${showAlarmControls ? 'mr-4' : ''}`} onChange={handleChangeClockType} defaultValue="work">
                        <option value="work">Work</option>
                        <option value="break">Break</option>
                    </select>
                    {/* <Dropdown /> */}
                    {!showAlarmControls && (
                        <button
                            className="btn ml-2"
                            onClick={() => playNachoooo()}>
                            Test alarm
                        </button>
                    )}
                    {showAlarmControls && (
                        <button className="btn" onClick={() => {
                            stopNacho();
                            setShowAlarmControls(false);
                        }}
                        >Stop Alarm</button>

                    )
                    }
                </div>
            </div>
        </div>
    )
}

function timeInMs(timeInMinutes) {
    return timeInMinutes * 60 * 1000;
}

function calcSeconds(time) {
    return (time / 1000) % 60;
}
function calcMinutes(time) {
    return Math.floor(time / 60 / 1000);
}

function TimerOptions(props) {
    // auto start break?
    // alarm will ring once and begin break once it's done
    // change default work and break times
    // only allow between 20 and 45 minutes for work
    // only allow between 5 and 15 for breaks
    // set amount of 
}



