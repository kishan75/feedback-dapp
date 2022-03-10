import React, { useState, useEffect } from 'react';
import AddCoursesFunctionBox from '../../FunctionBox/AddCoursesFunctionBox/addCoursesFunctionBox';



const AddCourses = (props) => {
    const [addCourseDetails, setAddCourseDetails] = useState({
        email: '',
        year: '',
        numCourses: '',
        courses: [{
            name: '',
            code: '',
            sem: '',
            students: ''
        }]
    });

    const [addCourseErrors, setAddCourseErrors] = useState({
        email: '',
        year: '',
        numCourses: '',
        courses: [{
            name: '',
            code: '',
            sem: '',
            students: ''
        }]
    })


    useEffect(() => {
        const course = { name: '', code: '', sem: '', students: '' };
        let updatedCourses = []
        for (var i = 0; i < addCourseDetails.numCourses; i++)
            updatedCourses.push(course);

        setAddCourseDetails({
            ...addCourseDetails,
            courses: updatedCourses
        });


        let updatedCourseErrors = []
        for (var i = 0; i < addCourseDetails.numCourses; i++)
            updatedCourseErrors.push(course);

        setAddCourseErrors({
            ...addCourseErrors,
            courses: updatedCourseErrors
        });
    }, [addCourseDetails.numCourses]);


    // Validators
    const validateAddCourseInput = (field, value, updatedErrors) => {
        switch (field) {
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
            case 'numCourses':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (!/^\d+$/.test(value))
                    updatedErrors[field] = 'Should be numerical';
                else if (value == 0)
                    updatedErrors[field] = 'Cannot be 0';
                else
                    updatedErrors[field] = ''
                break;
            case 'name':
            case 'code':
                if (value.length == 0)
                    updatedErrors[field] = 'Cannot be empty';
                else if (value.length > 50)
                    updatedErrors[field] = 'Length should be smaller than 50';
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
                else if (!/^\d+$/.test(value))
                    updatedErrors[field] = 'Should be numerical';
                else if (value.length > 3)
                    updatedErrors[field] = 'Not more than three digits';
                else
                    updatedErrors[field] = ''
                break;
        }
        console.log('Updated Errors:', updatedErrors);
        return updatedErrors;
    }


    // Handlers
    const handleAddCourseInputChange = (event) => {
        setAddCourseDetails({
            ...addCourseDetails,
            [event.target.name]: event.target.value
        });

        let updatedErrors = { ...addCourseErrors };
        updatedErrors = validateAddCourseInput(event.target.name, event.target.value, updatedErrors);
        setAddCourseErrors({ ...updatedErrors });
    };

    const handleCourseChange = (event, index) => {
        let updatedCourses = [...addCourseDetails.courses];
        let updatedCourse = { ...updatedCourses[index] };
        updatedCourse[event.target.name] = event.target.value;
        updatedCourses[index] = updatedCourse;

        setAddCourseDetails({
            ...addCourseDetails,
            courses: updatedCourses,
        });

        let updatedErrorses = [...addCourseErrors.courses];
        let updatedErrors = { ...updatedErrorses[index] };
        updatedErrors = validateAddCourseInput(event.target.name, event.target.value, updatedErrors);
        updatedErrorses[index] = updatedErrors;
        setAddCourseErrors({ ...addCourseErrors, courses: updatedErrorses });
    };


    const handlerAddCourseSubmit = () => {
        let updatedErrors = { ...addCourseErrors };
        let updatedCourseErrorses = [...addCourseErrors.courses];

        for (var key in addCourseDetails) {
            if (addCourseDetails.hasOwnProperty(key)) {
                if (!Array.isArray(addCourseDetails[key])) {
                    updatedErrors = validateAddCourseInput(key, addCourseDetails[key], updatedErrors);
                } else {
                    for (var i = 0; i < addCourseDetails.courses.length; i++) {
                        for (var key in addCourseDetails.courses[i]) {
                            if (addCourseDetails.courses[i].hasOwnProperty(key)) {
                                let updatedCourseErrors = { ...updatedCourseErrorses[i] };
                                updatedCourseErrors = validateAddCourseInput(key, addCourseDetails.courses[i][key], updatedCourseErrors);
                                updatedCourseErrorses[i] = updatedCourseErrors;
                            }
                        }
                    }
                }
            }
        }
        setAddCourseErrors({ ...updatedErrors, courses: updatedCourseErrorses });
        const fastaddCourseErrors = { ...updatedErrors, courses: updatedCourseErrorses };

        let ready = true;
        for (var key in fastaddCourseErrors) {
            if (fastaddCourseErrors.hasOwnProperty(key)) {
                if (!Array.isArray(fastaddCourseErrors[key])) {
                    if (fastaddCourseErrors[key] != '')
                        ready = false;
                } else {
                    if (fastaddCourseErrors[key].length == 0)
                        ready = false;
                    for (var i = 0; i < fastaddCourseErrors.courses.length; i++)
                        for (var key in fastaddCourseErrors.courses[i])
                            if (fastaddCourseErrors.courses[i].hasOwnProperty(key))
                                if (fastaddCourseErrors.courses[i][key] != '')
                                    ready = false;
                }
            }
        }

        console.log('Ready:', ready);
        console.log(addCourseDetails);
    }


    return (
        <div>
            <AddCourseDetailsFunctionBox
                data={addCourseDetails}
                errors={addCourseErrors}
                handleInputChange={handleAddCourseInputChange}
                handleCourseChange={handleCourseChange}
                handleSubmit={handlerAddCourseSubmit}
            />
        </div>
    );
};

export default AddCourseDetails;