const input = document.getElementById("inputBox");
const buttons = document.querySelectorAll(".btn:not(.no-input)");
const toggleTheme = document.getElementById("toggleTheme");



let expression = "";

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    let val = btn.innerText;

    if (val === "AC") expression = "";
    else if (val === "DEL") expression = expression.slice(0, -1);
    else if (val === "=") {
      try {
        expression = eval(expression).toString();
      } catch {
        expression = "Error";
      }
    } else {
      expression += val;
    }

    input.value = expression;
  });
});



toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  toggleTheme.textContent = document.body.classList.contains("light-mode")
    ? "☀️" : "🌙";
});

const chatBtn = document.getElementById("chatBtn");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");

chatBtn.onclick = () => {
  chatWindow.style.display = "flex";
   let chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
  if (chatBox.innerHTML.trim() === "") {
    setTimeout(chatGreeting, 300);
  }
};

closeChat.onclick = () => {
  chatWindow.style.display = "none";
};

function chatGreeting() {
  addMessage("Hello! How can I help you?", "bot");
}
function addMessage(text, sender) {
  const chatBox = document.getElementById("chatBox");

  const msg = document.createElement("div");
  msg.classList.add("message", sender === "user" ? "user-msg" : "bot-msg");

  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
function chatGreeting() {
  let hour = new Date().getHours();
  let greet = "";

  if (hour >= 5 && hour < 12) {
    greet = "Good morning! ☀️";
  } else if (hour >= 12 && hour < 17) {
    greet = "Good afternoon! 😊";
  } else if (hour >= 17 && hour < 21) {
    greet = "Good evening! 🌙";
  } else {
    greet = "Good night! 🌙";
  }

  addMessage(greet + " How can I help you?", "bot");
}

document.getElementById("chatInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    document.getElementById("sendChat").click();
  }
});


function solveMath(input) {
  let text = input.toLowerCase();
 let squareMatch1 = text.match(/square of (\d+)/);
  let squareMatch2 = text.match(/(\d+)\s*square/);
  let squareMatch3 = text.match(/(\d+)\s*squared/);
  let squareMatch4 = text.match(/(\d+)\s*\^\s*2/);

  if (squareMatch1) return Math.pow(Number(squareMatch1[1]), 2);
  if (squareMatch2) return Math.pow(Number(squareMatch2[1]), 2);
  if (squareMatch3) return Math.pow(Number(squareMatch3[1]), 2);
  if (squareMatch4) return Math.pow(Number(squareMatch4[1]), 2);
   text = text
    .replace(/multiplied by|multiply by|multiply/g, "*")
    .replace(/times|into/g, "*")
    .replace(/x|×/g, "*")
    .replace(/plus/g, "+")
    .replace(/minus/g, "-")
    .replace(/divide by|divided by|divide/g, "/")
    .replace(/mod|remainder|percentage/g, "%");

  text = text.replace(/[^0-9+\-*/.%]/g, "");

  try {
    let result = eval(text);
    if (!isNaN(result)) return result;
  } catch {}

  return null;
}


function botReply(input) {
  input = input.toLowerCase();

  if (/hi|hello|hey/.test(input))
    return "Hello! You can ask me to calculate anything.";

  if (/your name/.test(input))
    return "I am your math assistant!";

  if (/help/.test(input))
    return "Try: 25 + 8, 5 into 9, 45 divided by 3";

  let ans = solveMath(input);
  if (ans !== null) return `The answer is: ${ans}`;

  return "Sorry, I didn't understand that.";
}

function processUserMsg(text) {
  addMessage(text, "user");
  let response = botReply(text);
  addMessage(response, "bot");
  speak(response);
}

document.getElementById("sendChat").onclick = () => {
  let inp = document.getElementById("chatInput");
  let text = inp.value.trim();
  if (!text) return;

  inp.value = "";
  processUserMsg(text);
};

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recog = new SpeechRecognition();

recog.lang = "en-US";
recog.interimResults = false;

document.getElementById("voiceBtn").onclick = () => {
  recog.start();
};

recog.onresult = (e) => {
  let spoken = e.results[0][0].transcript;
  processUserMsg("🎤 " + spoken);
};

function speak(text) {
  let s = new SpeechSynthesisUtterance(text);
  s.rate = 1;
  s.pitch = 1;
  window.speechSynthesis.speak(s);
}
const clearChat = document.getElementById("clearChat");

clearChat.onclick = () => {
  document.getElementById("chatBox").innerHTML = "";
  chatGreeting(); // show time-based greeting again
};
const voiceBtn = document.getElementById("voiceBtn");

voiceBtn.onclick = () => {
  recog.start();
  voiceBtn.classList.add("recording");
};

recog.onresult = (e) => {
  voiceBtn.classList.remove("recording");

  let spoken = e.results[0][0].transcript;
  processUserMsg("🎤 " + spoken);
};

recog.onend = () => {
  voiceBtn.classList.remove("recording");
};
