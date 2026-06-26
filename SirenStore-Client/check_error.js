const jsdom = require("jsdom");
const { JSDOM } = jsdom;

JSDOM.fromURL("http://localhost:4200/", { 
  runScripts: "dangerously", 
  resources: "usable",
  pretendToBeVisual: true
}).then(dom => {
  dom.window.console.error = (...args) => console.error('BROWSER ERROR:', ...args);
  dom.window.console.warn = (...args) => console.warn('BROWSER WARN:', ...args);
  dom.window.console.log = (...args) => console.log('BROWSER LOG:', ...args);
  
  dom.window.addEventListener("error", (event) => {
    console.error("UNCAUGHT ERROR:", event.error);
  });

  setTimeout(() => {
    console.log("Body HTML after 3s:", dom.window.document.body.innerHTML);
    process.exit(0);
  }, 3000);
}).catch(err => {
  console.error("JSDOM error:", err);
});
