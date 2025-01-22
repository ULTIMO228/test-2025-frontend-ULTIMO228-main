import {expect, test} from '@playwright/test';
import {RunTestPagePO} from '../utils/page-objects/run-test-page';
import {mockData} from '../utils';
import {TEST_META} from './mocks';

const {describe, beforeEach} = test;

describe('Экран прохождения теста', () => {
    test.use({viewport: {width: 800, height: 700}});

    let pagePO: RunTestPagePO;

    beforeEach(async ({page}) => {
        await mockData(page, [TEST_META]);
        await page.goto(`/test/index.html?testId=${TEST_META.id}`);

        pagePO = new RunTestPagePO(page);
    });

    describe('[Public] Кнопка завершения теста', () => {
        test('При нажатии на кнопку показывается модальное окно с подтверждением выбора (score: 1)', async () => {
            await expect(pagePO.modal).not.toBeInViewport();

            await pagePO.questionOption.first().click();
            await pagePO.finishTestButton.click();
            await expect(pagePO.modal).toBeInViewport();

            await expect(pagePO.modal).toContainText('Вы точно хотите завершить тест?');
            await expect(pagePO.modal).toContainText('Да');
            await expect(pagePO.modal).toContainText('Нет');
        });

        test('Визуально открытое модальное окно выглядит следующим образом (score: 1)', async ({page}) => {
            await pagePO.questionOption.first().click();
            await pagePO.finishTestButton.click();
            await expect(pagePO.modal).toHaveScreenshot('confirmation-modal.png');
        });

        test('При клике на слово Нет (в модалке подтверждения выбора) - модальное окно закрывается (score: 1)', async () => {
            await pagePO.questionOption.first().click();
            await pagePO.nextQuestion.click();

            await pagePO.finishTestButton.click();
            await expect(pagePO.modal).toBeInViewport();

            await pagePO.modal.getByText('Нет').click();

            await expect(pagePO.modal).not.toBeInViewport();
        });

        describe('При клике на слово Да (в модалке подтверждения выбора) – показывается попап с результатами', () => {
            beforeEach(async () => {
                await pagePO.questionOption.first().click();
                await pagePO.nextQuestion.click();

                await pagePO.questionOption.nth(2).click();
                await pagePO.nextQuestion.click();

                await pagePO.questionOption.nth(2).click();

                await pagePO.finishTestButton.click();
                await expect(pagePO.modal).toBeInViewport();

                await pagePO.modal.getByText('Да').click();
            });

            test('в результатах есть заголовок (score: 1)', async () => {
                await expect(pagePO.modal).toContainText('Вы завершили тест');
            });

            test('верное количество подсчитанных верных ответов (score: 1)', async () => {
                await expect(pagePO.modal).toContainText('Правильных ответов - 1');
            });

            test('верное количество подсчитанных НЕверных ответов (score: 1)', async () => {
                await expect(pagePO.modal).toContainText('Неправильных ответов - 2');
            });

            test('верное количество подсчитанных вопросов без ответа (score: 1)', async () => {
                await expect(pagePO.modal).toContainText('Вопросов без ответа - 1');
            });

            test('есть кнопка "Понятно", при клике на которую попап закрывается (score: 1)', async () => {
                await pagePO.modal.getByText('Понятно').click();
                await expect(pagePO.modal).not.toBeInViewport();
            });
        });
    });

    describe('[Public] После завершения теста', () => {
        beforeEach(async () => {
            await pagePO.questionOption.first().click();
            await pagePO.nextQuestion.click();

            await pagePO.questionOption.nth(2).click();
            await pagePO.nextQuestion.click();

            await pagePO.questionOption.nth(3).click();

            await pagePO.finishTestButton.click();

            await pagePO.modal.getByText('Да').click();
            await pagePO.modal.getByText('Понятно').click();
        });

        test('Кнопка "Пройти тест заново" присутствует на странице (score: 1)', async () => {
            await expect(pagePO.resetTestButton).toBeAttached();
        });

        test('При клике на кнопку "Пройти тест заново" появляется окно для подтверждения выбора (score: 1)', async () => {
            await pagePO.resetTestButton.click();

            await expect(pagePO.modal).toContainText('Вы точно хотите перепройти тест?');
            await expect(pagePO.modal).toContainText('Да');
            await expect(pagePO.modal).toContainText('Нет');
        });

        test('Можно кликнуть кнопку "Пройти тест заново" и пройти его заново по-другому (при полном заполнении сразу видим результаты без подтвержения выбора) (score: 1)', async ({
            page,
        }) => {
            await pagePO.resetTestButton.click();
            await page.getByText('Да').click();
            await pagePO.navigationItem.first().click();

            for (let i = 0; i < TEST_META.questions.length; i++) {
                await pagePO.questionOption.first().click();
                await pagePO.nextQuestion.click({force: true});
            }

            await pagePO.finishTestButton.click();
            await expect(pagePO.modal).toContainText('Правильных ответов - 1');
            await expect(pagePO.modal).toContainText('Неправильных ответов - 3');
            await expect(pagePO.modal).not.toContainText('Вопросов без ответа');
        });

        test('Попытки кликов на опции выбора не меняют что-либо на странице (score: 1)', async () => {
            await pagePO.navigationItem.last().click();

            await expect(pagePO.question).toHaveScreenshot('last-question-after-finish-test.png');

            await pagePO.questionOption.last().click({force: true});

            await expect(pagePO.question).toHaveScreenshot('last-question-after-finish-test.png');
        });
    });
});
