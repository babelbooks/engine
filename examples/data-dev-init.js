const services = require('../dist/elastic/elastic.services');

var jsonObj = require('./data-dev-init.json');

let i = 0;
promiseLoop( () => { 
    return i < jsonObj.length;
 },
  () => {
      let book = jsonObj[i];
      i++;
      return services
        .addBook(book)
        .then(() => {
            console.log("Book inserted.");
        })
        .catch(() => { 
            console.log("erreur");
        })
  });

function promiseLoop(condition, action) {  
    let loop = () => {    
        if(!condition()) {      
            return;   
        }    
        return action().then(loop);  
    };  
    return Promise.resolve().then(loop);
}