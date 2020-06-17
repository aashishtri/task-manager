
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
	  to: email,
	  from: 'aashishk1999@gmail.com',
	  subject: 'Thanks for joining in',
	  text: `Welcome to app ${name}, Let me know how you get along with the app.`
  });
}
const sendCancellationEmail = (email, name) => {
	sgMail.send({
		to : email,
		from : 'aashishk1999@gmail.com',
		subject : 'Thanks for using our service',
		text : `Hey ${name}, if would be great if you tell the reason of cancelling the service and what we can do to improve it. Thanks for using our service.`
	}).then((res)=>{

	}).catch((e)=>{
		console.log(e);
	})
}
module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail
}