import {expect, test} from '@playwright/test';
import {TestsListPagePO} from '../utils/page-objects/tests-list-page';

const {describe, beforeEach} = test;

describe('Удаление тестов', () => {
    let pagePO: TestsListPagePO;

    beforeEach(async ({page}) => {
        await page.goto('/');

        pagePO = new TestsListPagePO(page);
    });

    describe('[Public] Проверяем базовые элементы для добавления и удаления тестов', () => {
        test('на странице есть кнопка добавления теста (score: 1)', async ({page}) => {
            await expect(pagePO.addTestButton).toBeAttached();
        });

        test('у первого элемента списка есть кнопка удаления (score: 1)', async ({page}) => {
            await expect(pagePO.itemDelete.nth(0)).toBeAttached();
        });
    });

    describe('[Public] Проверяем визуально элемент добавления теста', () => {
        test.use({viewport: {width: 1280, height: 480}});

        test('Кнопка добавления находится там где ожидается (score: 1)', async ({page}) => {
            await expect(page).toHaveScreenshot('tests-list-page.png');
        });

        test('Кнопка добавления теста с ховером и без (score: 1)', async ({page}) => {
            await expect(pagePO.addTestButton).toHaveScreenshot('add-button.png');

            await pagePO.addTestButton.hover();

            await expect(pagePO.addTestButton).toHaveScreenshot('add-button-hover.png');
        });
    });
});
