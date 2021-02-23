class QuizConstructor {
  constructor(elementId) {
    this.elementId = elementId
    this.domElements = {}
    this.init()
  }

  init() {
    this.renderQuizConstructor()
    this.renderQuizConstructorShowButton()
    this.getDomElements()
    this.setEventListeners()
  }

  renderQuizConstructorShowButton() {
    const parent = document.getElementById(this.elementId).parentElement
    const quizConstructorShowBtn = document.createElement('div')
    quizConstructorShowBtn.id = 'modal-btn'
    quizConstructorShowBtn.innerHTML = '&#9776'
    quizConstructorShowBtn.classList.add('modal-btn')
    parent.append(quizConstructorShowBtn)
  }

  renderQuizConstructor() {
    document.getElementById(this.elementId).innerHTML = `
      <h3>Введите название викторины</h3>
      <input id="new-quiz-title-${this.elementId}" type="text" name="title">
      <div id="questions-container-${this.elementId}"></div>
      <p>
        <input id="add-new-question-${this.elementId}" type="button" value="Добавить вопрос">
        <input id="add-new-quiz-${this.elementId}" type="button" value="Создать викторину">
      </p>
    `
    this.addQuestionWrapper()
    document.getElementById(this.elementId).hidden = true
  }

  addQuestionWrapper() {
    if (!this.addQuestionWrapper.counter) this.addQuestionWrapper.counter = 1
    else this.addQuestionWrapper.counter++
    const questionWrapper = document.createElement('div')
    questionWrapper.classList.add('question-block')
    questionWrapper.innerHTML = `
          <h4>Введите вопрос</h4>
          <div class="question-textarea">
            <textarea name="question" cols="68" rows="5"></textarea>
          </div>
          <h4>Введите варианты ответа и укажите верный</h4>
          <div class="answers-wrapper">
            <div class="answer-option">
              <input class="answer-option-body" type="text" name="answer${this.addQuestionWrapper.counter}">
              <input class="answer-option-boolean" type="radio" name="answer${this.addQuestionWrapper.counter}">
            </div>
            <div class="answer-option">
              <input class="answer-option-body" type="text" name="answer${this.addQuestionWrapper.counter}">
              <input class="answer-option-boolean" type="radio" name="answer${this.addQuestionWrapper.counter}">
            </div>
          </div>  
          <p><input class="add-new-option-answer" type="button" value="Добавить вариант ответа"></p>
    `
    document.getElementById(`questions-container-${this.elementId}`)
      .append(questionWrapper)
  }

  clearQuestionWrapper(){
    document.getElementById(`questions-container-${this.elementId}`).innerHTML = ''
    document.getElementById(`new-quiz-title-${this.elementId}`).value = ''
  }

  getDomElements() {
    this.domElements.$btnAddNewQuiz = document.getElementById(`add-new-quiz-${this.elementId}`)
    this.domElements.$questionsContainer = document.getElementById(`questions-container-${this.elementId}`)
    this.domElements.$quizConstructorShowBtn = document.getElementById(`modal-btn`)
  }

  createNewQuiz() {
    this.createQuizWrapper()
    const { elementId, data } = this.getData()
    new Quiz(elementId, data)
    this.setNewQuizTitle(elementId)
    this.clearQuestionWrapper()
    this.addQuestionWrapper()
    this.toggleShowQuizConstructor()
  }

  setNewQuizTitle (title) {
    const newQuizTitle = document.createElement('h3')
    newQuizTitle.textContent = title
    document.getElementById(title).prepend(newQuizTitle)
  }

  createQuizWrapper() {
    const wrapper = document.createElement('div')
    wrapper.id = document.getElementById(`new-quiz-title-${this.elementId}`).value
    wrapper.classList.add('quiz')
    document.getElementById(`quiz-container`).append(wrapper)
  }


  getData() {
    let answerId = 1
    const data = []
    const questions = document.querySelectorAll('.question-block')
    questions.forEach(question => {
      const questionData = {}
      questionData.answers = []
      question.childNodes.forEach(element => {
        //textarea.value
        if (element.className === 'question-textarea') {
          questionData['question'] = element.querySelector('textarea').value
        }
        //answer-option
        if (element.className === 'answers-wrapper') {
          element.childNodes.forEach(answerOption => {
            if (answerOption.className === 'answer-option') {
              questionData.answers.push({
                id: `${answerId}`,
                value: answerOption.querySelector('.answer-option-body').value,
                correct: answerOption.querySelector('.answer-option-boolean').checked
              })
              answerId++
            }
          })
        }
      })
      data.push(questionData)
    })
    return {
      elementId: document.getElementById(`new-quiz-title-${this.elementId}`).value,
      data
    }
  }

  addNewOptionAnswer(event) {
    if (event.target.classList.contains('add-new-option-answer')) {
      const option = document.createElement('div')
      option.classList.add('answer-option')
      option.innerHTML = `
          <input class="answer-option-body" type="text" name="answer${this.addQuestionWrapper.counter}">
          <input class="answer-option-boolean" type="radio" name="answer${this.addQuestionWrapper.counter}">
      `
      event.target
        .parentElement
        .previousElementSibling
        .append(option)
    }
  }

  toggleShowQuizConstructor(){ 
    document.getElementById(this.elementId).hidden = !document.getElementById(this.elementId).hidden
  }

  setEventListeners() {
    this.domElements.$btnAddNewQuiz.addEventListener('click', () => this.createNewQuiz())
    this.domElements.$questionsContainer.addEventListener('click', event => this.addNewOptionAnswer(event))
    document.getElementById(this.elementId).addEventListener('click', event => {
      if (event.target.id === `add-new-question-${this.elementId}`) {
        this.addQuestionWrapper()
      }
    })

    this.domElements.$quizConstructorShowBtn.addEventListener('click', () => this.toggleShowQuizConstructor())
    this.domElements.$quizConstructorShowBtn.onmousedown = () => false
  }
}