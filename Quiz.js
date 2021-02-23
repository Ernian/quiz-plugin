class Quiz {
  constructor(elementId, data) {
    this.elementId = elementId
    this.data = data
    this.localResults = {}
    this.domElements = {}
    this.init()
  }

  init() {
    this.renderWrapper()
    this.getDomElements()
    this.renderQuestions(0)
    this.inputChangeHandler()
    this.buttonClickHandler()
  }

  renderWrapper() {
    document.getElementById(`${this.elementId}`).innerHTML = `      
      <div id="quiz-${this.elementId}">
        <div class="quiz-questions" id="questions-${this.elementId}"></div>
        <div class="quiz-results hidden" id="results-${this.elementId}"></div>
        <div class="quiz-indicator" id="indicator-${this.elementId}"></div>
        <div class="quiz-controls">
          <button class="btn-next" id="btn-next-${this.elementId}" disabled>Следующий</button>
          <button class="btn-restart hidden" id="btn-restart-${this.elementId}">С начала</button>
          <button id="btn-delete-${this.elementId}">Удалить викторину</button>
        </div>
      </div>
    `
  }

  getDomElements() {
    this.domElements.$quiz = document.getElementById(`quiz-${this.elementId}`),
    this.domElements.$questions = document.getElementById(`questions-${this.elementId}`),
    this.domElements.$indicator = document.getElementById(`indicator-${this.elementId}`),
    this.domElements.$results = document.getElementById(`results-${this.elementId}`),
    this.domElements.$btnNext = document.getElementById(`btn-next-${this.elementId}`),
    this.domElements.$btnRestart = document.getElementById(`btn-restart-${this.elementId}`)
    this.domElements.$btnDelete = document.getElementById(`btn-delete-${this.elementId}`)
  }

  renderQuestions(index) {
    this.renderIndicator(index)
    const renderAnswers = index => this.data[index].answers
      .map(answer => `
            <li>
              <label>
                <input class="answer-input" type="radio" name=${index} value=${answer.id}>
                ${answer.value}
              </label>
            </li>
            `
      )
      .join('')

    this.domElements.$questions.dataset.currentStep = index
    this.domElements.$questions.innerHTML = `
        <div class="quiz-questions" id="questions">
          <div class="quiz-questions-item">
            <div class="quiz-questions-item__question">${this.data[index].question}</div>
              <ul class="quiz-questions-item__answer">
                ${renderAnswers(index)}
              </ul>
            </div>
          </div>
        </div>
      `
  }

  renderIndicator(currentStep) {
    this.domElements.$indicator.innerHTML = `${currentStep + 1}/${this.data.length}`
  }

  renderResults() {
    let content = ''
    const getClassName = (answer, index) => {
      let className = ''
      if (!answer.correct && answer.id === this.localResults[index]) className = 'invalid'
      else if (answer.correct) className = 'valid'
      return className
    }
    const getAnswers = index => this.data[index].answers
      .map(answer => `<li class=${getClassName(answer, index)}>${answer.value}</li>`)
      .join('')
    this.data.forEach((question, index) => {
      content += `
      <div class="quiz-results-item">
        <div class="quiz-results-item__question">${question.question}</div>
        <ul class="quiz-results-item__answer">${getAnswers(index)}</ul>
      </div>
      `
    })
    this.domElements.$results.innerHTML = content
  }

  deleteQuiz() {
    document.getElementById(`${this.elementId}`).remove()
  }

  inputChangeHandler() {
    this.domElements.$quiz.addEventListener('change', event => {
      if (event.target.classList.contains('answer-input')) {
        this.localResults[event.target.name] = event.target.value
        this.domElements.$btnNext.disabled = false
      }
    })
  }

  buttonClickHandler() {
    this.domElements.$quiz.addEventListener('click', event => {
      if (event.target.classList.contains('btn-next')) {
        let nextQuestionIndex = Number(this.domElements.$questions.dataset.currentStep) + 1

        if (this.data.length === nextQuestionIndex) {
          this.renderResults()
          this.domElements.$questions.classList.toggle('hidden')
          this.domElements.$results.classList.toggle('hidden')
          this.domElements.$btnNext.classList.toggle('hidden')
          this.domElements.$btnRestart.classList.toggle('hidden')
        }
        else {
          this.renderQuestions(nextQuestionIndex)
        }

        this.domElements.$btnNext.disabled = true
      }
      if (event.target.classList.contains('btn-restart')) {
        this.domElements.$questions.classList.toggle('hidden')
        this.domElements.$results.classList.toggle('hidden')
        this.domElements.$btnNext.classList.toggle('hidden')
        this.domElements.$btnRestart.classList.toggle('hidden')

        this.domElements.$results.innerHTML = ''
        this.localResults = {}
        this.renderQuestions(0)
      }

      if (event.target.id === `btn-delete-${this.elementId}`) this.deleteQuiz()

    })
  }
}