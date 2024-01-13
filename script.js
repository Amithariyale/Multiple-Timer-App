const timerForm = document.getElementById("set_timer_container");
const timerHead = document.getElementById("timer_container_head");
const timersContainer = document.getElementById("timers_container");

const timers = {};

let timerCnt = 0;
timerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let hours = timerForm.hours.value;
  let minutes = timerForm.minutes.value;
  let seconds = timerForm.seconds.value;

  if (!validateTime(hours, minutes, seconds)) return;

  if ((timerHead.style.display = "block")) timerHead.style.display = "none";

  const newTimer = document.createElement("div");
  newTimer.className = "timer_card";
  newTimer.id = `timer${timerCnt++}`;
  newTimer.innerHTML = `<p>Timer Left :</p>
  <p class="remaining_time">${hours}h : ${minutes}m : ${seconds}s</p>
  `;
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.className = "stop_btn";
  deleteBtn.addEventListener("click", () => {
    newTimer.remove();
    clearInterval(timers[newTimer.id].intervalId);
    delete timers[newTimer.id];
    if (Object.keys(timers).length === 0) timerHead.style.display = "block";
  });

  newTimer.appendChild(deleteBtn);
  timersContainer.appendChild(newTimer);

  let newTimerObj = {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    intervalId: null,
  };

  timers[newTimer.id] = newTimerObj;
  startTimer(newTimer.id);
});

function startTimer(timerId) {
  timers[timerId].intervalId = setInterval(() => updateTimer(timerId), 1000);
}
function updateTimer(timerId) {
  const timer = timers[timerId];
  timer.seconds--;
  if (timer.seconds === -1) {
    timer.seconds = 60;
    timer.minutes--;
    if (timer.minutes === -1) {
      timer.minutes = 60;
      timer.hours--;
      if (timer.hours === -1) {
        clearInterval(timers[timerId].intervalId);
        showStopCard(timerId);
        return;
      }
    }
  }
  updateTimerDisplay(timerId);
}

function showStopCard(timerId) {
  const timer = document.getElementById(`${timerId}`);
  timer.innerHTML = `<h1>Timer Is Up !<h1>`;
  timer.classList.remove("timer_card");
  timer.className = "stop_card";

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Stop";
  deleteBtn.className = "stop_btn";
  deleteBtn.addEventListener("click", () => {
    timer.remove();
    clearInterval(timers[timerId].intervalId);
    delete timers[timerId];
    if (Object.keys(timers).length === 0) timerHead.style.display = "block";
  });

  timer.appendChild(deleteBtn);

  const audio = new Audio("alarm.mp3");
  audio.play();
}

function updateTimerDisplay(timerId) {
  const timer = timers[timerId];
  const formattedTime = `${timer.hours}h : ${timer.minutes}m : ${timer.seconds}s`;

  document.querySelector(`#${timerId} .remaining_time`).innerText =
    formattedTime;
}
function validateTime(h, m, s) {
  if (h < 0 || m < 0 || m > 60 || s < 0 || s > 60) {
    alert("Enter valid time");
    return false;
  }
  return true;
}
