const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear");

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false,
  currentColor = "black";

function populateLanguages() {
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

populateLanguages();

function speechToText() {
  try {
      recognition = new SpeechRecognition();
      recognition.lang = inputLanguage.value;
      recognition.interimResults = true;
      recordBtn.classList.add("recording");
      recordBtn.querySelector("p").innerHTML = "Listening...";
      recognition.start();
      recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript.toLowerCase();
          
          // Check for stop commands
          if (speechResult.includes("stop recording") || speechResult.includes("stop listening")) {
              stopRecording();
              return;
          }

          // Check for clear command
          if (speechResult.includes("clear") || speechResult.includes("clear all")) {
              clearOutput();
              return;
          }

          // Check for color change commands
          if (speechResult.includes("camera one") || speechResult.includes("camera 1")){
              currentColor = "red";
          } else if (speechResult.includes("camera two") || speechResult.includes("camera 2")) {
              currentColor = "blue";
          } else if (speechResult.includes("camera three") || speechResult.includes("camera 3")) {
              currentColor = "purple";
          } else if (speechResult.includes("camera four") || speechResult.includes("camera 4")) {
              currentColor = "green";
          } else if (speechResult.includes("normal")) {
              currentColor = "black";
          }
          
          // Handle text display
          if (event.results[0].isFinal) {
              const span = document.createElement("span");
              span.style.color = currentColor;
              span.textContent = speechResult + " ";
              result.appendChild(span);
              result.querySelector("p")?.remove();

              // Send the result to the server
              fetch('http://localhost:3000/broadcast', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ text: speechResult })
              });
          } else {
              if (!document.querySelector(".interim")) {
                  const interim = document.createElement("p");
                  interim.classList.add("interim");
                  result.appendChild(interim);
              }
              document.querySelector(".interim").innerHTML = " " + speechResult;
          }
          downloadBtn.disabled = false;
          autoScroll();
      };
      recognition.onspeechend = () => {
          speechToText();
      };
      recognition.onerror = (event) => {
          stopRecording();
          if (event.error === "audio-capture") {
              alert("No microphone was found. Ensure that a microphone is installed.");
          } else if (event.error === "not-allowed") {
              alert("Permission to use microphone is blocked.");
          } else if (event.error === "aborted") {
              alert("Listening Stopped.");
          } 
      };
  } catch (error) {
      recording = false;
      console.log(error);
  }
}


function autoScroll() {
  result.scrollTop = result.scrollHeight;
}

function clearOutput() {
  result.innerHTML = "";
  downloadBtn.disabled = true;
  currentColor = "black";
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
});

function stopRecording() {
  if (recognition) {
    recognition.stop();
  }
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

function download() {
  const text = result.innerText;
  const filename = "speech.txt";

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

downloadBtn.addEventListener("click", download);

clearBtn.addEventListener("click", clearOutput);



