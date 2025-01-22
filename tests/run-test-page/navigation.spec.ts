import {expect, test} from '@playwright/test';
import {mockData} from '../utils';
import {RunTestPagePO} from '../utils/page-objects/run-test-page';
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

    describe('[Public] Проверка навигации по вопросам', () => {
        describe('Mobile', () => {
            test.use({viewport: {width: 600, height: 800}});

            test('Навигация скрыта (score: 1)', async () => {
                await expect(pagePO.navigation).not.toBeVisible();
                await expect(pagePO.navigationItem).not.toBeVisible();
            });

            test('Но зато визуально сразу видны все вопросы (score: 1)', async () => {
                await expect(pagePO.question).toHaveCount(TEST_META.questions.length);

                for (let i = 0; i < TEST_META.questions.length; i++) {
                    await expect(pagePO.question.nth(i)).toContainText(TEST_META.questions[i].question);
                }
            });
        });

        describe('Desktop', () => {
            test.use({viewport: {width: 1280, height: 400}});

            test('Навигация видна (score: 1)', async () => {
                await expect(pagePO.navigation).toBeVisible();
            });

            test('В навигации перечислены все N вопросов (score: 1)', async () => {
                await expect(pagePO.navigationItem).toHaveCount(TEST_META.questions.length);
            });

            test('Визуально видно содержимое только 1 вопроса (что был выбран в навигации) (score: 1)', async () => {
                await expect(pagePO.question).toHaveCount(1);

                await expect(pagePO.question).toContainText(TEST_META.questions[0].question);

                await pagePO.navigationItem.nth(1).click();

                await expect(pagePO.question).toHaveCount(1);

                await expect(pagePO.question).toContainText(TEST_META.questions[1].question);
            });

            describe('Проверяем визуально верстку навигации', () => {
                test('Первый элемент списка активный (изначально, без ховера над ним) (score: 1)', async () => {
                    await expect(pagePO.navigation).toHaveScreenshot('question-navigation-1.png');
                });

                test('Второй элемент списка активный (score: 1)', async () => {
                    await pagePO.navigationItem.nth(1).click();

                    await expect(pagePO.navigation).toHaveScreenshot('question-navigation-2.png');
                });

                test('Третий элемент списка активный (score: 1)', async () => {
                    await pagePO.navigationItem.nth(2).click();

                    await expect(pagePO.navigation).toHaveScreenshot('question-navigation-3.png');
                });

                test('При выборе верного варианта ответа – пункт навигации с этим вопросом окрашивается в зеленый цвет (score: 1)', async () => {
                    await pagePO.questionOption.filter({hasText: TEST_META.questions[0].correct}).click();

                    await expect(pagePO.navigation).toHaveScreenshot('question-navigation-right-answer.png');
                });

                test('При выборе НЕверного варианта ответа – пункт навигации с этим вопросом окрашивается в красный цвет (score: 1)', async () => {
                    await pagePO.questionOption.filter({hasNotText: TEST_META.questions[0].correct}).first().click();

                    await expect(pagePO.navigation).toHaveScreenshot('question-navigation-wrong-answer.png');
                });
            });
        });

        test('При клике на кнопку "Тесты" происходит навигация на стартовую страницу с тестами (score: 1)', async ({page}) => {
            await pagePO.backToTestListPage.click();

            await expect(page).toHaveURL(`/`);
        });

        test('Окрашивание элементов навигации сохраняется, если выбран новый верный/неверный ответ (score: 2)', async () => {
            await pagePO.questionOption.filter({hasText: TEST_META.questions[0].correct}).click();

            await pagePO.navigationItem.nth(1).click();
            await pagePO.questionOption.filter({hasText: TEST_META.questions[1].correct}).click();

            await pagePO.navigationItem.nth(2).click();
            await pagePO.questionOption.filter({hasNotText: TEST_META.questions[2].correct}).first().click();

            await pagePO.navigationItem.nth(3).click();
            await pagePO.questionOption.filter({hasNotText: TEST_META.questions[3].correct}).first().click();

            await expect(pagePO.navigation).toHaveScreenshot('question-navigation-wrong-right-highlight.png');
        });
    });
});
