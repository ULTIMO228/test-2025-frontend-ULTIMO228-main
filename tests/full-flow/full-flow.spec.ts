import {expect, test} from '@playwright/test';
import {TestsListPagePO} from '../utils/page-objects/tests-list-page';
import {generateTest} from '../utils/generate-test';
import {Test} from '../utils';
import {RunTestPagePO} from '../utils/page-objects/run-test-page';

const {describe, beforeEach} = test;

describe('Полный флоу работы с приложением', () => {
    let listPagePO: TestsListPagePO;
    let runTestPagePO: RunTestPagePO;

    beforeEach(async ({page}) => {
        await page.goto('/');

        listPagePO = new TestsListPagePO(page);
    });

    describe('[Public] Работа с тестом, созданным через форму', () => {
        let testMock: Test;

        beforeEach(async ({page}) => {
            testMock = generateTest(1);

            await listPagePO.fillForm(testMock);
        });

        test('клик на кнопку удаления удаляет тест из списка (score: 3)', async ({page}) => {
            await expect(listPagePO.itemTitle.last()).toContainText(testMock.title);

            await listPagePO.itemDelete.last().click();

            await expect(listPagePO.itemTitle.last()).not.toContainText(testMock.title);
        });

        test('тест открывается, выводятся указанные в форме данные (score: 3)', async ({page}) => {
            await listPagePO.itemTitle.last().click();

            runTestPagePO = new RunTestPagePO(page);

            const firstQuestion = testMock.questions[0];

            await expect(runTestPagePO.title).toContainText(testMock.title);
            await expect(runTestPagePO.question).toContainText(firstQuestion.question);

            for (let i = 0; i < firstQuestion.options.length; i++) {
                const option = firstQuestion.options[i];
                await expect(runTestPagePO.questionOption.nth(i)).toContainText(option.text);
            }
        });
    });
});
