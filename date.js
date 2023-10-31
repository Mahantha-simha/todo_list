module.exports = date;

function date(){
const today = new Date();
    const currentday = today.getDay();//i will get currentday in the number formeat

    const daylist = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saurtday'];
    const currentdayname = daylist[currentday];

    return currentdayname;
}