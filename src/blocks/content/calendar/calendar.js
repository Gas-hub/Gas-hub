const AVAILABLE_WEEK_DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
const localStorageName = 'calendar-events';

class CALENDAR {       
    constructor(options) {
        this.options = options;
        this.elements = {
            calendar: this.getElementByQuerySelector('#calendar'),
            days: this.getFirstElementInsideIdByClassName('calendar-days'),
            week: this.getFirstElementInsideIdByClassName('calendar-week'),
            month: this.getFirstElementInsideIdByClassName('calendar-month'),
            year: this.getFirstElementInsideIdByClassName('calendar-current-year'),
            prevMonth: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-prev'),
            nextMonth: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-next'),
            inputCheckin: this.getElementByQuerySelector('#input-check-in'), 
            inputCheckout: this.getElementByQuerySelector('#input-check-out'),
            formDataApply: this.getElementByQuerySelector('#form-calendar-data-apply'),
            formDataClear: this.getElementByQuerySelector('#form-calendar-data-clear')
            
        };
        

        this.eventList = JSON.parse(localStorage.getItem(localStorageName)) || {};

        this.arrayDays = this.elements.days.childNodes;
        this.countClick = 0;
        this.date = +new Date();
        this.options.maxDays = 35;
        this.init();
    }

// App methods
    init() {
        if (!this.options.id) return false;
        this.eventsTrigger();
        this.drawAll();
    }

    // draw Methods
    drawAll() {
        this.drawWeekDays();
        this.drawMonths();
        this.drawDays();
        this.drawYearAndCurrentDay();
    }

    drawYearAndCurrentDay() {
        let calendar = this.getCalendar();
        this.elements.year.innerHTML = calendar.active.year;
    }

    drawDays() {
        let calendar = this.getCalendar();
        let latestDaysInPrevMonth = this.range(calendar.active.startWeek).map((day, idx) => {
            return {
                dayNumber: this.countOfDaysInMonth(calendar.pMonth) - idx,
                month: new Date(calendar.pMonth).getMonth(),
                year: new Date(calendar.pMonth).getFullYear(),
                currentMonth: false
            }
        }).reverse();


        let daysInActiveMonth = this.range(calendar.active.days).map((day, idx) => {
           
            let dayNumber = idx + 1;
            let today = new Date();
            return {
                dayNumber,
                today: today.getDate() === dayNumber && today.getFullYear() === calendar.active.year && today.getMonth() === calendar.active.month,
                month: calendar.active.month,
                year: calendar.active.year,   
                currentMonth: true
            }
        });


        let countOfDays = this.options.maxDays - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
        let daysInNextMonth = this.range(countOfDays).map((day, idx) => {
            return {
                dayNumber: idx + 1,
                month: new Date(calendar.nMonth).getMonth(),
                year: new Date(calendar.nMonth).getFullYear(),
                currentMonth: false
            }
        });

        let days = [...latestDaysInPrevMonth, ...daysInActiveMonth, ...daysInNextMonth];

        let daysTemplate = "";
        days.forEach(day => {
            daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selectedFirstDay ? 'selected-day' : ''} ${day.selectedSecondDay ? 'selected-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" data-year="${day.year}"></li>`
        });

        this.elements.days.innerHTML = daysTemplate;
    }

    drawMonths() {
        let availableMonths = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        let monthTemplate = "";
        let calendar = this.getCalendar();
         monthTemplate += `<span class="${'active'}" data-month="${calendar.active.month}">${availableMonths[calendar.active.month]}</span>`;
        
        this.elements.month.innerHTML = monthTemplate;
    }

    drawWeekDays() {
        let weekTemplate = "";
        AVAILABLE_WEEK_DAYS.forEach(week => {
            weekTemplate += `<li>${week.slice(0, 2)}</li>`
        });

        this.elements.week.innerHTML = weekTemplate;
    }

