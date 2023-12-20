//Select Elements
let countSpan = document.querySelector(".info .quests-count span");
let questionDiv = document.querySelector(".question");
let answersDiv = document.querySelector(".answers");
let submitButton = document.querySelector(".submit");
let footerDiv = document.querySelector(".footer");
let bulletscontainer = document.querySelector(".footer .bullets");
let timeDiv = document.querySelector(".footer .counter");
let evaluation = document.querySelector(".result .evaluation");
let answerd = document.querySelector(".result .answered");
let totalquests = document.querySelector(".result .from");

//Set Main Setting
let currentQuestIndex = 0;
let rightAnswersCount = 0;
let countDownInterval;

async function getdata() {
  //Get the data from json file
  let response = await fetch("./quest.json");
  let questionsArray = await response.json();

  //Set Questions Count
  let questCount = questionsArray.length;
  countSpan.innerHTML = questCount;
  totalquests.innerHTML = questCount;

  //set Bullets in the Footer depend on questions count
  setBullets(questCount);

  //Start quiz
  startQuestion(questionsArray[currentQuestIndex], questCount);

  //Start countdown
  countDown(120, questCount);

  //On submit
  submitButton.addEventListener("click", () => {
    //Get the right answer
    let rightAnswer = questionsArray[currentQuestIndex].right_answer;

    //Increase Index
    currentQuestIndex++;

    //Call checkAnswer
    checkAnswer(rightAnswer, questCount);

    //Remove qustion and answers divs content
    questionDiv.innerHTML = "";
    answersDiv.innerHTML = "";

    //Call the next question
    startQuestion(questionsArray[currentQuestIndex], questCount);

    //Function Handles current question bullet class
    handleCurrentBullet();

    //Start countdown
    clearInterval(countDownInterval)
    countDown(120, questCount);

    //Function show the result
    showResult(questCount);
  });
}

getdata();

//Functions
//Set Footer bullets function
function setBullets(bulletsCount) {
  for (let i = 0; i < bulletsCount; i++) {
    let bullet = document.createElement("span");
    if (i == 0) {
      bullet.className = "on";
    }
    bulletscontainer.appendChild(bullet);
  }
}

//Function append Data from Question Obj
function startQuestion(questionObj, count) {
  // console.log(questionObj.right_answer)
  if (currentQuestIndex < count) {
    //Create question h2 and append to the div
    questionDiv.innerHTML = "";
    let theQuestion = document.createElement("h2");
    let theQuestionText = document.createTextNode(questionObj["title"]);
    theQuestion.appendChild(theQuestionText);
    questionDiv.appendChild(theQuestion);

    //Create answers divs and append to answers div
    answersDiv.innerHTML = "";
    for (let i = 1; i <= 4; i++) {
      //main div
      let answer = document.createElement("div");
      answer.classList.add("answer");
      //input radio
      let radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "answer";
      radio.id = `answer_${i}`;
      radio.dataset.answer = questionObj[`answer_${i}`];

      //Make the first input Checked
      if (i === 1) {
        radio.checked = true;
      }
      answer.appendChild(radio);
      //Lable
      let label = document.createElement("label");
      label.setAttribute("for", `answer_${i}`);
      label.innerText = questionObj[`answer_${i}`];
      answer.appendChild(label);
      //append answer to the div
      answersDiv.appendChild(answer);
    }
  }
}

//Function that compare the answer with the right answer
function checkAnswer(rightAnswer, count) {
  //Get all qustion answers
  let answers = document.getElementsByName("answer");
  let theChoosenAnswer;

  answers.forEach((answer) => {
    if (answer.checked) {
      theChoosenAnswer = answer.dataset.answer;
    }
  });
  if (rightAnswer === theChoosenAnswer) {
    rightAnswersCount++;
    answerd.innerHTML++;
    if (rightAnswersCount > count / 2 && rightAnswersCount < count) {
      evaluation.innerHTML = "Good: ";
    } else if (rightAnswersCount === count) {
      evaluation.innerHTML = "Prefect: ";
    }
  }
}

function handleCurrentBullet() {
  let bulletsArray = document.querySelectorAll(".footer .bullets span");

  // bulletsArray[currentQuestIndex].className = "on"
  bulletsArray.forEach((bullet, index) => {
    if (currentQuestIndex === index) {
      bullet.className = "on";
    }
  });
}

function showResult(count) {
  if (currentQuestIndex === count) {
    questionDiv.remove();
    answersDiv.remove();
    submitButton.remove();
    footerDiv.remove();
  }
}

function countDown(duration, count) {
  if (currentQuestIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timeDiv.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click()
      }
    }, 1000);
  }
}
