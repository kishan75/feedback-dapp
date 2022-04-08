import React, { useState } from 'react';
import AdminFunctionBox from '../../FunctionBox/AdminFuctionBox/adminFunctionBox';

import emailjs, { init } from '@emailjs/browser';
init("2pvfnImfRTGi6OSnk");

const Admin = (props) => {
	const [genProfTicketDetails, setGenProfTicketDetails] = useState({
		email: '',
		password: ''
	});

	const [genProfTicketErrors, setGenProfTicketErrors] = useState({
		email: '',
		password: ''
	});

	const [changePasswordDetails, setChangePasswordDetails] = useState({
		old: '',
		new: '',
		confirm: ''
	});

	const [changePasswordErrors, setChangePassworErrors] = useState({
		old: '',
		new: '',
		confirm: ''
	});

	// Asyncs:
	const writeTicketToBlockChain = async () => {
		const feedbackData = props.contracts.feedbackData;
		if (feedbackData !== undefined) {
			let result = await feedbackData.methods.generateTokenForProfReg(genProfTicketDetails.password).send({ from: props.account });
			result = result.events.tokenGenerated.returnValues[0];
			console.log(result);
			return result
		} else {
			props.onToastChange('INTERNAL-ERROR: Contract not deployed', 'error', true);
			console.log('Feedback contract not deployed');
		}
	}


	const writePasswordToBlockChain = async () => {
		const feedbackData = props.contracts.feedbackData;
		if (feedbackData !== undefined) {
			let result = await feedbackData.methods.updatePassword(changePasswordDetails.old, changePasswordDetails.new).send({ from: props.account });
			result = result.events.tokenGenerated.returnValues[0];
			console.log(result);
			return true
		} else {
			props.onToastChange('INTERNAL-ERROR: Contract not deployed', 'error', true);
			console.log('Feedback contract not deployed');
		}
	}


	// Handlers
	const handleGenProfTicketInputChange = (event) => {
		setGenProfTicketDetails({
			...genProfTicketDetails,
			[event.target.name]: event.target.value
		});

		let updatedErrors = { ...genProfTicketErrors };
		updatedErrors = validateGenProfTicketInput(event.target.name, event.target.value, updatedErrors);
		setGenProfTicketErrors({ ...updatedErrors });
	};


	const handleChangePasswordInputChange = (event) => {
		setChangePasswordDetails({
			...changePasswordDetails,
			[event.target.name]: event.target.value
		});

		let updatedErrors = { ...changePasswordErrors };
		updatedErrors = validateChnagePasswordInput(event.target.name, event.target.value, updatedErrors);
		setChangePassworErrors({ ...updatedErrors });
	};

	const handleGenProfTicketSubmit = () => {
		props.onLoading(true)
		let updatedErrors = { ...genProfTicketErrors };

		for (var key in genProfTicketDetails)
			if (genProfTicketDetails.hasOwnProperty(key))
				updatedErrors = validateGenProfTicketInput(key, genProfTicketDetails[key], updatedErrors);

		setGenProfTicketErrors({ ...updatedErrors });
		const fastgenProfTicketErrors = { ...updatedErrors };

		let ready = true;
		for (var fkey in fastgenProfTicketErrors) {
			if (fastgenProfTicketErrors.hasOwnProperty(fkey))
				if (fastgenProfTicketErrors[fkey] !== '')
					ready = false;
		}

		console.log('Ready:', ready);
		console.log(genProfTicketDetails);

		if (ready) {
			writeTicketToBlockChain()
				.then(r => {
					console.log(r);

					//Send mail [Uncomment below when deploying]
					// let templateParams = {
					// 	from: 'SYSTEM',
					// 	to: genProfTicketDetails.email,
					// 	subject: "Registration Ticket",
					// 	reply_to: "feedback.dapp@gmail.com",
					// 	html: "<b>Respected sir</b>, <br><br>" +
					// 		"Please use this unique ticket: [ <b>" + r + "</b> ] to get registered. Please do not share this with anyone. <br><br>" +
					// 		"Best wishes,<br>" +
					// 		"Feedback-DApp team",
					// }

					// emailjs.send('service_kqkqbxv', 'template_x0xd5h8', templateParams)
					// 	.then(function (response) {
					// 		props.onToastChange('TxN SUCCESS: Ticket generated and sent', 'success', true);
					// 		setTimeout(() => props.closeModal(), 3500);
					// 		console.log('Email success: ', response.status, response.text);
					// 	}, function (error) {
					// 		props.onToastChange('ERROR: While sending email', 'error', true);
					// 		console.log('Email fail: ', error);
					// 	});
				}).catch(e => {
					ready = false;
					console.log(e);
					if (e.code === '4001')
						props.onToastChange('TxN WARN: Denied by user', 'warning', true);
					else if (e.code === '-32603')
						props.onToastChange('TxN ERROR: Invalid password', 'error', true);
					else
						props.onToastChange('TxN ERROR: Something went wrong', 'error', true);
				}).finally(() => props.onLoading(false));
		}
	}


	const handlePasswordSubmit = () => {
		props.onLoading(true);
		let updatedErrors = { ...changePasswordErrors };

		for (var key in changePasswordDetails)
			if (changePasswordDetails.hasOwnProperty(key))
				updatedErrors = validateChnagePasswordInput(key, changePasswordDetails[key], updatedErrors);

		setChangePassworErrors({ ...updatedErrors });
		const fastChangePassworErrors = { ...updatedErrors };

		let ready = true;
		for (var fkey in fastChangePassworErrors) {
			if (fastChangePassworErrors.hasOwnProperty(fkey))
				if (fastChangePassworErrors[fkey] !== '')
					ready = false;
		}

		console.log('Ready:', ready);
		console.log(changePasswordDetails);

		if (ready) {
			writePasswordToBlockChain()
				.then(r => {
					console.log('Password changed: ', r);
					props.onToastChange('TxN SUCCESS: Password changed', 'success', true);
					setTimeout(() => props.closeModal(), 3500);
				}
				).catch(e => {
					console.log(e);
					if (e.code === '4001')
						props.onToastChange('TxN WARN: Denied by user', 'warning', true);
					else if (props.contracts.feedbackData == null)
						props.onToastChange('INTERNAL-ERROR: Contract not deployed', 'error', true);
					else if (e.code === '-32603')
						props.onToastChange('TxN ERROR: Old password is invalid', 'error', true);
					else
						props.onToastChange('TxN ERROR: Something went wrong', 'erroor', true);
				}
				).finally(() => props.onLoading(false)
				)
		}
	}

	// Validators
	const validateGenProfTicketInput = (field, value, updatedErrors) => {
		switch (field) {
			case 'password':
				if (value.length === 0)
					updatedErrors[field] = 'Cannot be empty';
				else
					updatedErrors[field] = ''
				break;
			case 'email':
				var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (value.length === 0)
					updatedErrors[field] = 'Cannot be empty';
				else if (!re.test(value))
					updatedErrors[field] = 'Invalid email!';
				else if (!(value.endsWith('@itbhu.ac.in') || value.endsWith('@iitbhu.ac.in')))
					updatedErrors[field] = 'Accepted domains are @itbhu.ac.in or @iitbhu.ac.in';
				else
					updatedErrors[field] = ''
				break;
			default:
				break;
		}
		return updatedErrors;
	}


	const validateChnagePasswordInput = (field, value, updatedErrors) => {
		switch (field) {
			case 'old':
				if (value.length === 0)
					updatedErrors[field] = 'Cannot be empty';
				else
					updatedErrors[field] = ''
				break
			case 'new':
				if (value.length === 0)
					updatedErrors[field] = 'Cannot be empty';
				else if (value.length < 5)
					updatedErrors[field] = 'Minimum length: 5';
				else if (value.length > 30)
					updatedErrors[field] = 'Maximum length: 30';
				else if (/[a-zA-Z]/g.test(value) === false)
					updatedErrors[field] = 'Should contain at least one alphabet';
				else if (/\d/.test(value) === false)
					updatedErrors[field] = 'Should contain at least one digit';
				else
					updatedErrors[field] = ''
				break;
			case 'confirm':
				if (value !== changePasswordDetails.new)
					updatedErrors[field] = 'Should match the new password';
				else
					updatedErrors[field] = ''
				break;
			default:
				break;
		}
		return updatedErrors;
	}


	return (
		<div className='cards'>
			<AdminFunctionBox
				data={{ ...genProfTicketDetails, ...changePasswordDetails }}
				errors={{ ...genProfTicketErrors, ...changePasswordErrors }}
				handleInputChange={handleGenProfTicketInputChange}
				handleSubmit={handleGenProfTicketSubmit}
				handlePasswordInputChange={handleChangePasswordInputChange}
				handlePasswordSubmit={handlePasswordSubmit}
			/>
		</div>
	);
};

export default Admin;