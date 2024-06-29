// src/components/Countdown.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Countdown.css";

function Countdown() {
  const [timers, setTimers] = useState([]);
  const [newTimerTitle, setNewTimerTitle] = useState("");
  const [newTimerCategory, setNewTimerCategory] = useState("");
  const [newTimerDateTime, setNewTimerDateTime] = useState("");

  const categoryColors = {
    Meeting: "bg-primary",
    Birthday: "bg-danger",
    Reminder: "bg-success",
  };

  useEffect(() => {
    const intervalIds = {};

    const updateTimers = () => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          const targetTime = new Date(timer.targetDateTime).getTime();
          const currentTime = new Date().getTime();
          const timeRemaining = Math.max(
            Math.floor((targetTime - currentTime) / 1000),
            0
          );

          if (timeRemaining === 0) {
            clearInterval(intervalIds[timer.id]);
            return {
              ...timer,
              isRunning: false,
              timeRemaining: 0,
            };
          }

          return { ...timer, timeRemaining };
        })
      );
    };

    timers.forEach((timer) => {
      if (timer.isRunning && timer.timeRemaining > 0) {
        intervalIds[timer.id] = setInterval(updateTimers, 1000);
      }
    });

    return () => {
      Object.values(intervalIds).forEach((intervalId) =>
        clearInterval(intervalId)
      );
    };
  }, [timers]);

  const removeTimer = (timerId) => {
    setTimers((prevTimers) =>
      prevTimers.filter((timer) => timer.id !== timerId)
    );
  };

  const calculateTimeRemaining = (targetTime) => {
    const currentTime = new Date().getTime();
    const timeDifference = targetTime - currentTime;
    const secondsRemaining = Math.max(Math.floor(timeDifference / 1000), 0);
    return secondsRemaining;
  };

  const formatTimeRemaining = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds: remainingSeconds,
    };
  };

  const addTimer = () => {
    if (!newTimerTitle || !newTimerCategory || !newTimerDateTime) return;

    // Convert to milliseconds since epoch
    const targetDateTime = new Date(newTimerDateTime).getTime();

    const newTimer = {
      id: timers.length + 1,
      category: newTimerCategory,
      targetDateTime,
      // Calculate time remaining here
      timeRemaining: calculateTimeRemaining(targetDateTime),
      isRunning: true,
      title: newTimerTitle,
      showTitleInput: false,
    };

    setTimers([...timers, newTimer]);

    setNewTimerTitle("");
    setNewTimerCategory("");
    setNewTimerDateTime("");
  };

  return (
    <div className="countdown-container">
      <div className="main-container">
        <div className="input-container m-3">
          <h1 className="text-center text-success">Event Countdown Timer</h1>
          <input
            type="text"
            className="form-control m-2"
            placeholder="Timer Title"
            value={newTimerTitle}
            onChange={(e) => setNewTimerTitle(e.target.value)}
          />
          <select
            className="form-select m-2"
            value={newTimerCategory}
            onChange={(e) => setNewTimerCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            <option value="Meeting">Meeting</option>
            <option value="Birthday">Birthday</option>
            <option value="Reminder">Reminder</option>
          </select>
          <input
            className="form-control m-2"
            type="datetime-local"
            value={newTimerDateTime}
            onChange={(e) => setNewTimerDateTime(e.target.value)}
          />
          <button
            className="btn btn-primary m-2"
            onClick={addTimer}
            disabled={!newTimerTitle || !newTimerCategory || !newTimerDateTime}
          >
            Add Timer
          </button>
        </div>
        <div className="timers-div m-auto d-flex">
          {timers.map((timer) => {
            const timeRemaining = formatTimeRemaining(timer.timeRemaining);

            return (
              <div
                key={timer.id}
                className={`card m-4 ${categoryColors[timer.category] || ""}`}
              >
                <h3 className="card-title m-2 text-light">{timer.title}</h3>
                <h4 className="card-title m-2 text-dark">{timer.category}</h4>
                <div className="card-body d-flex">
                  {timeRemaining.days > 0 && (
                    <div
                      className="container 
														bg-light 
														text-dark 
														rounded m-2"
                    >
                      <div>
                        <h1>
                          <strong>{timeRemaining.days}</strong>
                        </h1>
                      </div>
                      <div>days </div>
                    </div>
                  )}
                  <div
                    className="container bg-light 
									text-dark rounded m-2"
                  >
                    <div>
                      <h1>
                        <strong>{timeRemaining.hours}</strong>
                      </h1>
                    </div>
                    <div>hours </div>
                  </div>
                  <div
                    className="container 
													bg-light 
													text-dark 
													rounded m-2"
                  >
                    <div>
                      <h1>
                        <strong>{timeRemaining.minutes}</strong>
                      </h1>
                    </div>
                    <div>minutes </div>
                  </div>
                  <div
                    className="container 
													bg-light 
													text-dark 
													rounded m-2"
                  >
                    <div>
                      <h1>
                        <strong>{timeRemaining.seconds}</strong>
                      </h1>
                    </div>
                    <div>seconds </div>
                  </div>
                </div>
                <button
                  className="btn btn-dark m-2"
                  onClick={() => removeTimer(timer.id)}
                  disabled={timer.timeRemaining <= 0}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Countdown;
