// import mongoose from 'mongoose';
const mongoose = require('mongoose');
mongoose.connect( process.env.MONGODB_URL , {
	useUnifiedTopology : true,
	useCreateIndex:true,
	useNewUrlParser: true,
	useFindAndModify : false
})


//task
// const tasks = mongoose.model('tasks', {
// 	task : {
// 		type : String,
// 		required :true;

// 	},
// 	completed : {
// 		type : Boolean
// 	}
// }) 
// const newtask = new tasks({
// 	task : "complete task",
// 	completed : false
// })
// newtask.save().then(()=>{
// 	console.log(newtask);
// }).catch((error)=>{
// 	console.log('error!',error);
// })
// tasks.forEach((task)=>{
// 	console.log(task);
// })
// console.log(tasks);
