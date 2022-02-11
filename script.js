import data from "./data.json";
import JSConfetti from 'js-confetti'
import anime from 'animejs'
import 'regenerator-runtime/runtime'

const jsConfetti = new JSConfetti()


const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const randomizeArray = (array) => array.sort(() => (Math.random() > .5) ? 1 : -1);


console.log(data.length);


// Fix game questions
let allQuestions = data
const notValid = allQuestions.filter(k => k.value === false)
let isValid = allQuestions.filter(k => k.value === true)
isValid = randomizeArray(isValid)
isValid = isValid.slice(0, notValid.length * 1.5);

let gameQuestions = randomizeArray(notValid.concat(isValid))

const createCard = () => {
    const template = document.querySelector('.template').cloneNode(true)
    template.classList.remove('template')
    return template
}





const createNewCard = () => {
    if (!gameQuestions.length) return
    const cardEl = createCard()
    const item = randomItem(gameQuestions)
    gameQuestions = gameQuestions.filter(k => k !== item)
    console.log(gameQuestions.length);

    // Insert information
    const nameEl = cardEl.querySelector('.description h2')
    const extraEl = cardEl.querySelector('.description p')

    // Fix long descirptions in name
    if (item.name.includes('–')) {
        const split = item.name.split('–')
        item.name = split[0].trim()
        item.extra = capitalizeFirstLetter(split[1].trim())
    }
    extraEl.innerText = item.extra ? item.extra : extraEl.remove()
    nameEl.innerText = item.name

    // Prepend Card
    document.querySelector('main').prepend(cardEl)

    // Actions
    const buttons = cardEl.querySelectorAll('.actions button')
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            let answer = event.target.innerText
            answer = answer === "Ja" ? true : false

            const facit = answer === item.value

            showAnswer(cardEl, facit, answer)



        });
    });
}

let answerdCount = 0
let scoreCount = 0

const updateScore = () => {
    const subEl = document.querySelector('.sub')
    if (subEl) subEl.remove()

    const scoreEl = document.querySelector('.score')
    scoreEl.style.display = 'inline'
    const scoreCorrectEl = scoreEl.querySelector('.score-correct')
    const scoreTotalEl = scoreEl.querySelector('.score-total')

    scoreCorrectEl.innerText = scoreCount
    scoreTotalEl.innerText = answerdCount

}

const showAnswer = async (el, facit, answer) => {
    el.classList.add('answered')
    const answerEl = el.querySelector('.answer')
    const text = answerEl.querySelector('p')

    answerdCount = answerdCount + 1

    if (facit) scoreCount = scoreCount + 1
    answerEl.classList.add(facit ? 'correct' : 'incorrect')
    text.innerText = `${facit ? 'Rätt' : 'Fel'}, det kan man${answer === facit ? '' : ' inte'}`


    updateScore()

    if (facit) {
        await jsConfetti.addConfetti({
            emojis: ['✅', '💸', '🥇', '⭐️', '💚', '🏆', '🍾'],
            confettiNumber: 120
        })
        createNewCard()
        return
    }

    const xMax = 24;
    anime({
        targets: el,
        easing: 'easeInOutSine',
        duration: 400,
        translateX: [
            {
                value: xMax * -1,
            },
            {
                value: xMax,
            },
            {
                value: xMax / -2,
            },
            {
                value: xMax / 2,
            },
            {
                value: 0
            }
        ],
        complete: function (anim) {
            setTimeout(() => {
                createNewCard()
            }, 800)
        }
    });


}

createNewCard()




