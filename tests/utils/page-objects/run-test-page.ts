import {Locator, Page} from '@playwright/test';

export class RunTestPagePO {
    constructor(private readonly page: Page) {}

    title = this.page.getByTestId('test-title');
    navigation = this.page.getByTestId('navigation');
    navigationItem = this.navigation.locator('[test-id="navigation-item"]:visible');
    question = this.page.locator('[test-id="question"]:visible');
    questionOption = this.page.locator('[test-id="question"]:visible').getByTestId('question-option');
    nextQuestion = this.page.getByTestId('next-question');
    prevQuestion = this.page.getByTestId('prev-question');
    finishTestButton = this.page.getByTestId('finish-button');
    resetTestButton = this.page.getByTestId('reset-test-button');
    backToTestListPage = this.page.getByTestId('back-to-test-list-page');
    modal = this.page.getByTestId('modal');

    getOptionsByQuestion(questionIndex: number): Locator {
        return this.question.nth(questionIndex).locator('[test-id="question-option"]');
    }
}
