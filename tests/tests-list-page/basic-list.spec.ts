import {expect, test} from '@playwright/test';
import {TestsListPagePO} from '../utils/page-objects/tests-list-page';

const {describe, beforeEach} = test;

describe('Экран списка тестов', () => {
    let pagePO: TestsListPagePO;

    beforeEach(async ({page}) => {
        await page.goto('/');

        pagePO = new TestsListPagePO(page);
    });

    describe('[Public] Проверяем наличие базовых элементов на странице', () => {
        test('на странице есть заголовок (score: 1)', async ({page}) => {
            await expect(pagePO.title).toContainText('Добро пожаловать');
        });

        test('на странице есть подзаголовок (score: 1)', async ({page}) => {
            await expect(pagePO.subtitle).toContainText('Сайт посвящен прохождению тестов. Выберите тест, который хотите пройти.');
        });

        test('у первого элемента списка можно прочитать название (score: 1)', async ({page}) => {
            await expect(pagePO.itemTitle.nth(0)).toContainText('Тест на знание русской литературы');
        });

        test('на странице нет формы добавления теста (score: 1)', async ({page}) => {
            await expect(pagePO.formModal).not.toBeInViewport();
        });
    });

    describe('[Public] Проверяем визуально верстку страницы списка тестов', () => {
        test.use({viewport: {width: 1280, height: 480}});

        test('Список тестов (score: 1)', async ({page}) => {
            await expect(pagePO.listItems).toHaveScreenshot('tests-list.png');
        });

        test('Список тестов когда ховер на втором (score: 2)', async ({page}) => {
            await pagePO.itemTitle.nth(1).hover();

            await expect(pagePO.listItems).toHaveScreenshot('tests-list-hover.png');
        });
    });
});
