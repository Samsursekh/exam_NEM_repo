const mongoose = require('mongoose');
const crudSchema = new mongoose.Schema({
    taskname :{type: String, required: true},
    status: {type: String, required: true}, 
    tag: {type: String, required: true}
})

const CrudModel = mongoose.model('merncrud',crudSchema);
module.exports = {CrudModel};





