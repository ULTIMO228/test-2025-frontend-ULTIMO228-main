import {Page} from '@playwright/test';

export interface Question {
    id: string;
    question: string;
    correct: string;
    options: Array<{id: string; text: string}>;
}

export interface Test {
    id: string;
    title: string;
    questions: Question[];
}

export async function mockData(page: Page, data: Test[] | undefined): Promise<void> {
    await page.route('data.json', async route => route.fulfill({json: data}));
}
