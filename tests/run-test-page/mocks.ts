import {Test} from '../utils';

export const TEST_META: Test = {
    id: '42',
    title: 'ЗАГОЛОВОК',
    questions: [
        {id: 'q1', question: '2+2=?', correct: '4', options: [1, 2, 3, 4].map(i => ({id: `${i}`, text: `${i}`}))},
        {id: 'q2', question: '3я буква алфавита?', correct: 'в', options: ['a', 'б', 'в', 'г'].map(x => ({id: x, text: x}))},
        {id: 'q3', question: 'Быть или не быть?', correct: 'быть', options: ['быть', 'не быть', 'ыть', 'ть'].map(x => ({id: x, text: x}))},
        {
            id: 'q4',
            question: 'Почему небо голубое?',
            correct: 'чтобы было',
            options: ['прост', 'чтобы было', 'надо так', 'гладиолус'].map(x => ({id: x, text: x})),
        },
    ],
};
