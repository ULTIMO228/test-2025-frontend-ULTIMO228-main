// Глобальные переменные с расширенной структурой
let currentQuestionIndex = 0;
let testData = null;
let answeredQuestions = {};
let isTestFinished = false;
// Загрузка теста с расширенной логикой
async function loadTest() {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('id');


    document.getElementById('prev-button').innerText = getComputedStyle(document.documentElement).getPropertyValue('--icon-arrow-left').replace(/['"]/g, '').trim();
    document.getElementById('next-button').innerText = getComputedStyle(document.documentElement).getPropertyValue('--icon-arrow-right').replace(/['"]/g, '').trim();
    try {
        const response = await fetch('./data/data.json');
        const jsonData = await response.json();
        const savedTests = JSON.parse(localStorage.getItem('tests')) || [];
        const allTests = [...jsonData, ...savedTests];

        // Получаем пользовательские тесты из localStorage


        // Объединяем предустановленные и пользовательские тесты

        // Загрузка сохраненных результатов
        answeredQuestions = JSON.parse(localStorage.getItem(`test_${testId}_answers`)) || {};

        // Поиск теста
        testData = allTests.find(test => test.id === testId);

        if (!testData) {
            throw new Error('Тест не найден');
        }

        // Настройка интерфейса
        document.getElementById('test-title').innerText = testData.title;
        setupSidebar();
        showQuestion(0);
        updateNavigationButtons();

    }
    catch (error) {
        console.error('Ошибка загрузки теста:', error);
        document.getElementById('test-title').innerText = 'Ошибка загрузки теста';
    }
    if (testData) {
        document.getElementById('test-title').innerText = testData.title;
        const sidebar = document.getElementById('sidebar');

        // Очищаем существующие кнопки в sidebar
        sidebar.innerHTML = ''; // Очищаем все кнопки

        testData.questions.forEach((question, index) => {
            const button = document.createElement('button');
            button.id = `question-${index + 1}`;
            button.innerText = `Вопрос ${index + 1}`;
            button.onclick = () => showQuestion(index);
            if (index === 0) {
                button.classList.add('active');
            }
            sidebar.appendChild(button);
        });
        const testFinishedStatus = localStorage.getItem(`test_${testId}_finished`);
        if (testFinishedStatus === 'true') {
            isTestFinished = true;
            document.querySelector('.finish-button').innerText = 'Пройти тест заново';
            document.querySelector('.finish-button').onclick = resetTest;
        }
        showQuestion(0);

    }
}

// Настройка боковой панели
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = ''; // Очистка

    testData.questions.forEach((question, index) => {
        const button = document.createElement('button');
        button.id = `question-${index + 1}`;
        button.innerText = `Вопрос ${index + 1}`;
        button.onclick = () => showQuestion(index);

        // Восстановление состояния кнопок
        if (answeredQuestions[index]) {
            button.classList.add(
                answeredQuestions[index].isCorrect ? 'correct' : 'incorrect'
            );
        }

        sidebar.appendChild(button);
    });
}

// Отображение вопроса с расширенной логикой
// Отображение вопроса с расширенной логикой
function showQuestion(index) {
    currentQuestionIndex = index;
    const question = testData.questions[index];

    document.getElementById('question-text').innerText = question.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;

        // Блокировка кнопок, если тест завершен
        if (isTestFinished) {
            button.classList.add('disabled-option');
            button.onclick = null;
        } else {
            button.onclick = () => selectAnswer(button, option.id === question.correct);
        }

        // Существующая логика восстановления состояния
        const savedAnswer = answeredQuestions[index];
        if (savedAnswer) {
            if (savedAnswer.selectedOptionText === option.text) {
                button.classList.add(savedAnswer.isCorrect ? 'correct' : 'incorrect');
            }

            if (savedAnswer.selectedOptionText !== option.text) {
                button.classList.add('disabled-option');
            }
        }

        optionsContainer.appendChild(button);
    });

    updateSidebarActiveButton();
    updateNavigationButtons();
    updateSidebarWithSavedStates();
}


function updateSidebarWithSavedStates() {
    const sidebarButtons = document.querySelectorAll('#sidebar button');
    sidebarButtons.forEach((button, index) => {
        const savedAnswer = answeredQuestions[index];
        if (savedAnswer) {
            button.classList.remove('correct', 'incorrect');
            button.classList.add(savedAnswer.isCorrect ? 'correct' : 'incorrect');
        }
    });
}

// Выбор ответа с расширенным функционалом
function selectAnswer(button, isCorrect) {
    // Блокировка повторного ответа
    if (answeredQuestions[currentQuestionIndex]) return;

    const buttons = button.parentElement.querySelectorAll('button');
    buttons.forEach(btn => {
        // Добавляем класс для затухания неактивных кнопок
        if (btn !== button) {
            btn.classList.add('disabled-option');
        }
    });

    // Сохранение состояния ответа
    answeredQuestions[currentQuestionIndex] = {
        isCorrect: isCorrect,
        selectedOptionText: button.innerText
    };

    // Визуальное отображение
    button.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Обновление sidebar
    const sidebarButton = document.getElementById(`question-${currentQuestionIndex + 1}`);
    sidebarButton.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Сохранение в localStorage
    localStorage.setItem(
        `test_${testData.id}_answers`,
        JSON.stringify(answeredQuestions)
    );
}
// Навигация между вопросами
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
        updateNavigationButtons();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < testData.questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
        updateNavigationButtons();
    }
}

