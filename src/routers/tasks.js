const express = require('express');
const tasks = require('../models/tasks');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
const router = new express.Router();
router.use(express.json());


router.post('/tasks', auth,async (req,res)=>{
	
	const Task = new tasks({
		...req.body,
		owner : req.user._id
	});
	try{
		await Task.save();
		res.status(201).send(Task);
	}
	catch(e){
		res.status(500).send(e);
	}


})
router.get('/tasks', auth, async (req,res)=>{
	// tasks.find({}).then((task)=>{
	// 	if(!task){
	// 		return res.status(404);
	// 	}
	// 	res.status(200).send(task);
	// }).catch((e)=>{
	// 	res.status(500);
	// })
	
	const match = {};
	// splitting the sort query
	const sort = {};
	if(req.query.completed){
		match.completed = req.query.completed === 'true';
	}
	if(req.query.sortBy) {
		const parts = req.query.sortBy.split(':');
		sort[parts[0]] = parts[1] === 'desc' ? -1 :1;
	}
	try{
		//const task = await tasks.find({});
		await req.user.populate({
			path : 'tasks',
			match,
			options : {
				limit : parseInt(req.query.limit),
				skip : parseInt(req.query.skip),
				sort
			}
		}).execPopulate();
		const task = req.user.tasks;
		if(!task)return res.status(404);
		res.status(200).send(task);
	}
	catch(e){
		res.status(400).send(e);
	}
})
router.get('/tasks/:id', auth, async (req,res)=>{
	const _id = req.params.id;
	try{
		//const task = await tasks.findById(req.params.id);
		const task = await tasks.findOne({_id, owner : req.user._id})
		if(!task){
			return res.status(404).send();
		}
		else{
			res.status(200).send(task);
		}
	}
	catch(e){
		res.status(500).send(e);
	}
})

router.patch('/tasks/:id', auth, async (req,res)=>{
	const _id = req.params.id;
	const allowedUpdates = ['task','completed'];
	const updates = Object.keys(req.body);
	const isValidOperation = updates.every(update=>allowedUpdates.includes(update))
	if(!isValidOperation)return res.status(400).send("invalid operation");
	try{
		//const task = await tasks.findById(req.params.id);
		const task = await tasks.findOne({_id,owner : req.user._id});
		updates.forEach(update=>task[update]=req.body[update]);
		// const task =await tasks.findByIdAndUpdate(req.params.id,req.body,{
		// 	new : true,
		// 	runValidators : true
		// })
		if(!task) res.status(404).send();
		else res.status(200).send(task);
	}catch(e){
		res.status(400).send(e);
	}
})

router.delete('/tasks/:id', auth,async (req,res)=>{
	const _id = req.params.id;
	try{
		const task =await tasks.findOneAndDelete({_id, owner : req.user._id});
		console.log(task);
		if(!task)req.status(404).send();
		else res.status(200).send(task);
	}
	catch(e){
		res.status(400).send(e);
	}
})
module.exports = router;