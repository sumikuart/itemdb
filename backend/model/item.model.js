const mongoose = require('mongoose');
const schema = mongoose.Schema;

let item = new schema({

    item_name:{
        type:String
    },
    item_Description:{
        type:String
    },
    item_price:{
        type:Number
    },
    item_photo:({
        type:String
    })

})


module.exports = mongoose.model('item', item, 'item')