// Обновление кнопок навигации
function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === testData.questions.length - 1;
}

// Обновление активной кнопки в сайдбаре
function updateSidebarActiveButton() {
    const sidebarButtons = document.querySelectorAll('#sidebar button');
    sidebarButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === currentQuestionIndex) {
            btn.classList.add('active');
        }
    });
}
function showModal() {
    document.getElementById('finishModal').style.display = 'flex';
    document.getElementById('finishModal').style.alignItems = 'flex-start';
}

function closeModal() {
    document.getElementById('finishModal').style.display = 'none';
}
function closeResultModal() {
    document.getElementById('resultModal').style.display = 'none';
    document.querySelector('.finish-button').innerText = 'Пройти тест заново';
    document.querySelector('.finish-button').onclick = resetTest;
}

// Завершение теста
function finishTest() {
    closeModal();
    if (!testData) {
        console.error('Тест не загружен');
        return;
    }

    // Устанавливаем глобальный флаг завершения теста
    isTestFinished = true;

    // Сохраняем состояние завершения теста в localStorage
    localStorage.setItem(`test_${testData.id}_finished`, 'true');

    const totalQuestions = testData.questions.length;
    const answeredCount = Object.keys(answeredQuestions).length;
    const correctAnswers = Object.values(answeredQuestions)
        .filter(answer => answer.isCorrect).length;

    // Отображение результатов
    document.getElementById('correctAnswers').innerText =
        `Правильные ответы: ${correctAnswers}`;
    document.getElementById('incorrectAnswers').innerText =
        `Неправильные ответы: ${answeredCount - correctAnswers}`;
    document.getElementById('unansweredQuestions').innerText =
        `Вопросов без ответа: ${totalQuestions - answeredCount}`;

    // Показ модального окна результатов
    const resultModal = document.getElementById('resultModal');
    if (resultModal) {
        resultModal.style.display = 'flex';
    } else {
        console.error('Модальное окно результатов не найдено');
    }

    // Изменение кнопки завершения
    document.querySelector('.finish-button').innerText = 'Пройти тест заново';
    document.querySelector('.finish-button').onclick = resetTest;
}

// Сброс теста
function resetTest() {
    if (!testData) {
        console.error('Тест не загружен');
        return;
    }

    // Очистка localStorage
    localStorage.removeItem(`test_${testData.id}_answers`);
    localStorage.removeItem(`test_${testData.id}_finished`);

    // Сброс глобальных переменных
    answeredQuestions = {};
    currentQuestionIndex = 0;
    isTestFinished = false;

    // Возврат кнопки завершения в исходное состояние
    document.querySelector('.finish-button').innerText = 'Завершить';
    document.querySelector('.finish-button').onclick = showModal;

    // Перезагрузка теста
    loadTest();

    // Скрытие модального окна результатов
    const resultModal = document.getElementById('resultModal');
    if (resultModal) {
        resultModal.style.display = 'none';
    }
}


// Инициализация при загрузке
window.onload = loadTest;