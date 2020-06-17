const mongoose = require('mongoose');
const validator = require('validator');

//task
const taskSchema = new mongoose.Schema( {
	task : {
		type : String,
		required :true,
		trim : true,
	},
	completed : {
		default : false,
		type : Boolean
	},
	owner : {
		type : mongoose.Schema.Types.ObjectId,
		required : true,
		ref : 'User'
	}
}, {
	timestamps : true
});
const tasks = mongoose.model('tasks', taskSchema); 
// const newtask = new tasks({
// 	task : "complete task",
// 	completed : false
// })
// newtask.save().then(()=>{
// 	console.log(newtask);
// }).catch((error)=>{
// 	console.log('error!',error);
// })
module.exports = tasks;

