const path = require('path');
const fs = require('fs');
const gas = require('gas-local');

const buildDir = path.resolve(__dirname, '../dist-test');
if (!fs.existsSync(buildDir)) {
  console.error('The folder dist-test doesnt exists. Run: npm run build:gas');
  process.exit(1);
}

const customGoogle = require('./mocks/GoogleMock.cjs');
Object.assign(global, gas.globalMockDefault, customGoogle);
const props = global.PropertiesService.getScriptProperties();
props.setProperty('app.email-to-forward', 'miguel.armas.abt@gmail.com');
props.setProperty('app.send-email', 'true');
props.setProperty('app.sheet-name', 'personalDailyExpenses');
props.setProperty('app.trigger-every-minutes', '1');
props.setProperty('app.webapp-base-url', 'https://script.google.com/macros/s/fakewebapp/exec');
global.SpreadsheetApp.create('personalDailyExpenses');

const app = require(path.join(buildDir, 'index.js'));
const { expenseController, runner} = app;
const { ExpenseController } = expenseController;
const { Runner } = runner;

Runner.sendEmail();