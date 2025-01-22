import {expect, test} from '@playwright/test';
import {TestsListPagePO} from '../utils/page-objects/tests-list-page';

const {describe, beforeEach} = test;

describe('Форма добавления теста', () => {
    let pagePO: TestsListPagePO;

    beforeEach(async ({page}) => {
        await page.goto('/');

        pagePO = new TestsListPagePO(page);

        await pagePO.addTestButton.click();
    });

    describe('[Public] Проверяем наличие базовых элементов формы', () => {
        test('на странице есть модальная форма (score: 1)', async ({page}) => {
            await expect(pagePO.formModal).toBeInViewport();
        });

        test('на странице есть заголовок формы (score: 1)', async ({page}) => {
            await expect(pagePO.formTitle).toContainText('Создание теста');
        });

        test('на странице есть базовые инпуты (score: 1)', async ({page}) => {
            await expect(pagePO.newTestTitle).toBeAttached();

            await pagePO.newTestTitle.fill('Название теста');

            await expect(pagePO.newTestQuestions).toHaveCount(1);

            await pagePO.newTestQuestions.fill('Вопрос 1');
        });

        test('на странице есть 4 рабочие опции для ввода вариантов ответа первого вопроса (score: 1)', async ({page}) => {
            await expect(pagePO.newTestOptions).toHaveCount(1);
            await expect(pagePO.newTestOptionInputs(0)).toHaveCount(4);
            await expect(pagePO.newTestOptionRadios(0)).toHaveCount(4);

            for (let i = 0; i < 4; i++) {
                await pagePO
                    .newTestOptionInputs(0)
                    .nth(i)
                    .fill(`Ответ ${i + 1}`);
            }

            await pagePO.newTestOptionRadios(0).nth(3).check();
        });

        test('на странице есть кнопки добавления и удаления вопросов (score: 1)', async ({page}) => {
            await expect(pagePO.addQuestionButton).toBeAttached();
            await expect(pagePO.removeQuestionButton).toBeAttached();
        });

        test('на странице есть кнопка сохранения теста (score: 1)', async ({page}) => {
            await expect(pagePO.saveButton).toBeAttached();
        });

        test('на странице нет ошибок валидации (score: 1)', async ({page}) => {
            await expect(pagePO.fillAllError).not.toBeAttached();
            await expect(pagePO.selectAnswerError).not.toBeAttached();
        });
    });

    describe('[Public] Проверяем функционал формы', () => {
        test('нажатие на кнопку добавления вопроса добавляет вопрос (score: 1)', async ({page}) => {
            await pagePO.addQuestionButton.click();

            await expect(pagePO.newTestQuestions).toHaveCount(2);
        });

        test('нажатие на кнопку удаления вопроса не удаляет вопрос если он единственный (score: 1)', async ({page}) => {
            await pagePO.removeQuestionButton.click();

            await expect(pagePO.newTestQuestions).toHaveCount(1);
        });

        test('нажатие на кнопку удаления вопроса удаляет один вопрос если он не единственный (score: 1)', async ({page}) => {
            await pagePO.addQuestionButton.click({clickCount: 2});
            await pagePO.removeQuestionButton.click();

            await expect(pagePO.newTestQuestions).toHaveCount(2);
        });

        test('если заполнить форму и нажать сохранить, то тест появится в списке (score: 1)', async ({page}) => {
            await pagePO.newTestTitle.fill('Тест по тестированию');
            await pagePO.newTestQuestions.nth(0).fill('Вопрос 1');

            for (let i = 0; i < 4; i++) {
                await pagePO
                    .newTestOptionInputs(0)
                    .nth(i)
                    .fill(`Ответ ${i + 1}`);
            }

            await pagePO.newTestOptionRadios(0).nth(2).check();
            await pagePO.saveButton.click();

            await expect(pagePO.listItems.getByText('Тест по тестированию')).toBeAttached();
        });
    });

    describe('[Public] Проверяем визуально верстку формы создания теста', () => {
        test.use({viewport: {width: 1280, height: 800}});

        test('Поля ввода ответов (score: 1)', async ({page}) => {
            await expect(pagePO.newTestOptions).toHaveScreenshot('test-form-options.png');
        });

        test('Кнопка сохранить с ховером (score: 1)', async ({page}) => {
            await pagePO.saveButton.hover();

            await expect(pagePO.saveButton).toHaveScreenshot('test-form-save-hover.png');
        });

        test('Форма с двумя вопросами (score: 1)', async ({page}) => {
            await pagePO.addQuestionButton.click();

            await expect(pagePO.formModal).toHaveScreenshot('test-form-2-questions.png');
        });

        test('Форма если нажать сохранение без заполнения полей (score: 1)', async ({page}) => {
            await pagePO.saveButton.click();

            await expect(pagePO.formModal).toHaveScreenshot('test-form-empty.png');
        });

        test('Форма если нажать сохранение при частичном заполнении полей (score: 1)', async ({page}) => {
            await pagePO.newTestTitle.fill('Тест по тестированию');
            await pagePO.newTestQuestions.nth(0).fill('Вопрос 1');
            await pagePO.newTestOptionInputs(0).nth(0).fill(`Ответ 1`);
            await pagePO.newTestOptionInputs(0).nth(3).fill(`Ответ 4`);
            await pagePO.saveButton.click();

            await expect(pagePO.formModal).toHaveScreenshot('test-form-partial-fill.png');
        });

        test('Вся страница сразу после открытия формы (score: 1)', async ({page}) => {
            await expect(page).toHaveScreenshot('test-form-page.png');
        });
    });
});
