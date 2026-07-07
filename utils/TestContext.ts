export class TestContext {

    private static testName = '';
    private static startTime = 0;

    static setTestName(name: string): void {
        this.testName = name;
    }

    static getTestName(): string {
        return this.testName;
    }

    static setStartTime(): void {
        this.startTime = Date.now();
    }

    static getExecutionTime(): number {
        return Date.now() - this.startTime;
    }

}