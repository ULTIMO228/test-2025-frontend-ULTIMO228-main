import {Question, Test} from './mock-data';

function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getRandomId() {
    return getRandomString(3);
}

function getRandomTitle() {
    const titles = ['Тест по животным', 'Зоология для начинающих', 'Интересные факты о животных', 'Животные миры', 'Природа и животные'];
    return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomQuestion() {
    const questions = [
        'У кого самый большой размер?',
        'У кого самая большая скорость?',
        'У кого самая длинная шея?',
        'У кого самый маленький размер?',
        'У кого самая высокая прыжоковая способность?',
    ];
    return questions[Math.floor(Math.random() * questions.length)];
}

function getRandomCorrectAnswer(question) {
    const answers = {
        'У кого самый большой размер?': 'Синий кит',
        'У кого самая большая скорость?': 'Гепард',
        'У кого самая длинная шея?': 'Жираф',
        'У кого самый маленький размер?': 'Карликовая мышь',
        'У кого самая высокая прыжоковая способность?': 'Кенгуру',
    };
    return answers[question];
}

function getRandomOptions(correctAnswer) {
    const options = [
        {id: getRandomId(), text: 'Синий кит'},
        {id: getRandomId(), text: 'Гепард'},
        {id: getRandomId(), text: 'Жираф'},
        {id: getRandomId(), text: 'Карликовая мышь'},
        {id: getRandomId(), text: 'Коралловая морская черепаха'},
        {id: getRandomId(), text: 'Лев'},
        {id: getRandomId(), text: 'Тигр'},
        {id: getRandomId(), text: 'Кенгуру'},
        {id: getRandomId(), text: 'Медведь'},
        {id: getRandomId(), text: 'Крокодил'},
    ];

    // Убедимся, что правильный ответ есть среди вариантов
    if (!options.some(option => option.text === correctAnswer)) {
        options.push({id: getRandomId(), text: correctAnswer});
    }

    const wrongOptions = options.filter(option => option.text !== correctAnswer);

    // Перемешаем неправильные варианты
    for (let i = wrongOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
    }

    const selectedWrongOptions = wrongOptions.slice(0, 3);
    const allOptions = [correctAnswer, ...selectedWrongOptions.map(option => option.text)];

    // Перемешаем все варианты
    for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    return allOptions.map(text => ({id: getRandomId(), text}));
}

export function generateTest(questionsCount = 3): Test {
    const id = getRandomId();
    const title = getRandomTitle();
    const questions: Question[] = [];
    const usedQuestions = new Set();

    while (questions.length < questionsCount) {
        const questionText = getRandomQuestion();
        if (!usedQuestions.has(questionText)) {
            usedQuestions.add(questionText);
            const correctAnswer = getRandomCorrectAnswer(questionText);
            const options = getRandomOptions(correctAnswer);
            questions.push({
                id: getRandomId(),
                question: questionText,
                correct: correctAnswer,
                options: options,
            });
        }
    }

    return {id, title, questions};
}
