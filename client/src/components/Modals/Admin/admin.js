import React, { useState } from 'react';
import AdminFunctionBox from '../../FunctionBox/AdminFuctionBox/adminFunctionBox';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import emailjs, { init } from '@emailjs/browser';
init("2pvfnImfRTGi6OSnk");

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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


    const [toast, setToast] = useState({
        message: '',
        severity: '',
        open: false
    })

    // Asyncs:
    const writeTicketToBlockChain = async () => {
        const feedbackData = props.mainState.contract.feedbackData;
        if (feedbackData != undefined) {
            let result = await feedbackData.generateTokenForProfReg(genProfTicketDetails.password, { from: props.mainState.account.address });
            result = result.logs[0].args["token"];
            console.log(result);
            return result
        } else {
            setToast({ message: 'INTERNAL-ERROR: Contract not deployed', severity: 'error', open: true });
            console.log('Feedback contract not deployed');
        }
    }


    const writePasswordToBlockChain = async () => {
        const feedbackData = props.mainState.contract.feedbackData;
        if (feedbackData != undefined) {
            let result = await feedbackData.updatePassword(changePasswordDetails.old, changePasswordDetails.new, { from: props.mainState.account.address });
            //result = result.logs[0].args["professor"];
            console.log(result);
        } else {
            setToast({ message: 'INTERNAL-ERROR: Contract not deployed', severity: 'error', open: true });
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
        let updatedErrors = { ...genProfTicketErrors };

        for (var key in genProfTicketDetails)
            if (genProfTicketDetails.hasOwnProperty(key))
                updatedErrors = validateGenProfTicketInput(key, genProfTicketDetails[key], updatedErrors);

        setGenProfTicketErrors({ ...updatedErrors });
        const fastgenProfTicketErrors = { ...updatedErrors };

        let ready = true;
        for (var key in fastgenProfTicketErrors) {
            if (fastgenProfTicketErrors.hasOwnProperty(key))
                if (fastgenProfTicketErrors[key] != '')
                    ready = false;
        }

        console.log('Ready:', ready);
        console.log(genProfTicketDetails);

        if (ready) {
            writeTicketToBlockChain()
                .then(r => {
                    console.log(r);

                    let templateParams = {
                        from: 'SYSTEM',
                        to: ['kishan.chaurasiya.75@gmail.com', 'yee80andres@gmail.com'],
                        subject: "Registration Ticket",
                        reply_to: "feedback.dapp@gmail.com",
                        html: "<b>Respected sir</b>, <br><br>" +
                            "Please use this unique ticket: <b>[ " + r + " ]</b> to get registered. PLease do not share this with anyone. <br><br>" +
                            "Best wishes,<br>" +
                            "Feedback-DApp team",
                    }

                    emailjs.send('service_kqkqbxv', 'template_x0xd5h8', templateParams)
                        .then(function (response) {
                            setToast({ message: 'TxN SUCCESS: Ticket generated and sent', severity: 'success', open: true });
                            setTimeout(() => props.closeModal(), 3500);
                            console.log('Email success: ', response.status, response.text);
                        }, function (error) {
                            setToast({ message: 'ERROR: While sending email', severity: 'error', open: true });
                            console.log('Email fail: ', error);
                        });
                }
                ).catch(e => {
                    ready = false;
                    console.log(e);
                    if (e.code == '4001')
                        setToast({ message: 'TxN WARN: Denied by user', severity: 'warning', open: true });
                    else if (e.code == '-32603')
                        setToast({ message: 'TxN ERROR: Invalid password', severity: 'error', open: true });
                    else
                        setToast({ message: 'TxN ERROR: Something went wrong', severity: 'error', open: true });
                });
        }
    }


    const handlePasswordSubmit = () => {
        let updatedErrors = { ...changePasswordErrors };

        for (var key in changePasswordDetails)
            if (changePasswordDetails.hasOwnProperty(key))
                updatedErrors = validateChnagePasswordInput(key, changePasswordDetails[key], updatedErrors);

        setChangePassworErrors({ ...updatedErrors });
        const fastChangePassworErrors = { ...updatedErrors };

        let ready = true;
        for (var key in fastChangePassworErrors) {
            if (fastChangePassworErrors.hasOwnProperty(key))
                if (fastChangePassworErrors[key] != '')
                    ready = false;
        }

        console.log('Ready:', ready);
        console.log(changePasswordDetails);

        if (ready) {
            writePasswordToBlockChain()
                .then(r => {
                    console.log(r);
                    setToast({ message: 'TxN SUCCESS: Password changed', severity: 'success', open: true });
                    setTimeout(() => props.closeModal(), 3500);
                }
                ).catch(e => {
                    console.log(e);
                    if (e.code == '4001')
                        setToast({ message: 'TxN WARN: Denied by user', severity: 'warning', open: true });
                    else if (props.mainState.contract.feedbackData == null)
                        setToast({ message: 'INTERNAL-ERROR: Contract not deployed', severity: 'error', open: true });
                    else if (e.code == '-32603')
                        setToast({ message: 'TxN ERROR: Old password is invalid', severity: 'error', open: true });
                    else
                        setToast({ message: 'TxN ERROR: Something went wrong', severity: 'error', open: true });
                })
        }
    }



    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setToast({ ...toast, open: false });
    };


    // Validators
    const validateGenProfTicketInput = (field, value, updatedErrors) => {
        switch (field) {
            case 'password':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else
                    updatedErrors[field] = ''
                break;
            case 'email':
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (!re.test(value))
                    updatedErrors[field] = 'Invalid email!';
                else if (!(value.endsWith('@itbhu.ac.in') || value.endsWith('@iitbhu.ac.in')))
                    updatedErrors[field] = 'Accepted domains are @itbhu.ac.in or @iitbhu.ac.in';
                else
                    updatedErrors[field] = ''
                break;
        }
        return updatedErrors;
    }


    const validateChnagePasswordInput = (field, value, updatedErrors) => {
        switch (field) {
            case 'old':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else
                    updatedErrors[field] = ''
                break
            case 'new':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (value.length < 5)
                    updatedErrors[field] = 'Minimum length: 5';
                else if (value.length > 30)
                    updatedErrors[field] = 'Maximum length: 30';
                else if (/[a-zA-Z]/g.test(value) == false)
                    updatedErrors[field] = 'Should contain at least one alphabet';
                else if (/\d/.test(value) == false)
                    updatedErrors[field] = 'Should contain at least one digit';
                else
                    updatedErrors[field] = ''
                break;
            case 'confirm':
                if (value != changePasswordDetails.new)
                    updatedErrors[field] = 'Should match the new password';
                else
                    updatedErrors[field] = ''
                break;
        }
        return updatedErrors;
    }


    return (
        <div>
            <Snackbar autoHideDuration={4500} open={toast.open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleToastClose}>
                <Alert severity={toast.severity} sx={{ width: '100%' }}>
                    {toast.message}
                </Alert>
            </Snackbar>

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
        </div>
    );
};

export default Admin;