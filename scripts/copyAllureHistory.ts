import fs from 'fs';
import path from 'path';

const historySource = path.join('allure-report', 'history');
const historyTarget = path.join('allure-results', 'history');

if (fs.existsSync(historySource)) {
    fs.cpSync(historySource, historyTarget, { recursive: true });
    console.log('Copied previous Allure history — trend graphs will include past runs.');
} else {
    console.log('No previous Allure history found — trend graphs will start fresh from this run.');
}
