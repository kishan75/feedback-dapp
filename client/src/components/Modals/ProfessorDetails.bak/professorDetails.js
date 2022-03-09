import React, { useState, useEffect } from 'react';
import Header from '../../Header/header';
import ProfessorDetailsFunctionBox from '../../FunctionBox/ProfessorDetailsFunctionBox/professorDetailsFunctionBox';

import "./professorDetails.css";


const ProfessorDetails = (props) => {
    const [professorDetails, setProfessorDetails] = useState({
        ticket: '',
        name: 'Dr. ',
        email: '',
        year: '',
        numCourses: '',
        courses: [{
            name: '',
            code: '',
            students: ''
        }]
    });

    const [professorErrors, setProfessorErrors] = useState({
        ticket: '',
        name: '',
        email: '',
        year: '',
        courses: [{
            name: '',
            code: '',
            students: ''
        }]
    })


    useEffect(() => {
        const course = {name: '', code: '', students: ''};
        let updatedCourses = []
        for(var i=0; i<professorDetails.numCourses; i++)
            updatedCourses.push(course);

        setProfessorDetails({
            ...professorDetails,
            courses : updatedCourses
        });


        let updatedCourseErrors = []
        for(var i=0; i<professorDetails.numCourses; i++)
            updatedCourseErrors.push(course);

        setProfessorErrors({
            ...professorErrors,
            courses : updatedCourseErrors
        });
    }, [professorDetails.numCourses]);


    // Validators
    const validateProfessorInput = (field, value, updatedErrors) => {
        switch(field) {
            case 'ticket':
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
            case 'email':
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if(!re.test(value))
                    updatedErrors[field] = 'Invalid email!';
                else if(!(value.endsWith('@itbhu.ac.in') || value.endsWith('@iitbhu.ac.in')))
                    updatedErrors[field] = 'Invalid domain, accepted domains are @itbhu.ac.in or @iitbhu.ac.in';
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
        }
        console.log(updatedErrors);
        return updatedErrors;
    }


    const validateCourseInput = (field, value, updatedErrors) => {
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
            case 'students':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if(!/^\d+$/.test(value))
                    updatedErrors[field] = 'Should be numerical';
                else if (value.length > 3)
                    updatedErrors[field] = 'Not more than three digits';
                else
                    updatedErrors[field] = ''   
                break;
        }
        return updatedErrors;
    }


    // Handlers
    const handleProfessorInputChange = (event) => {
        setProfessorDetails({
            ...professorDetails,
            [event.target.name]: event.target.value
        });

        let updatedErrors = {...professorErrors};
        updatedErrors = validateProfessorInput(event.target.name, event.target.value, updatedErrors);
        setProfessorErrors({ ...updatedErrors });
    };

    const handleCourseChange = (event, index) => {
        let updatedCourses = [...professorDetails.courses];
        let updatedCourse = {...updatedCourses[index]};
        updatedCourse[event.target.name] = event.target.value;
        updatedCourses[index] = updatedCourse;

        setProfessorDetails({
            ...professorDetails,
            courses: updatedCourses,
        });

        let updatedErrorses = [...professorErrors.courses];
        let updatedErrors = {...updatedErrorses[index]};
        updatedErrors = validateCourseInput(event.target.name, event.target.value, updatedErrors);
        updatedErrorses[index] = updatedErrors;
        setProfessorErrors({ ...professorErrors,  courses: updatedErrorses});
    };


    const handlerProfessorSubmit = () => {
        let updatedErrors = {...professorErrors};
        let updatedCourseErrorses = [...professorErrors.courses];

        for (var key in professorDetails) {
            if (professorDetails.hasOwnProperty(key)){
                if(!Array.isArray(professorDetails[key])){
                    updatedErrors = validateProfessorInput(key, professorDetails[key], updatedErrors);
                } else {
                    for (var i=0; i<professorDetails.courses.length; i++){
                        for (var key in professorDetails.courses[i]) {
                            if (professorDetails.courses[i].hasOwnProperty(key)){
                                let updatedCourseErrors = {...updatedCourseErrorses[i]};
                                updatedCourseErrors = validateCourseInput(key, professorDetails.courses[i][key], updatedCourseErrors);
                                updatedCourseErrorses[i] = updatedCourseErrors;
                            }
                        }
                    }
                }
            }
        }
        setProfessorErrors({ ...updatedErrors,  courses: updatedCourseErrorses});
        const fastProfessorErrors = { ...updatedErrors,  courses: updatedCourseErrorses};

        let clear = true;
        for (var key in fastProfessorErrors) {
            if (fastProfessorErrors.hasOwnProperty(key)){
                if(!Array.isArray(fastProfessorErrors[key])){
                    if(fastProfessorErrors[key] != '')
                        clear = false;
                } else {
                    if(fastProfessorErrors[key].length == 0)
                        clear = false;
                    for (var i=0; i<fastProfessorErrors.courses.length; i++)
                        for (var key in fastProfessorErrors.courses[i]) 
                            if (fastProfessorErrors.courses[i].hasOwnProperty(key))
                                if(fastProfessorErrors.courses[i][key] != '')
                                    clear = false;
                }
            }
        }

        console.log('Ready:', clear);
        console.log(professorDetails);
    }


    return (
        <div className='cards'>
            <ProfessorDetailsFunctionBox
                state={professorDetails}
                errors={professorErrors}
                handleInputChange={handleProfessorInputChange}
                handleCourseChange={handleCourseChange}
                handleSubmit={handlerProfessorSubmit}
            />
        </div>
    );
};

export default ProfessorDetails;