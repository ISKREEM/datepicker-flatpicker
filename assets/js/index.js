//Simulacion de consumo API
var arr = []

async function firstAsync() {
    d = await api().then(x => x["currentDateTime"])
    arr.push(d)
    return arr
}

//http://worldclockapi.com/api/json/est/now

var config_picker = (months, unavailableDays) => {
    return ({
        showMonths: months,
        mode: "range",
        minDate: "today",
        onReady: function (dateObj, dateStr, instance) {
            //Se agrega seccion textos de ayuda
            const $clear = $(
                '<div class="ctr"> <div class="div1"><span id=nights>0</span> noches seleccionadas </div> <div class="div2"> <span><span class="circle-black"></span> Hola este es un texto</span> <span><span class="circle-black"></span> Hola otro text</span> <span><span class="circle-black"></span> Hola otro texto corto</span> </div> </div>'
            ).appendTo($(instance.calendarContainer));
        },
        onDayCreate: function (dObj, dStr, fp, dayElem) {
            //Se obtiene la fecha del dia seleccionado
            new_date = new Date(dayElem.dateObj).toLocaleString('en-US');
            //Fecha que se obtiene de endpoint
            old_date = new Date("09/01/2020").toLocaleString('en-US');
            //Se agregan tarifas si aplica para el dia
            if (new_date === old_date) {
                dayElem.innerHTML += "<span class=''>d</span>";
            }
        },
        onChange: function (selectedDates, dateStr, instance) {
            //Se obtienen las fechas inicio-fin
            var dates = dateStr.split(" to ");
            //Se aplica formato a la fecha inicio y fin
            var dateFrom = new Date(dates[0].replace(/-/g, "/"));
            //Se valida que se tenga una fecha final
            var dateTo = dates[1] === undefined
                ? new Date(dates[0].replace(/-/g, "/"))
                : new Date(dates[1].replace(/-/g, "/"));

            var days = 0;
            //TODO - comportamiento de noches seleccionas confirmar con sistemas
            if (dateFrom.getTime() === dateTo.getTime()) {
                days = 1;
            }
            else {
                //Se obtiene la diferencia entre las fechas en ms
                var diff_in_time = dateFrom.getTime() - dateTo.getTime();
                //Se obtiene el total de dias
                days = (diff_in_time / (1000 * 3600 * 24)) * -1 + 1;
            }
            //Se muestra valor en elemento
            document.getElementById("nights").innerHTML = days;
        },
        onOpen: function (selectedDates, dateStr, instance) {
            //Si no tiene seleccionado fechas se indica en texto
            if (selectedDates.length <= 0) {
                document.getElementById("nights").innerHTML = 0;
            }
        },
        disable: unavailableDays === undefined ? [] : unavailableDays
    });
}

firstAsync().then(x => {
    //Se inicializa el control con 2 meses
    console.log(x)
    var fp = $(".date").flatpickr(config_picker(2, x));
    //Si se cambia las dimenciones del cliente se re-crea el control
    window.addEventListener("resize", function () {
        if ($(window).width() < 1000) {
            fp = $(".date").flatpickr(config_picker(1));
        }
        else {
            fp = $(".date").flatpickr(config_picker(2));
        }
    });
});

async function api() {
    return $.ajax({
        url: "http://worldclockapi.com/api/json/est/now",
        type: "GET",
        success: function (result) {
            return result["currentDateTime"]
        },
        error: function (error) {
            console.log(error)
        }
    })
}