import {expect, test} from '@playwright/test';
import {RunTestPagePO} from '../utils/page-objects/run-test-page';
import {mockData} from '../utils';
import {TEST_META} from './mocks';

const {describe, beforeEach} = test;

describe('Экран прохождения теста', () => {
    test.use({viewport: {width: 1280, height: 400}});

    let pagePO: RunTestPagePO;

    beforeEach(async ({page}) => {
        await mockData(page, [TEST_META]);
        await page.goto(`/test/index.html?testId=${TEST_META.id}`);

        pagePO = new RunTestPagePO(page);
    });

    describe('[Public] Блок с вопросами', () => {
        test('Кнопка со стрелкой вправо выполняет переход на следующий вопрос (score: 2)', async () => {
            for (const {question, options} of TEST_META.questions) {
                await expect(pagePO.question).toContainText(question);

                for (let i = 0; i < options.length; i++) {
                    await expect(pagePO.questionOption.nth(i)).toContainText(options[i].text);
                }

                await pagePO.nextQuestion.click({force: true});
            }
        });

        test('Визуальный вид кнопки со стрелкой вправо (в активном состоянии) (score: 1)', async () => {
            await expect(pagePO.nextQuestion).toHaveScreenshot('next-question-button-active.png');
        });

        test('Визуальный вид кнопки со стрелкой вправо (в НЕактивном состоянии – дальше вопросов нет) (score: 1)', async () => {
            await pagePO.navigationItem.last().click();

            await expect(pagePO.nextQuestion).toHaveScreenshot('next-question-button-disabled.png');
        });

        test('Кнопка со стрелкой влево выполняет переход на предыдущий вопрос (score: 1)', async () => {
            await pagePO.navigationItem.last().click();

            for (const {question, options} of [...TEST_META.questions].reverse()) {
                await expect(pagePO.question).toContainText(question);

                for (let i = 0; i < options.length; i++) {
                    await expect(pagePO.questionOption.nth(i)).toContainText(options[i].text);
                }

                await pagePO.prevQuestion.click({force: true});
            }
        });

        test('Визуальный вид кнопки со стрелкой влево (в НЕактивном состоянии – выбран и так самый первый вопрос) (score: 1)', async () => {
            await expect(pagePO.prevQuestion).toHaveScreenshot('previous-question-button-disabled.png');
        });

        test('Визуальный вид кнопки со стрелкой влево (в активном состоянии) (score: 1)', async () => {
            await pagePO.navigationItem.last().click();

            await expect(pagePO.prevQuestion).toHaveScreenshot('previous-question-button-active.png');
        });

        test('При повторном открытии теста отображается содержимое первого НЕЗАВЕРШЕННОГО вопроса (score: 2)', async ({page}) => {
            await pagePO.questionOption.nth(1).click();
            await pagePO.nextQuestion.click();

            await page.reload();

            await expect(pagePO.question).toContainText(TEST_META.questions[1].question);
            await expect(pagePO.questionOption.nth(3)).toContainText(TEST_META.questions[1].options[3].text);

            await pagePO.questionOption.nth(3).click();
            await page.reload();

            await expect(pagePO.question).toContainText(TEST_META.questions[2].question);
            await expect(pagePO.questionOption.nth(3)).toContainText(TEST_META.questions[2].options[3].text);
        });

        test('При выборе верного варианта ответа выбранный вариант окрашивается в зеленый, а остальные опции становятся визуально неактивными (score: 1)', async () => {
            await pagePO.questionOption.filter({hasText: TEST_META.questions[0].correct}).click();

            await expect(pagePO.question).toHaveScreenshot('question-block-with-right-answer.png');
        });

        test('При выборе НЕверного варианта ответа – пункт навигации с этим вопросом окрашивается в красный цвет (score: 1)', async () => {
            await pagePO.navigationItem.nth(1).click();
            await pagePO.questionOption.filter({hasNotText: TEST_META.questions[1].correct}).first().click();

            await expect(pagePO.question).toHaveScreenshot('question-block-with-wrong-answer.png');
        });

        test('Нельзя выбрать выбрать новый вариант ответа после уже совершенного выбора (score: 1)', async () => {
            await pagePO.questionOption.nth(0).click();
            await expect(pagePO.question).toHaveScreenshot('original-choice.png');

            await pagePO.questionOption.nth(1).click({force: true});
            await pagePO.questionOption.nth(2).click({force: true});
            await pagePO.questionOption.nth(3).click({force: true});

            await expect(pagePO.question).toHaveScreenshot('original-choice.png');
        });
    });
});
