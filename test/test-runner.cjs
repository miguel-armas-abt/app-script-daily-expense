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

const app = require(path.join(buildDir, 'index.js'));
const { expensesRepository, mailer, expenseIdentifierService} = app;
const { ExpenseRepository } = expensesRepository;
const { Mailer } = mailer;
const { ExpenseIdentifierService } = expenseIdentifierService;

const props = global.PropertiesService.getScriptProperties();
props.setProperty('app.forward.to.email', 'miguel.armas.abt@gmail.com');
props.setProperty('app.send.email', 'true');
props.setProperty('app.sheet.name', 'personalDailyExpenses');
props.setProperty('app.timezone', 'America/Lima');
props.setProperty('app.trigger.every.minutes', '1');
props.setProperty('app.webapp.base.url', 'https://script.google.com/macros/s/fakewebapp/exec');

global.SpreadsheetApp.create('PersonalExpensesDB');

ExpenseIdentifierService.findConstanciesAndPersist();

// const expense = {
//   gmailMessageId: 'test-123',
//   from: 'MANUAL',
//   subject: 'MANUAL',
//   source: 'MANUAL',
//   kind: 'MANUAL',
//   currency: 'PEN',
//   amount: 25.4,
//   category: 'COMIDA Y HOGAR',
//   comments: 'prueba local',
//   expenseDate: new Date().toISOString()
// };

// const id = ExpenseRepository.insert(expense);
// console.log('[insert] id:', id);

// const ok = ExpenseRepository.updateByGmailMessageId('test-123', 'SERVICIOS', 'ajuste', 30.1);
// console.log('[update] ok:', ok);

// ExpenseRepository.sortByExpenseDateDesc();
// console.log('[sort] done');

// Mailer.sendCategorizeMail('test@example.com', {
//   gmailMessageId: 'test-123',
//   amount: 30.1,
//   expenseDate: '2025-11-10 10:00:00',
//   source: 'BBVA',
//   kind: 'PLIN',
//   comments: 'Hugo'
// });