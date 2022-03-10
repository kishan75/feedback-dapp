import React, { useState, useEffect } from 'react';
import AddCourseFunctionBox from '../../FunctionBox/AddCoursesFunctionBox/addCoursesFunctionBox';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const AddCourses = (props) => {
    const [addCourseDetails, setAddCourseDetails] = useState({
        email: 'fixedemail@iitbhu.ac.in',
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

    const [toast, setToast] = useState({
        message: '',
        severity: '',
        open: false
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
                else if (!(value == 0 || value == 1))
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
        return updatedErrors;
    }


    // Asyncs:
    const writeToBlockChain = async () => {
        const feedbackData = props.mainState.contract.feedbackData;
        const courses = addCourseDetails.courses;
        console.log(feedbackData);
        console.log(courses);
        if (feedbackData) {
            for (var i = 0; i < courses.length; i++) {
                const { name, code, sem, students } = courses[i];
                let result = await feedbackData.addCourse(
                    addCourseDetails.year,
                    addCourseDetails.email,
                    name,
                    code,
                    sem,
                    students, { from: props.mainState.account.address }
                );

                result = result.logs[0].args["course"];
                console.log(result);
                if (result == undefined)
                    setToast({ message: `INTERNAL-ERROR: No response for TxN[${i + 1}, ${code}]`, severity: 'error', open: true });
            }
        } else {
            setToast({ message: 'INTERNAL-ERROR: Feedback contract not deployed', severity: 'error', open: true });
            console.log('Feedback contract not deployed');
        }
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

        if (ready) {
            writeToBlockChain()
                .then(r => {
                    console.log(r);
                    setToast({ message: 'TxN SUCCESS: Course(s) have been added', severity: 'success', open: true });
                    setTimeout(() => props.closeModal(), 3500);
                }
                ).catch(e => {
                    console.log(e);
                    if (e.code == 'INVALID_ARGUMENT')
                        setToast({ message: 'ERROR: INVALID_ARGUMENT', severity: 'error', open: true });
                    else if (e.code == '4001')
                        setToast({ message: 'TxN WARN: Denied by user', severity: 'warning', open: true });
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


    return (
        <div>
            <Snackbar autoHideDuration={4500} open={toast.open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleToastClose}>
                <Alert severity={toast.severity} sx={{ width: '100%' }}>
                    {toast.message}
                </Alert>
            </Snackbar>

            <AddCourseFunctionBox
                data={addCourseDetails}
                errors={addCourseErrors}
                handleInputChange={handleAddCourseInputChange}
                handleCourseChange={handleCourseChange}
                handleSubmit={handlerAddCourseSubmit}
            />
        </div>
    );
};

export default AddCourses;