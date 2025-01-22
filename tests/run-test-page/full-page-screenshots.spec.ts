import {expect, test} from '@playwright/test';
import {RunTestPagePO} from '../utils/page-objects/run-test-page';
import {mockData} from '../utils';
import {TEST_META} from './mocks';

const {describe, beforeEach} = test;

describe('Экран прохождения теста', () => {
    let pagePO: RunTestPagePO;

    beforeEach(async ({page}) => {
        await mockData(page, [TEST_META]);
        await page.goto(`/test/index.html?testId=${TEST_META.id}`);

        pagePO = new RunTestPagePO(page);
    });

    describe('[Public] Полноэкранные скриншоты страницы', () => {
        describe('Desktop', () => {
            test.use({viewport: {width: 700, height: 600}});

            test('начальное состояние страницы (score: 1)', async ({page}) => {
                await expect(page).toHaveScreenshot('run-test-page-initial-desktop.png');
            });

            test('часть вопросов теста уже завершено (score: 1)', async ({page}) => {
                await pagePO.questionOption.nth(1).click();
                await pagePO.nextQuestion.click();
                await pagePO.questionOption.nth(2).click();
                await pagePO.nextQuestion.click();

                await expect(page).toHaveScreenshot('run-test-page-partially-completed-desktop.png');
            });
        });

        describe('Mobile', () => {
            test.use({viewport: {width: 600, height: 800}});

            test('начальное состояние страницы (score: 1)', async ({page}) => {
                await expect(page).toHaveScreenshot('run-test-page-initial-mobile.png', {fullPage: true});
            });

            test('часть вопросов теста уже завершено (score: 1)', async ({page}) => {
                await pagePO.getOptionsByQuestion(0).nth(1).click();
                await pagePO.getOptionsByQuestion(1).nth(2).click();

                await expect(page).toHaveScreenshot('run-test-page-partially-completed-initial-mobile.png', {fullPage: true});
            });
        });
    });
});
