
module.exports.getDate= getDate; 

function getDate(){
var today = new Date();
    var options = {
        weekday :"long",
        day:"numeric",
        month :"long"
    };
    var dday = today.toLocaleDateString("en-US", options);
    return dday
}

//another way of exporting.........

exports.getDay = function(){
    var today = new Date();
    var options = {
        weekday :"long"
    };
    var dday = today.toLocaleDateString("en-US", options);
    return dday
}