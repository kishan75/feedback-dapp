import React, { useState, useEffect } from 'react';
import AdminFunctionBox from '../../FunctionBox/AdminFuctionBox/adminFunctionBox';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


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

    const [toast, setToast] = useState({
        message: '',
        severity: '',
        open: false
    })

    // Asyncs:
    const writeToBlockChain = async () => {
        const feedbackData = props.mainState.contract.feedbackData;
        if (feedbackData) {
            let result = await feedbackData.createProfessor(genProfTicketDetails.name, genProfTicketDetails.email, genProfTicketDetails.ticket, { from: genProfTicketDetails.address });
            result = result.logs[0].args["professor"];
            console.log(result);
        } else {
            setToast({ message: 'INTERNAL-ERROR: Feedback contract not deployed', severity: 'error', open: true });
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

        if (false) {
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
    const validateGenProfTicketInput = (field, value, updatedErrors) => {
        switch (field) {
            case 'password':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
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
                <AdminFunctionBox
                    data={genProfTicketDetails}
                    errors={genProfTicketErrors}
                    handleInputChange={handleGenProfTicketInputChange}
                    handleSubmit={handleGenProfTicketSubmit}
                />
            </div>
        </div>
    );
};

export default Admin;