import React, { useState } from 'react';
import axios from 'axios';
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
        file: '',
    });

    const [professorErrors, setProfessorErrors] = useState({
        address: '',
        ticket: '',
        name: '',
        email: '',
        file: '',
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


    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                console.log(error);
                reject(error);
            }
        })
    }


    const handleImageFileUpload = async (e) => {
        switch (e.target.name) {
            case 'pic':
                const file = e.target.files[0];
                const base64 = await convertBase64(file)
                console.log(base64);

                const data = new FormData();
                data.append("image", e.target.files[0]);
                data.append("address", professorDetails.address);
                const config = {
                    headers: {
                        "Content-type": 'multipart/form-data',
                    },
                };
                axios.post("http://127.0.0.1:5001/upload", data, config)
                    .then(res => {
                        console.log(res)

                        setProfessorDetails({
                            ...professorDetails,
                            file: e.target.files[0]
                        });
                    })
                    .catch(err => console.log(err));

                break;
            default:
                console.error('Error while uploading file'); break;
        }
    }


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
            case 'file':
                if (value.length == 0)
                    updatedErrors[field] = 'Must upload your display image';
                else
                    updatedErrors[field] = ''
                break
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
                    handleFileChange={handleImageFileUpload}
                />
            </div>
        </div>
    );
};

export default ProfessorDetails;