let categoryMenu = document.querySelector("#categoryMenu");
let difficultyOptions = document.querySelector("#difficultyOptions");
let questionsNumber = document.querySelector("#questionsNumber");
let startQuiz = document.querySelector("#startQuiz");
let form = document.querySelector("#quizOptions");
let questionsContainer = document.querySelector(".questions .container .row");
let questions;
let myQuiz;
startQuiz.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let number = questionsNumber.value;
  console.log(category, difficulty, number);
  myQuiz = new Quiz(category, difficulty, number);
  questions = await myQuiz.getAllQuestions();
  let myQuestion = new Question(0);
  form.classList.replace("d-flex", "d-none");
  myQuestion.display();
  console.log(questions);
});

class Quiz {
  constructor(category, difficulty, number) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = number;
    this.score = 0;
  }
  // https://opentdb.com/api.php?amount=10&category=25&difficulty=easy
  getApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
  }

  async getAllQuestions() {
    let res = await fetch(this.getApi());
    let data = await res.json();
    return data.results;
  }
  showResult() {
    return `
    <div
      class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
    >
      <h2 class="mb-0">
      ${
        this.score == this.number
          ? `Congratulations 🎉`
          : `Your score is ${this.score} out of ${this.number}`
      }      
      </h2>
      <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
    </div>
  `;
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.category = questions[index].category;
    this.difficulty = questions[index].difficulty;
    this.correct_answer = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.question = questions[index].question;
    this.allAnswers = this.getAllAnswers();
    this.isAnswered = false;
  }
  getAllAnswers() {
    let allAnswers = [...this.incorrect_answers, this.correct_answer];
    console.log(allAnswers);
    allAnswers.sort();
    console.log(allAnswers);
    return allAnswers;
  }

  display() {
    const questionMarkUp = `
      <div
        class="question shadow-lg col-lg-6   p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
      >
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions"> ${this.index + 1}of ${
      questions.length
    }  Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
        ${this.allAnswers.map((answer) => `<li>${answer}</li>`).join("")}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${
          myQuiz.score
        } </h2>        
      </div>
    `;

    questionsContainer.innerHTML = questionMarkUp;

    let allChoices = document.querySelectorAll(".choices li");
    allChoices.forEach((choice) => {
      choice.addEventListener("click", () => {
        this.checkAnswer(choice);
        this.nextQuestion();
      });
    });
  }

  checkAnswer(choice) {
    if (!this.isAnswered) {
      this.isAnswered = true;
      if (choice.innerHTML == this.correct_answer) {
        myQuiz.score++;
        choice.classList.add("correct", "animate__pulse", "animate__animated");
      } else {
        choice.classList.add("wrong", "animate__shakeX", "animate__animated");
      }
    }
  }
  nextQuestion() {
    this.index++;
    setTimeout(() => {
      if (this.index < questions.length) {
        let myNewQuestion = new Question(this.index);
        myNewQuestion.display();
      } else {
        let result = myQuiz.showResult();
        questionsContainer.innerHTML = result;
        document
          .querySelector(".again")
          .addEventListener("click", () => window.location.reload());
      }
    }, 1000);
  }
}
