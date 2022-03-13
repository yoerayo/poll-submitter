const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bizjournals.com/nashville/pulse/survey/nashville-inno-madness-round-two/22050163');
  const questionContainers = await page.$$('div[data-field-type="radio"]');
  const numberOfQuestions = questionContainers.length;
  for (var i = 0; i < numberOfQuestions; i++) {
    let selection = await questionContainers[i].evaluateHandle( (el) => {
      let aptoOption = el.querySelector('input[value="Apto Global"]');
      console.log(`I found an apto option: ${!!aptoOption}`);
      let possibleSelections = el.querySelectorAll('input[type="radio"]');
      return aptoOption || possibleSelections[Math.floor(Math.random() * 2)];
    });
    await selection.tap();
    
    let continueButton = await questionContainers[i].evaluateHandle( (el) => el.querySelector('a.pulse-next-question'));
    if (continueButton.asElement() != null) {
      await continueButton.tap();
    } else {
      let submitButton = await questionContainers[i].evaluateHandle( (el) => el.querySelector('button[type="submit"]'));  
      await submitButton.tap();
    }
  }

  await browser.close();
})();