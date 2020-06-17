const express = require('express');
const User = require('../models/user');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/accounts.js');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const multer = require('multer');
const router= new express.Router();

router.use(express.json());

router.post('/users',async (req,res)=>{
	// user.save().then(()=>{
	// 	res.status(201).send(user);
	// }).catch((e)=>{
	// 	res.status(400).send(e);
	// })
	const user = new User(req.body);
	try{
		await user.save();
		sendWelcomeEmail(user.email , user.name);
		const token = await user.generateAuthToken();
		res.status(201).send({user,token});
	}
	catch(e){
		res.status(400).send(e);
	}
})

router.post('/users/login',async (req,res)=>{

	try{
		const user = await User.findByCredentials(req.body.email,req.body.password);
		const token = await user.generateAuthToken();
		res.status(200).send({user,token});
	}
	catch(e){
		res.status(400).send(e);
	}
})

router.get('/users/me', auth,async (req,res)=>{
	// User.find({}).then((users)=>{
	// 	res.send(users);
	// }).catch((e)=>{
	// 	res.status(500).send();
	// })
	// try{
	// 	const user = await User.find({});
	// 	res.send(user);
	// }
	// catch(e){
	// 	res.status(500).send();
	// }
	res.status(200).send(req.user);
	

})

router.post('/users/logout',auth, async (req,res)=>{
	try{
		req.user.tokens = req.user.tokens.filter( (token) => {
			return token.token !== req.token;
		})
		await req.user.save();
		res.send();
	}
	catch(e){
		res.status(500).send(e);
	}
})
router.post('/users/logoutall',auth, async (req,res) =>{
	try{
		req.user.tokens = [];
		await req.user.save();
		res.send();
	}
	catch(e){
		res.status(500).send(e);
	}
})
// router.get('/users/:id',async (req,res)=>{
	
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

router.patch('/users/me', auth, async (req,res)=>{
	const allowedUpdates = ['name','email','password','age'];
	const updates = Object.keys(req.body);
	const isAllowedOperation = updates.every(update=>allowedUpdates.includes(update))
	if(!isAllowedOperation)return res.status(400).send("operation not allowed");

	try{

		const user = await User.findById(req.user._id);
		updates.forEach(update=>user[update]=req.body[update]);
		await user.save();
		// const user = await User.findByIdAndUpdate(req.params.id,req.body,{
		// 	new : true,
		// 	runValidators : true
		// });
		if(!user){
			res.status(404).send();
		}else {
			res.status(200).send(user);
		}
	}
	catch(e){
		res.status(400).send(e);
	}
})

router.delete('/users/me', auth ,async (req,res)=>{
	try{
		// const user = await User.findByIdAndDelete(req.params.id);
		// if(!user)res.status(404).send();
		// else res.status(200).send(user);
		const user = req.user;
		await req.user.remove();
		sendCancellationEmail(user.email, user.name);
		res.send(req.user);
	}
	catch(e){
		res.status(400).send(e);
	}
})

const upload = multer({
		limits : {
			fileSize : 1000000
		},
		fileFilter(req, file, cb) {
			const ext = file.originalname.split('.');
			if(!ext[1].match(/^(png|jpeg|jpg)$/)) {
				cb(new Error('invalid file format'));
			}
			else{
				cb(undefined,true);
			}
		}
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
	const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
	req.user.avatar = buffer;
	await req.user.save();
	res.send();
}, (error,req,res,next) => {
	res.status(400).send({error : error.message})
})

router.get('/users/:id/avatar', async (req,res)=> {
	try {
		const user = await User.findById(req.params.id);
		if(!user || !user.avatar){
			return res.status(404).send();
		}
		res.set('content-type','image/png');
		res.send(user.avatar);
	}
	catch(e) {
		res.status(400).send();
	}
})

router.delete('/users/me/avatar', auth, async (req,res)=>{
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
})
module.exports = router;