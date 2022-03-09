import React, { useState, useEffect } from 'react';
import GenerateTicketsFunctionBox from '../../FunctionBox/GenerateTicketsFunctionBox/generateTicketsFunctionBox';

import "./generateTickets.css";


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
        sem: '',
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


    // React useEffect
    // Get professor's course data from blockchain
    useEffect(() => {
        let courseDatas = [{
            name: 'NetSec',
            code: 'CSE-69',
            year: '2021',
            students: '20',
        },
        {
            name: 'NetSec2',
            code: 'CSE-692',
            year: '2022',
            students: '25',
        }]

        setCourseDatas(courseDatas);

        let courseNameOptions = []
        for(var i=0; i<courseDatas.length; i++)
            courseNameOptions.push(courseDatas[i].name);

        setCourseNameOptions(courseNameOptions);
    }, []);


    
    // Handlers
    const handleCourseNameChanged = (event) => {
        let updatedCourseCodeOptions = {
            code: [],
            year: [],
            sem: [],
            students: []
        }

        updatedCourseCodeOptions.sem = ['Even', 'Odd']
        for(var i=0; i<courseDatas.length; i++){
            if(courseDatas[i].name == event.target.value){
                updatedCourseCodeOptions.code.push(courseDatas[i].code);
                updatedCourseCodeOptions.year.push(courseDatas[i].year);
                updatedCourseCodeOptions.students.push(courseDatas[i].students);
            }
        }
        setCourseDataOptions(updatedCourseCodeOptions);
    }

    const handleGenTicketsInputChange = (event) => {

        setGenTicketsDetails({
            ...genTicketsDetails,
            [event.target.name]: event.target.value
        });

        let updatedErrors = {...genTicketsErrors};
        updatedErrors = validateGenTicketsInput(event.target.name, event.target.value, updatedErrors);
        setGenTicketsErrors({ ...updatedErrors });
    };


    const handleGenTicketsSubmit = () => {
        let updatedErrors = {...genTicketsErrors};

        for (var key in genTicketsDetails) 
            if (genTicketsDetails.hasOwnProperty(key))
                updatedErrors = validateGenTicketsInput(key, genTicketsDetails[key], updatedErrors);

        setGenTicketsErrors({ ...updatedErrors});
        const fastGenTicketsErrors = { ...updatedErrors};

        let clear = true;
        for (var key in fastGenTicketsErrors) 
            if (fastGenTicketsErrors.hasOwnProperty(key))
                if(fastGenTicketsErrors[key] != '')
                    clear = false;

        console.log('Ready:', clear);
        console.log(genTicketsDetails);
        console.log(fastGenTicketsErrors);

        
        // Send Email
        if(clear) {
            const mail = {
                Host: "smtp.elasticemail.com",
                Port: 2525,
                Username: "feedback.dapp@gmail.com",
                Password: "812195DD647B3B77757DA600C55529F34E3E",
                To: ['binit.57.singh@gmail.com'], //genTicketsDetails.emails
                From: "feedback.dapp@gmail.com",
                Subject: "Feedback Request",
                Body: "<b>Hello </b>there, <br><br>You are requested to sumbit a feedback for:<br>"+
                    "<b>Course: </b>"+genTicketsDetails.name+"<br>"+
                    "<b>Code: </b>"+genTicketsDetails.code+"<br>"+
                    "<b>Year: </b>"+genTicketsDetails.year+"<br>"+
                    "<b>Semester: </b>"+genTicketsDetails.sem+"<br>"+
                    "<b>Professor: </b>"+"props.professorName"+"<br><br>"+
                    "Please use this unique ticket: <b>YYXXZZ</b> to submit the feedack anonymously<br><br>"+
                    "Best wishes,<br>"+
                    "Feedback-DApp team",
            };

            console.log(mail);
            window.Email.send(mail)
            .then(function (message) {
                if(message == 'OK')
                    console.log('Email Sent', message)
                else
                    console.log('Email Fail', message);
            }) 
            .catch(function (message) {
                console.log('Email Fail', message)
            })
        }
    }


    const handleEmailFileUpload = (e) => {
        switch (e.target.name) {
            case 'emailsfile':
                const file = e.target.files[0];
                const reader = new FileReader();
                let emails = []
                reader.onload = function(e) {
                    let text = e.target.result;
                    text = text.split(/,| |\n|\r/);
                    console.log(text);

                    for(var i=0; i<text.length; i++)
                        if(text[i].endsWith('@itbhu.ac.in') || text[i].endsWith('@iitbhu.ac.in') && re.test(text[i]))
                            emails.push(text[i]);

                    console.log(emails);
                    setGenTicketsDetails({...genTicketsDetails, emails: emails});
                }
        
                reader.readAsText(file);

                break;
            default:
                console.error('Error while uploading file'); break;
        }
    }


    // Validators
    const validateGenTicketsInput = (field, value, updatedErrors) => {
        switch(field) {
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
                else
                    updatedErrors[field] = ''
                break;
            case 'year':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if(!/^\d+$/.test(value))
                    updatedErrors[field] = 'Year should be numerical';
                else if(value.length != 4)
                    updatedErrors[field] = 'Length should be exacty 4';
                else if(!(value > 2000))
                    updatedErrors[field] = 'Year should be greater than 2000';
                else
                    updatedErrors[field] = ''   
                break;
            case 'sem':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (!(value == 'Even' || value == 'Odd'))
                    updatedErrors[field] = 'Can only be Even or Odd';
                else
                    updatedErrors[field] = ''  
                break;
            case 'students':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if(!/^\d+$/.test(value))
                    updatedErrors[field] = 'Should be numerical';
                else
                    updatedErrors[field] = ''  
                break;

        }
        return updatedErrors;
    }


    return (
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
    );
};

export default GenerateTickets;



const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;