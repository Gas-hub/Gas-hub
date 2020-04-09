import './calendar/calendar'

class FORM {
    constructor(){
        this.elements = {
            inputChecin: this.getElementByQuerySelector('#input-check-in'), 
            inputChecout: this.getElementByQuerySelector('#input-check-out'),
           
        }
        this.init();
    }
    init(){
        this.eventsTrigger()
    }
    
    eventsTrigger(){
        this.elements.inputChecin.addEventListener('click', e => {
          
       });
        this.elements.inputChecout.addEventListener('click', e => {
           
       });
       
        
    }

    getElementByQuerySelector(selectorName) {
        return document.querySelector(selectorName);
    }
}

(function () {
    new FORM()
})();