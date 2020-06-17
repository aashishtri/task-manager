const express = require('express')
require('./db/mongoose');
const app = express();
const port = process.env.PORT;
const userRouter = require('./routers/users')
const tasksRouter = require('./routers/tasks')
app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);
app.listen(port,()=>{
	console.log('server is up on port ',port);
})
// const bcrypt = require('bcryptjs');
// const myfunction = async ()=>{
// 	const password = "aashish123";
// 	const hashpassword = await bcrypt.hash(password, 8);
// 	console.log(password);
// 	console.log(hashpassword);
// 	const id =await bcrypt.compare('aashish123',hashpassword);
// 	console.log(id);
// }
// myfunction();
// const jwt = require('jsonwebtoken');
// const token = jwt.sign({_id : "aashish"},'iamaashish');
// console.log(token);
// const verify = jwt.verify(token,'iamaashish');
// console.log(verify);



// const multer = require('multer');
// const upload = multer({
// 	dest : 'images'
// });
// app.post('/upload', upload.single('upload'),(req,res)=>{
// 	res.send();
// })
// app.post('/users',async (req,res)=>{
// 	console.log(req.body);
// 	const user = new User(req.body);
// 	// user.save().then(()=>{
// 	// 	res.status(201).send(user);
// 	// }).catch((e)=>{
// 	// 	res.status(400).send(e);
// 	// })
// 	try{
// 		await user.save();
// 		res.status(201).send(user);
// 	}
// 	catch(e){
// 		res.status(400).send(e);
// 	}
	

// })

// app.get('/users',async (req,res)=>{
// 	// User.find({}).then((users)=>{
// 	// 	res.send(users);
// 	// }).catch((e)=>{
// 	// 	res.status(500).send();
// 	// })
// 	try{
// 		const user = await User.find({});
// 		res.send(user);
// 	}
// 	catch(e){
// 		res.status(500).send();
// 	}
	

// })
// app.get('/users/:id',async (req,res)=>{
	
// 	try{
// 		const user = await User.findById(req.params.id);
// 		if(!user){
// 			res.status(404).send();
// 		}
// 		else{
// 			res.status(200).send(user);
// 		}
// 	}
// 	catch(e){
// 		res.status(500).send(e);
// 	}
// })

// app.patch('/users/:id', async (req,res)=>{
// 	const allowedUpdates = ['name','email','password','age'];
// 	const updates = Object.keys(req.body);
// 	const isAllowedOperation = updates.every(update=>allowedUpdates.includes(update))
// 	if(!isAllowedOperation)return res.status(400).send("operation not allowed");

// 	try{
// 		const user = await User.findByIdAndUpdate(req.params.id,req.body,{
// 			new : true,
// 			runValidators : true
// 		});
// 		if(!user){
// 			res.status(404).send();
// 		}else {
// 			res.status(200).send(user);
// 		}
// 	}
// 	catch(e){
// 		res.status(400).send(e);
// 	}
// })

// app.delete('/users/:id',async (req,res)=>{
// 	try{
// 		const user = await User.findByIdAndDelete(req.params.id);
// 		if(!user)res.status(404).send();
// 		else res.status(200).send(user);
// 	}
// 	catch(e){
// 		res.status(400).send(e);
// 	}
// })

// app.post('/tasks',async (req,res)=>{
	
// 	const Task = new tasks(req.body);
// 	try{
// 		await Task.save();
// 		res.status(200).send(Task);
// 	}
// 	catch(e){
// 		res.status(500).send(e);
// 	}


// })
// app.get('/tasks',async (req,res)=>{
// 	// tasks.find({}).then((task)=>{
// 	// 	if(!task){
// 	// 		return res.status(404);
// 	// 	}
// 	// 	res.status(200).send(task);
// 	// }).catch((e)=>{
// 	// 	res.status(500);
// 	// })
// 	try{
// 		const task = await tasks.find({});
// 		if(!task)return res.status(404);
// 		res.status(200).send(task);
// 	}
// 	catch(e){
// 		res.status(400).send(e);
// 	}
// })
// app.get('/tasks/:id',async (req,res)=>{
	
// 	try{
// 		const task = await tasks.findById(req.params.id);
// 		if(!task){
// 			return res.status(404).send();
// 		}
// 		else{
// 			res.status(200).send(task);
// 		}
// 	}
// 	catch(e){
// 		res.status(500).send(e);
// 	}
// })

// app.patch('/tasks/:id',async (req,res)=>{
// 	const allowedUpdates = ['task','completed'];
// 	const updates = Object.keys(req.body);
// 	const isValidOperation = updates.every(update=>allowedUpdates.includes(update))
// 	if(!isValidOperation)return res.status(400).send("invalid operation");
// 	try{
// 		const task =await tasks.findByIdAndUpdate(req.params.id,req.body,{
// 			new : true,
// 			runValidators : true
// 		})
// 		if(!task) res.status(404).send();
// 		else res.status(200).send(task);
// 	}catch(e){
// 		res.status(400).send(e);
// 	}
// })

// app.delete('/tasks/:id',async (req,res)=>{
// 	try{
// 		const task =await tasks.findByIdAndDelete(req.params.id);
// 		if(!tasks)req.status(404).send();
// 		else res.status(200).send(task);
// 	}
// 	catch(e){
// 		res.status(400).send(e);
// 	}
// })
// const tasks = require('./models/tasks');
// const User = require('./models/user')
// const main = async ()=>{
// 	// const id = '5ee76b6afdcd6a61b87622e8'
// 	// const task = await tasks.findById(id);
// 	// await task.populate('owner').execPopulate();
// 	// console.log(task.owner);
// 	const user = await User.findById('5ee76b63fdcd6a61b87622e6');
// 	await user.populate('tasks').execPopulate();
// 	console.log(user.tasks);
// }
// main();