    // Service methods
    eventsTrigger() {
        let calendar = this.getCalendar();
        let arraySelectedDayIndex = [];
        this.elements.prevMonth.addEventListener('click', (e) => {
             calendar = this.getCalendar();
            this.updateTime(calendar.pMonth);
            this.drawAll()
        });

        this.elements.nextMonth.addEventListener('click', (e) => {
            calendar = this.getCalendar();
            this.updateTime(calendar.nMonth);
            this.drawAll()
        });
        this.elements.inputCheckin.addEventListener('click', (e)=>{
            this.elements.calendar.style = "display: block;"
            
        })
        this.elements.inputCheckout.addEventListener('click', (e)=>{
            this.elements.calendar.style = "display: block;"
            
        })
        this.elements.formDataApply.addEventListener('click', (e) => {
            e.preventDefault();
            this.elements.calendar.style = "display: none;"   
        })
        this.elements.formDataClear.addEventListener('click', (e) => {
            e.preventDefault();
            this.eventClearTrigger();
        })
        
        this.elements.days.addEventListener('click', (e) => {
            let firstSelectedDay;
            let secondSelectedDay;
            if(this.countClick === 0){
                firstSelectedDay = this.selectedDay(e);
                arraySelectedDayIndex[this.countClick] = firstSelectedDay.index; 
                this.countClick +=1; 
                
                this.elements.inputCheckin.value = firstSelectedDay.strDate;
            
           }
           else if(this.countClick === 1){
            secondSelectedDay = this.selectedDay(e);
            arraySelectedDayIndex[this.countClick] = secondSelectedDay.index;
            arraySelectedDayIndex.sort((a,b)=>a-b);

            for(let i = 0; i < this.arrayDays.length; i++){
                if(i >= arraySelectedDayIndex[0] && i <= arraySelectedDayIndex[1]){
                    this.arrayDays[i].classList.add('between-selected-days');
                }
            }
            this.elements.inputCheckout.value = secondSelectedDay.strDate;
            this.arrayDays[arraySelectedDayIndex[0]].classList.add('selected-day_1');
            this.arrayDays[arraySelectedDayIndex[1]].classList.add('selected-day_2');
            this.countClick +=1;
           }else{
               this.eventClearTrigger();
               this.countClick = 0;
           }          
        }); 
    }
    selectedDay(event){
        let element = event.target;
        let day = element.getAttribute('data-day');
        let month = element.getAttribute('data-month');
        let year = element.getAttribute('data-year');
        
        let index = Array.prototype.indexOf.call(this.arrayDays, event.target)
         
        element.classList.add('selected-day');
    
        if (!day) return false;
        let strDate = `${day}.${Number(month) + 1}.${year}`;
        return {
            index,
            day,
            month,
            year,
            strDate
        };
      }
      
      eventClearTrigger(){
        this.arrayDays.forEach((day)=>{
            day.classList.remove('selected-day');
            day.classList.remove('selected-day_1');
            day.classList.remove('selected-day_2');
            day.classList.remove('between-selected-days');
            this.elements.inputCheckin.value = "";
            this.elements.inputCheckout.value = "";
           })
      }

    updateTime(time) {
        this.date = +new Date(time);
    }

    getCalendar() {
        let time = new Date(this.date);
        return {
            active: {
                days: this.countOfDaysInMonth(time),
                startWeek: this.getStartedDayOfWeekByTime(time),
                day: time.getDate(),
                week: time.getDay(),
                month: time.getMonth(),
                year: time.getFullYear(),
                formatted: this.getFormattedDate(time),
                tm: +time
            },
            pMonth: new Date(time.getFullYear(), time.getMonth() - 1, 1),
            nMonth: new Date(time.getFullYear(), time.getMonth() + 1, 1),
            pYear: new Date(new Date(time).getFullYear() - 1, 0, 1),
            nYear: new Date(new Date(time).getFullYear() + 1, 0, 1)
        }
    }

    countOfDaysInMonth(time) {
        let date = this.getMonthAndYear(time);
        return new Date(date.year, date.month + 1, 0).getDate();
    }

    getStartedDayOfWeekByTime(time) {
        let date = this.getMonthAndYear(time);
        return new Date(date.year, date.month, 0).getDay();
    }

    getMonthAndYear(time) {
        let date = new Date(time);
        return {
            year: date.getFullYear(),
            month: date.getMonth()
        }
    }

    getFormattedDate(date) {
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    }

    range(number) {
        if(number < 0)
            number = 5;
        return new Array(number).fill().map((e, i) => i);
    }

    getFirstElementInsideIdByClassName(className) {
        return document.getElementById(this.options.id).getElementsByClassName(className)[0];
    }
    getElementByQuerySelector(selectorName) {
        return document.querySelector(selectorName);
    }
}


(function () {
    new CALENDAR({
        id: "calendar"
    })
})();

