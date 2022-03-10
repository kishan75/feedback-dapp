import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// CheckForm
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

// Adornments
import InputAdornment from '@mui/material/InputAdornment';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SendIcon from '@mui/icons-material/Send';

// CSS
import './professorDetailsFunctionBox.scss';



const professorDetailsFunctionBox = (props) => {
    const state = props.state;
    const errors = props.errors;

    const defaultNumCoursesArr = Array.from({length: 15}, (_, i) => i + 1);
    const numCoursesArr = Array.from({length: state.numCourses}, (_, i) => i + 1);
    
    return (
        <div className='fbox'>
            <h1> PROFESSOR DETAILS </h1>
            <br />
            <Box component="form" autoComplete="off">
                <CssTextField
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ConfirmationNumberIcon />
                          </InputAdornment>
                        ),
                    }}
                    id="input-ticket"
                    name='ticket'
                    value={state.ticket}
                    onChange={props.handleInputChange}
                    label="UNIQUE TICKET"
                    error={errors.ticket}
                    helperText={errors.ticket}
                />

                <CssTextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <BadgeIcon />
                            </InputAdornment>
                        ),
                    }}
                    id="input-name"
                    name='name'
                    value={state.name}
                    onChange={props.handleInputChange}
                    label="NAME"
                    helperText=""
                    error={errors.name}
                    helperText={errors.name}
                />

                <CssTextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <ContactMailIcon />
                            </InputAdornment>
                        ),
                    }}
                    id="input-email"
                    name='email'
                    value={state.email}
                    onChange={props.handleInputChange}
                    label="EMAIL"
                    type='email'
                    helperText=""
                    error={errors.email}
                    helperText={errors.email}
                />

                <CssTextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <DateRangeIcon />
                            </InputAdornment>
                        )
                    }}
                    id="input-year"
                    name='year'
                    value={state.year}
                    onChange={props.handleInputChange}
                    label="YEAR"
                    helperText=""
                    error={errors.year}
                    helperText={errors.year}
                />

            <h3> <MenuBookIcon /> ASSIGN COURSES </h3> 

            <CSSFormControl sx={{ m: 1, minWidth: 150 }} >
                <InputLabel id="menu-course"> NUMBER</InputLabel>
                <Select
                    name='numCourses'
                    value={state.numCourses}
                    label="NUMBER"
                    onChange={props.handleInputChange}
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {defaultNumCoursesArr.map((value, idx) => (
                    <MenuItem key={idx} value={value}> {value} </MenuItem>
                ))}
                </Select>
                <FormHelperText></FormHelperText>
            </CSSFormControl>

            {state.courses.length >= state.numCourses ? numCoursesArr.map((_, idx) => (
                <CourseItem key={idx} index={idx} course={state.courses[idx]} errors={errors.courses[idx]} handleInputChange={(e) => props.handleCourseChange(e, idx)} />
            )) : null}

                
            </Box>
            <Button sx={{m:2, width:300}} size='large' color="error" variant="contained" endIcon={<SendIcon />} onClick={props.handleSubmit}>
                Send
            </Button>
        </div>
    );
}

export default professorDetailsFunctionBox;



const CourseItem = (props) => {
    const errors = props.errors;
    return (
        <Box sx={{ display: 'flexbox', alignItems: 'center'}}>
            <CssTextField
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start"> 
                        </InputAdornment>
                    )
                }}
                id="input-course-name"
                name='name'
                value={props.course.name}
                onChange={props.handleInputChange}
                label="COURSE NAME"
                helperText=""
                error={errors.name}
                helperText={errors.name}
            />

            <CssTextField  sx={{minWidth: 100, maxWidth: 150 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    )
                }}
                id="input-course-code"
                name='code'
                value={props.course.code}
                onChange={props.handleInputChange}
                label="CODE"
                helperText=""
                error={errors.code}
                helperText={errors.code}
            />

            <CssTextField sx={{minWidth: 100, maxWidth: 150}}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                    )
                }}
                id="input-num-students"
                name='students'
                value={props.course.students}
                onChange={props.handleInputChange}
                label="STUDENTS"
                helperText=""
                error={errors.students}
                helperText={errors.students}
            />
        </Box>
    );
}



const CssTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        color: 'white'
    },
    '& label':{
        color: '#666666'
    },
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#ce3333',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
        borderColor: '#666666',
        },
        '&:hover fieldset': {
        borderColor: '#ce3333',
        },
        '&.Mui-focused fieldset': {
        borderColor: '#ce3333',
        },
    },

    "& .MuiFormLabel-root.Mui-error": {
        color: "#ffdd00 !important"
    },
    '& label.Mui-focused.Mui-error': {
        color: "white !important",
    },
    '& .MuiOutlinedInput-root.Mui-error': {
        '& fieldset': {
        borderColor: "#ffdd00 !important",
        },
        '&:hover fieldset': {
        borderColor: "#ffdd00 !important",
        },
        '&.Mui-focused fieldset': {
        borderColor: "#ffdd00 !important",
        },
    },
});


const CSSFormControl = styled(FormControl)({
    '& .MuiInputBase-input': {
        color: 'white'
    },
    '& label':{
        color: '#666666'
    },
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#ce3333',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
        borderColor: '#666666',
        },
        '&:hover fieldset': {
        borderColor: '#ce3333',
        },
        '&.Mui-focused fieldset': {
        borderColor: '#ce3333',
        },
    },
});