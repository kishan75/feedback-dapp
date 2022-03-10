import React, { useState, useEffect } from 'react';
import ProfessorDetailsFunctionBox from '../../FunctionBox/ProfessorDetailsFunctionBox/professorDetailsFunctionBox';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import "./professorDetails.css";


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfessorDetails = (props) => {
    const [professorDetails, setProfessorDetails] = useState({
        address: props.mainState.account.address,
        ticket: '',
        name: 'Dr. ',
        email: '',
    });

    const [professorErrors, setProfessorErrors] = useState({
        address: '',
        ticket: '',
        name: '',
        email: '',
    })

    const [toast, setToast] = useState({
        message: '',
        severity: '',
        open: false
    })

    // Asyncs:
    const writeToBlockChain = async () => {
        const feedbackData = props.mainState.contract.feedbackData;
        if (feedbackData) {
            let result = await feedbackData.createProfessor(professorDetails.name, professorDetails.email, professorDetails.ticket, { from: professorDetails.address });
            result = result.logs[0].args["professor"];
            console.log(result);
        } else {
            setToast({ message: 'INTERNAL-ERROR: Feedback contract not deployed', severity: 'error', open: true });
            console.log('Feedback contract not deployed');
        }
    }


    // Handlers
    const handleProfessorInputChange = (event) => {
        setProfessorDetails({
            ...professorDetails,
            [event.target.name]: event.target.value
        });

        let updatedErrors = { ...professorErrors };
        updatedErrors = validateProfessorInput(event.target.name, event.target.value, updatedErrors);
        setProfessorErrors({ ...updatedErrors });
    };


    const handlerProfessorSubmit = () => {
        let updatedErrors = { ...professorErrors };

        for (var key in professorDetails)
            if (professorDetails.hasOwnProperty(key))
                updatedErrors = validateProfessorInput(key, professorDetails[key], updatedErrors);

        setProfessorErrors({ ...updatedErrors });
        const fastProfessorErrors = { ...updatedErrors };

        let ready = true;
        for (var key in fastProfessorErrors) {
            if (fastProfessorErrors.hasOwnProperty(key))
                if (fastProfessorErrors[key] != '')
                    ready = false;
        }

        console.log('Ready:', ready);
        console.log(professorDetails);

        if (ready) {
            writeToBlockChain()
                .then(r => {
                    console.log(r);
                    setToast({ message: 'TxN SUCCESS: You have been registered', severity: 'success', open: true });
                    setTimeout(() => props.closeModal(), 3500);
                }
                ).catch(e => {
                    if (e.code == 'INVALID_ARGUMENT')
                        setToast({ message: 'ERROR: Ticket should be in hex', severity: 'error', open: true });
                    else if (e.code == '4001')
                        setToast({ message: 'TxN WARN: Denied by user', severity: 'warning', open: true });
                    else
                        setToast({ message: 'TxN ERROR: Invalid ticket', severity: 'error', open: true });
                })
        }
    }

    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setToast({ ...toast, open: false });
    };


    // Validators
    const validateProfessorInput = (field, value, updatedErrors) => {
        switch (field) {
            case 'name':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (value.length < 5)
                    updatedErrors[field] = 'Length should be greater than 5';
                else if (value.length > 30)
                    updatedErrors[field] = 'Length should be smaller than 30';
                else
                    updatedErrors[field] = ''
                break;
            case 'ticket':
            case 'address':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (value.length < 10)
                    updatedErrors[field] = 'Length should be greater than 10';
                else if (value.length > 100)
                    updatedErrors[field] = 'Length should be smaller than 100';
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
                    updatedErrors[field] = 'Invalid domain, accepted domains are @itbhu.ac.in or @iitbhu.ac.in';
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
                <ProfessorDetailsFunctionBox
                    data={professorDetails}
                    errors={professorErrors}
                    handleInputChange={handleProfessorInputChange}
                    handleSubmit={handlerProfessorSubmit}
                />
            </div>
        </div>
    );
};

export default ProfessorDetails;