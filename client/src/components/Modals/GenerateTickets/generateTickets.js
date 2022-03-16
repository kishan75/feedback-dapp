import React, { useState, useEffect } from 'react';
import GenerateTicketsFunctionBox from '../../FunctionBox/GenerateTicketsFunctionBox/generateTicketsFunctionBox';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import emailjs, { init } from '@emailjs/browser';
init("2pvfnImfRTGi6OSnk");

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GenerateTickets = (props) => {
    const [genTicketsDetails, setGenTicketsDetails] = useState({
        name: '',
        code: '',
        year: '',
        sem: '',
        students: '',
        emails: []
    });

    const [genTicketsErrors, setGenTicketsErrors] = useState({
        name: '',
        code: '',
        year: '',
        semester: '',
        students: '',
        emails: ''
    })

    const [courseDatas, setCourseDatas] = useState();
    const [courseNameOptions, setCourseNameOptions] = useState([]);
    const [courseDataOptions, setCourseDataOptions] = useState({
        code: [],
        year: [],
        sem: [],
        students: []
    });

    const [toast, setToast] = useState({
        message: '',
        severity: '',
        open: false
    })

    // React useEffect
    // Get professor's course data from blockchain
    useEffect(() => {
        console.log(props.courses[props.emailMap[props.account]])
        const coursesObj = props.courses[props.emailMap[props.account]]
        const courseDatas = []
        for (var year in coursesObj)
            if (coursesObj.hasOwnProperty(year))
                for (var sem in coursesObj[year])
                    if (coursesObj[year].hasOwnProperty(sem))
                        for (var code in coursesObj[year][sem])
                            if (coursesObj[year][sem].hasOwnProperty(code))
                                courseDatas.push(coursesObj[year][sem][code])

        setCourseDatas(courseDatas);

        let courseNameOptions = []
        for (var i = 0; i < courseDatas.length; i++)
            courseNameOptions.push(courseDatas[i].name);

        setCourseNameOptions(courseNameOptions);
    }, []);


    // Asyncs:
    const writeTicketToBlockChain = async () => {
        const feedbackData = props.contracts.feedbackData;
        if (feedbackData != undefined) {
            let result = await feedbackData.methods.generateTickets(
                props.emailMap[props.account],
                genTicketsDetails.year,
                genTicketsDetails.sem,
                genTicketsDetails.code,
                (Math.random() + 1).toString(36).substring(7),
            ).send({ from: props.account });
            result = result.events.ticketGenerated.returnValues.tickets;
            console.log(result);
            return result
        } else {
            setToast({ message: 'INTERNAL-ERROR: Contract not deployed', severity: 'error', open: true });
            console.log('Feedback contract not deployed');
        }
    }



    // Handlers
    const handleCourseNameChanged = (event) => {
        let updatedCourseCodeOptions = {
            code: [],
            year: [],
            sem: [],
            students: []
        }

        const semester = { 0: 'Even', 1: 'Odd' };
        for (var i = 0; i < courseDatas.length; i++) {
            if (courseDatas[i].name == event.target.value) {
                updatedCourseCodeOptions.code.push(courseDatas[i].code);
                updatedCourseCodeOptions.year.push(courseDatas[i].year);
                updatedCourseCodeOptions.sem.push(semester[courseDatas[i].semester]);
                updatedCourseCodeOptions.students.push(courseDatas[i].studentCount);
            }
        }
        setCourseDataOptions(updatedCourseCodeOptions);
    }

    const handleGenTicketsInputChange = (event) => {

        setGenTicketsDetails({
            ...genTicketsDetails,
            [event.target.name]: event.target.value
        });

        let updatedErrors = { ...genTicketsErrors };
        updatedErrors = validateGenTicketsInput(event.target.name, event.target.value, updatedErrors);
        setGenTicketsErrors({ ...updatedErrors });
    };


    const handleGenTicketsSubmit = () => {
        let updatedErrors = { ...genTicketsErrors };

        for (var key in genTicketsDetails)
            if (genTicketsDetails.hasOwnProperty(key))
                updatedErrors = validateGenTicketsInput(key, genTicketsDetails[key], updatedErrors);

        setGenTicketsErrors({ ...updatedErrors });
        const fastGenTicketsErrors = { ...updatedErrors };

        let ready = true;
        for (var key in fastGenTicketsErrors)
            if (fastGenTicketsErrors.hasOwnProperty(key))
                if (fastGenTicketsErrors[key] != '')
                    ready = false;

        console.log('Ready:', ready);  // All validation tests passed
        console.log(genTicketsDetails);
        console.log(fastGenTicketsErrors);


        // Send Email
        const semester = { 0: 'Even', 1: 'Odd' };
        if (ready) {
            writeTicketToBlockChain()
                .then(res => {
                    console.log(res);
                    for (var i = 0; i < res.length; i++) {
                        let templateParams = {
                            from: 'SYSTEM',
                            to: genTicketsDetails.emails[i],
                            subject: "Registration Ticket",
                            reply_to: "feedback.dapp@gmail.com",
                            course_name: genTicketsDetails.name,
                            course_code: genTicketsDetails.code,
                            course_year: genTicketsDetails.year,
                            course_sem: semester[genTicketsDetails.sem],
                            ticket: res[i]
                        }

                        emailjs.send('service_kqkqbxv', 'template_c496wv7', templateParams)
                            .then(function (response) {
                                setToast({ message: 'TxN SUCCESS: Ticket generated and sent', severity: 'success', open: true });
                                setTimeout(() => props.closeModal(), 3500);
                                console.log('Email success: ', response.status, response.text);
                            }, function (error) {
                                setToast({ message: 'ERROR: While sending email', severity: 'error', open: true });
                                console.log('Email fail: ', error);
                            })
                    }
                }).catch(e => {
                    ready = false;
                    console.log(e);
                    if (e.code == '4001')
                        setToast({ message: 'TxN WARN: Denied by user', severity: 'warning', open: true });
                    else
                        setToast({ message: 'TxN ERROR: Something went wrong', severity: 'error', open: true });
                });
        }
    }


    const handleEmailFileUpload = (e) => {
        switch (e.target.name) {
            case 'emailsfile':
                const file = e.target.files[0];
                const reader = new FileReader();
                let emails = []
                reader.onload = function (e) {
                    let text = e.target.result;
                    text = text.split(/,| |\n|\r/);
                    console.log(text);

                    for (var i = 0; i < text.length; i++)
                        if (text[i].endsWith('@itbhu.ac.in') || text[i].endsWith('@iitbhu.ac.in') && re.test(text[i]))
                            emails.push(text[i]);

                    console.log(emails);
                    setGenTicketsDetails({ ...genTicketsDetails, emails: emails });
                }

                reader.readAsText(file);

                break;
            default:
                console.error('Error while uploading file'); break;
        }
    }

    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setToast({ ...toast, open: false });
    };


    // Validators
    const validateGenTicketsInput = (field, value, updatedErrors) => {
        switch (field) {
            case 'name':
            case 'code':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (value.length > 50)
                    updatedErrors[field] = 'Length should be smaller than 50';
                else
                    updatedErrors[field] = ''
                break;
            case 'emails':
                if (value.length == 0)
                    updatedErrors[field] = 'Please upload a csv file with student emails';
                else if (value.length != genTicketsDetails.students)
                    updatedErrors[field] = `Number of uploaded emails(${value.length}) should be equal to students(${genTicketsDetails.students})`;
                else
                    updatedErrors[field] = ''
                break;
            case 'year':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (!/^\d+$/.test(value))
                    updatedErrors[field] = 'Year should be numerical';
                else if (value.length != 4)
                    updatedErrors[field] = 'Length should be exacty 4';
                else if (!(value > 2000))
                    updatedErrors[field] = 'Year should be greater than 2000';
                else
                    updatedErrors[field] = ''
                break;
            case 'sem':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (!(value == 1 || value == 0))
                    updatedErrors[field] = 'Can only be Even or Odd';
                else
                    updatedErrors[field] = ''
                break;
            case 'students':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (!/^\d+$/.test(value))
                    updatedErrors[field] = 'Should be numerical';
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
                <GenerateTicketsFunctionBox
                    data={genTicketsDetails}
                    errors={genTicketsErrors}
                    mainOptions={courseNameOptions}
                    subOptions={courseDataOptions}
                    handleMainChange={handleCourseNameChanged}
                    handleInputChange={handleGenTicketsInputChange}
                    handleFileChange={handleEmailFileUpload}
                    handleSubmit={handleGenTicketsSubmit}
                />
            </div>
        </div>
    );
};

export default GenerateTickets;



const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;