import {Page} from '@playwright/test';
import {Test} from '../mock-data';

export class TestsListPagePO {
    constructor(private readonly page: Page) {}

    title = this.page.getByTestId('list-title');
    subtitle = this.page.getByTestId('list-subtitle');
    listItems = this.page.getByTestId('list-items');
    itemTitle = this.page.getByTestId('list-item-title');
    itemDelete = this.page.getByTestId('list-item-delete');
    addTestButton = this.page.getByTestId('list-add-button');

    formModal = this.page.getByTestId('form-modal');
    formTitle = this.page.getByTestId('form-title');
    newTestTitle = this.page.getByTestId('new-test-title');
    newTestQuestions = this.page.getByTestId('new-test-question');
    newTestOptions = this.page.getByTestId('new-test-options');
    newTestOptionRadios = (questionIndex: number) => this.newTestOptions.nth(questionIndex).getByRole('radio');
    newTestOptionInputs = (questionIndex: number) => this.newTestOptions.nth(questionIndex).getByRole('textbox');
    addQuestionButton = this.page.getByTestId('add-question-button');
    removeQuestionButton = this.page.getByTestId('remove-question-button');
    saveButton = this.page.getByTestId('save-button');
    fillAllError = this.page.getByText('Все поля должны быть заполнены');
    selectAnswerError = this.page.getByText('Выберите правильный ответ в созданных вопросах');

    async fillForm(testMock: Test): Promise<void> {
        await this.addTestButton.click();

        await this.newTestTitle.fill(testMock.title);
        await this.newTestQuestions.nth(0).fill(testMock.questions[0].question);

        for (let i = 0; i < 4; i++) {
            await this.newTestOptionInputs(0).nth(i).fill(testMock.questions[0].options[i].text);
        }

        const correctIndex = testMock.questions[0].options.findIndex(option => option.text === testMock.questions[0].correct);

        await this.newTestOptionRadios(0).nth(correctIndex).check();
        await this.saveButton.click();
    }
}
