import {expect, test} from '@playwright/test';
import {mockData} from '../utils';
import {RunTestPagePO} from '../utils/page-objects/run-test-page';
import {TEST_META} from './mocks';

const {describe, beforeEach} = test;

describe('Экран прохождения теста', () => {
    let pagePO: RunTestPagePO;

    beforeEach(async ({page}) => {
        await mockData(page, [
            {id: '1', title: 'Dumb тест, чтобы убедиться, что из json достается именно нужный элемент, а не любой', questions: []},
            TEST_META,
            {id: '3', title: 'Еще один dumb тест, чтобы убедиться, что из json достается именно нужный элемент, а не любой', questions: []},
        ]);
        await page.goto(`/test/index.html?testId=${TEST_META.id}`);

        pagePO = new RunTestPagePO(page);
    });

    describe('[Public] Проверка факта существования всех нужных базовых элементов на странице', () => {
        test('страница успешно открывается, если перейти по ссылке, содержащей testId query параметр – нет никаких редиректов или 404 (score: 1)', async ({
            page,
        }) => {
            await expect(page).toHaveURL(`/test/index.html?testId=${TEST_META.id}`);
        });

        test('на странице есть навигация (score: 1)', async ({page}) => {
            await expect(pagePO.navigation).toBeAttached();
        });

        test('на странице есть заголовок с названием теста (score: 1)', async ({page}) => {
            await expect(pagePO.title).toContainText(TEST_META.title);
        });

        test('на странице есть кнопка завершения теста (score: 1)', async ({page}) => {
            await expect(pagePO.finishTestButton).toBeAttached();
        });

        test('сразу открывается первый вопрос и можно прочесть заголовок этого вопроса (score: 1)', async ({page}) => {
            await expect(page.locator('body')).toContainText(TEST_META.questions[0].question);
        });

        test('сразу открывается первый вопрос и можно увидеть все опции выбора первого вопроса (score: 1)', async ({page}) => {
            for (const option of TEST_META.questions[0].options) {
                await expect(page.locator('body')).toContainText(option.text);
            }
        });
    });
});
