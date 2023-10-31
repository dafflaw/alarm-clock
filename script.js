const timerRef = document.querySelector(".current-time")
const hourInput = document.getElementById("hour-input")
const minuteInput = document.getElementById("minute-input")
const activeAlarms = document.querySelector(".alarms-list")
const setAlarm = document.getElementById("set")
const clearAll = document.querySelector(".clear")
const alarmSound = new Audio("./alarm-1.mp3")

function updateTime() {
  timerRef.textContent = new Date().toLocaleTimeString()
}
setInterval(updateTime, 1000)

let hours = 0
let minutes = 0
let newAlarms = []
let isActive = false

function addAlarm() {
  const id = crypto.randomUUID()
  let isAdded
  hours = hourInput.value
  minutes = minuteInput.value

  if (hours.length === 1) hours = "0" + hourInput.value
  if (minutes.length === 1) minutes = "0" + minuteInput.value
  if (hours.length !== 2 || minutes.length !== 2) return
  if (hours < 0 || minutes < 0) return
  if (!hours && !minutes) return
  if (hours > 23 || minutes > 59) return
  if (hours.length === 1 && minutes.length === 0) minuteInput.value = "00"

  const html = `
  <div class="alarm" data-id=${id}>
    <p>${hours}:${minutes}</p>
    <div class="alarm-buttons">
      <input type="checkbox" class="toggle-button" data-checked=${isActive} />
      <button class="delete-button">
        <ion-icon name="trash-outline"></ion-icon>
      </button>
    </div>
  </div>
  `

  const alarm = {
    id,
    alarmUI: `${hours}:${minutes}`,
    hours,
    minutes,
    isActive,
  }

  newAlarms.push(alarm)

  if (newAlarms.length > 0) {
    isAdded =
      newAlarms.filter((cur) => cur.alarmUI === alarm.alarmUI)[0] === alarm
        ? false
        : true
  }

  if (!isAdded) {
    activeAlarms.insertAdjacentHTML("afterbegin", html)
  }

  if (isAdded && newAlarms.length > 0) {
    newAlarms.pop(alarm)
  }

  hourInput.value = minuteInput.value = ""
}

setAlarm.addEventListener("click", addAlarm)

activeAlarms.addEventListener("click", function (e) {
  if (!e.target) return

  if (e.target.classList.contains("toggle-button")) {
    const alarm = newAlarms.filter(
      (cur) => cur.id === e.target.closest(".alarm").dataset.id
    )
    alarm[0].isActive = !alarm[0].isActive
  }
})

const checkTimer = async (alarm) => {
  const currentTime = new Date()
    .toLocaleTimeString("en-US", { hour12: false })
    .slice(0, 5)
  if (alarm.isActive && alarm.alarmUI === currentTime) {
    alarmSound.play()
    setTimeout(function () {
      alarmSound.pause()
    }, 5000)
  } else {
    alarmSound.pause()
  }
}

setInterval(() => {
  if (newAlarms.length > 0) newAlarms.forEach((alarm) => checkTimer(alarm))
}, 1000)

activeAlarms.addEventListener("click", function (e) {
  if (e.target.getAttribute("name") === "trash-outline") {
    const alarm = e.target.closest(".alarm")
    const updatedAlarms = newAlarms.filter((cur) => cur.id !== alarm.dataset.id)
    alarm.remove()
    newAlarms = updatedAlarms
  }
})

clearAll.addEventListener("click", function () {
  activeAlarms.innerHTML = ""
})
