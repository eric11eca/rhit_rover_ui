function updateClock() {
    let time = new Date();
    let array = [time.getHours(), time.getMinutes(), time.getSeconds()];

    array.forEach((e, i) => {
        if (e.toString().length !== 2) {
            array[i] = "0"+e;
        }
    });
    let clockString = `${array[0]}:${array[1]}:${array[2]}`;
    array = clockString.match(/.{1}/g);
    clockString = "";
    array.forEach(e => {
        if (e === ":") clockString += "<em>"+e+"</em>";
        else clockString += "<span>"+e+"</span>";
    });

    document.getElementById("mod_clock_text").innerHTML = clockString;
    this.lastTime = time;
}


updateClock();
setInterval(() => {
    this.updateClock();
}, 1000);