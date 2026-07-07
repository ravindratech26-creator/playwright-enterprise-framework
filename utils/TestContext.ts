export class TestContext {

    private static testName = '';

    static setTestName(name: string): void {
        this.testName = name;
    }

    static getTestName(): string {
        return this.testName;
    }

}