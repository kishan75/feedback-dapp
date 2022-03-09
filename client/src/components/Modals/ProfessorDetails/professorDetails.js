import React, { useState, useEffect } from 'react';
import Header from '../../Header/header';
import ProfessorDetailsFunctionBox from '../../FunctionBox/ProfessorDetailsFunctionBox/professorDetailsFunctionBox';

import "./professorDetails.css";


const ProfessorDetails = (props) => {
    const [professorDetails, setProfessorDetails] = useState({
        address: '0xabcdef121345678',
        ticket: '',
        name: 'Dr. ',
        email: '',
    });

    const [professorErrors, setProfessorErrors] = useState({
        ticket: '',
        name: '',
        email: '',
    })


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


    const handlerProfessorSubmit = () => {
        let updatedErrors = {...professorErrors};

        for (var key in professorDetails) 
            if (professorDetails.hasOwnProperty(key))
                updatedErrors = validateProfessorInput(key, professorDetails[key], updatedErrors);

        setProfessorErrors({ ...updatedErrors});
        const fastProfessorErrors = { ...updatedErrors};

        let clear = true;
        for (var key in fastProfessorErrors) {
            if (fastProfessorErrors.hasOwnProperty(key))
                if(fastProfessorErrors[key] != '')
                    clear = false;
        }

        console.log('Ready:', clear);
        console.log(professorDetails);
    }

    return (
        <div className='cards'>
            <ProfessorDetailsFunctionBox
                data={professorDetails}
                errors={professorErrors}
                handleInputChange={handleProfessorInputChange}
                handleSubmit={handlerProfessorSubmit}
            />
        </div>
    );
};

export default ProfessorDetails;