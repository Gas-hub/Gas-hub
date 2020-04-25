const PLUS = '+';
const MINUS = '-';

class VISITORS{
    constructor(){
        this.elements = {
            visitorsBlock           : this.getElementByIdBy("visitors"),
            adultBtn                : this.getElementByIdByQueryselectorAll("visitors-adults",".visitors-button-count"),
            childrenBtn             : this.getElementByIdByQueryselectorAll("visitors-children",".visitors-button-count"),
            babyBtn                 : this.getElementByIdByQueryselectorAll("visitors-baby",".visitors-button-count"),
            inputVisitors           : this.getElementByIdBy("input-visitors"),
            adultsCount             : this.getElementByIdBy("adults-count"),
            childrenCount           : this.getElementByIdBy("children-count"),
            babyCount               : this.getElementByIdBy("baby-count"),
            formCountVisitorsClear  : this.getElementByIdBy("form-count-data-clear"),
            formCountVisitorsAply   : this.getElementByIdBy("form-count-data-apply"),
            
        }
        this.currentAdultsCount = 0;
        

        
        this.init();
    }
    
    init(){
        this.eventsTrigger();
    }

    eventsTrigger(){
        let currentAdultsCount = 0;
        let currentChildrenCount = 0;
        let currentBabyCount = 0;

        this.elements.inputVisitors.addEventListener('click',(e)=>{
            this.elements.visitorsBlock.style = "display: block;"
        })
        
        
        this.elements.adultBtn.forEach( (button) => {
            button.addEventListener('click', (e)=>{
                if(e.target.id === "adults-button-plus"){
                    this.elements.adultsCount.innerHTML = ++currentAdultsCount;
                    this.summaVisitors(currentAdultsCount,currentChildrenCount,currentBabyCount)

                }else if(e.target.id === "adults-button-minus"){
                    if(currentAdultsCount <= 0)
                        currentAdultsCount = 1;
                    this.elements.adultsCount.innerHTML = --currentAdultsCount;
                    this.summaVisitors(currentAdultsCount,currentChildrenCount,currentBabyCount)
                }
            })
        })
        this.elements.childrenBtn.forEach( (button) => {
            button.addEventListener('click', (e)=>{
                if(e.target.id === "children-button-plus"){
                    this.elements.childrenCount.innerHTML = ++currentChildrenCount;
                   this.summaVisitors(currentAdultsCount,currentChildrenCount,currentBabyCount)

                }else if(e.target.id === "children-button-minus"){
                    if(currentChildrenCount <= 0)
                        currentChildrenCount = 1;
                    this.elements.childrenCount.innerHTML = --currentChildrenCount;
                    this.summaVisitors(currentAdultsCount,currentChildrenCount,currentBabyCount)
                }
            })
        })
        this.elements.babyBtn.forEach( (button) => {
            button.addEventListener('click', (e)=>{
                if(e.target.id === "baby-button-plus"){
                     this.elements.babyCount.innerHTML = ++currentBabyCount;
                     this.summaVisitors(currentAdultsCount,currentChildrenCount,currentBabyCount)

                }else if(e.target.id === "baby-button-minus"){
                    if(currentBabyCount <= 0)
                         currentBabyCount = 1;
                     this.elements.babyCount.innerHTML = --currentBabyCount;
                     this.summaVisitors(currentAdultsCount,currentChildrenCount,currentBabyCount)
                }
            })
        })
        this.elements.formCountVisitorsAply.addEventListener('click',(e)=>{
            this.elements.visitorsBlock.style = "display: none;"
        })
        this.elements.formCountVisitorsClear.addEventListener('click',(e)=>{
            currentAdultsCount = 0;
            currentChildrenCount = 0;
            currentBabyCount = 0;
            this.summaVisitorsClear();
        })
       
    }
   

    summaVisitors(n1,n2,n3){
        let visitors = n1+n2+n3;
        this.elements.inputVisitors.value = visitors;
    }
    summaVisitorsClear(){
        this.elements.inputVisitors.value = "";
        this.elements.adultsCount.innerHTML = 0;
        this.elements.childrenCount.innerHTML = 0;
        this.elements.babyCount.innerHTML = 0;
    }

   
  

    
    getElementByIdByQueryselectorAll(id,selectorName){
        return document.getElementById(id).querySelectorAll(selectorName);
    }
    

    getElementByIdBy(id) {
        return document.getElementById(id);
    }
}

(function(){
    new VISITORS();
})();