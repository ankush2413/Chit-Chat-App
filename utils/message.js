const moment = require('moment');

const formatmessage = (username,text)=>{
   return{
       username,
       text,
       time: moment().format('h:mm a')
   }
}

module.exports = formatmessage;
