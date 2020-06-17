const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const tasks = require('./tasks.js')
const userSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true,
		trim : true,
		validate(value){
			if(value.length === 0){
				throw new Error("name cannot be empty");
			}
		}
	},
	age : {
		type : Number,
		default : 18,
		validate(value) {
			if(value<18){
				throw new Error("age must be at least 18");
			}
		}
	},
	email : {
		type :String,
		unique : true,
		required : true,
		validate(mail) {
			if(!validator.isEmail(mail))
				throw new Error("invalid mail") ;
		},
		trim : true,
		lowercase : true
	},
	password: {
		type : String,
		trim : true,
		required : String,
		minlength : 7,
		validate(str) {
			if(str.toLowerCase().includes('password')){
				throw new Error("erroor");
			}
		}
	},
	tokens : [{
		token : {
			type : String,
			required : true
		}
	}],
	avatar : {
		type : Buffer
	}
},{
	timestamps : true
});

userSchema.virtual('tasks', {
	ref : 'tasks',
	localField : '_id',
	foreignField : 'owner'
})

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.avatar;
	return userObject;
}
userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = jwt.sign({_id : user._id.toString() },process.env.JWT_SECRET);
	user.tokens = user.tokens.concat({token});
	await user.save();
	return token;
}

userSchema.statics.findByCredentials = async (email,password) => {
	const user = await User.findOne({email});
	if(!user){
		throw new Error('unable to login');
	}
	const isValid = await bcrypt.compare(password,user.password);
	if(!isValid){
		throw new Error('unable to login');
	}
	return user;
}
// hash the user password
userSchema.pre('save', async function (next) {
	const user = this;
	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password,8);
	}
	//await user.populate('tasks').execPopulate();
	
})
// delete user tasks 
userSchema.pre('remove', async function (next) {
	const user = this;
	try{
		await tasks.deleteMany({owner : user._id});
		//console.log('task',user.tasks);
		next();
	}
	catch(e){
		res.status(400).send();
	}
	

})

const User = mongoose.model('User', userSchema);
module.exports = User;