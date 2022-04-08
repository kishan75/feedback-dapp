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
import ContactMailIcon from '@mui/icons-material/ContactMail';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SendIcon from '@mui/icons-material/Send';


const addCoursesFunctionBox = (props) => {
    const data = props.data;
    const errors = props.errors;

    const defaultNumCoursesArr = Array.from({ length: 15 }, (_, i) => i + 1);
    const numCoursesArr = Array.from({ length: data.numCourses }, (_, i) => i + 1);

    return (
        <div className='fbox'>
            <h1> <MenuBookIcon /> ADD COURSES </h1>
            <br />
            <Box component="form" autoComplete="off">
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
                    value={data.email}
                    disabled
                    label="EMAIL"
                    type='email'
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
                    value={data.year}
                    onChange={props.handleInputChange}
                    label="YEAR"
                    error={errors.year}
                    helperText={errors.year}
                />

                <CSSFormControl sx={{ m: 1, minWidth: 150 }} >
                    <InputLabel id="menu-course"> NUMBER </InputLabel>
                    <Select
                        name='numCourses'
                        value={data.numCourses}
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
                    <FormHelperText> {errors.numCourses} </FormHelperText>
                </CSSFormControl>

                <hr className='horizontalRule' />

                {data.courses.length >= data.numCourses ? numCoursesArr.map((_, idx) => (
                    <CourseItem key={idx} index={idx} course={data.courses[idx]} errors={errors.courses[idx]} handleInputChange={(e) => props.handleCourseChange(e, idx)} />
                )) : null}


            </Box>
            <Button sx={{ m: 2, width: 300 }} size='large' color="error" variant="contained" endIcon={<SendIcon />} onClick={props.handleSubmit}>
                Add
            </Button>
        </div>
    );
}

export default addCoursesFunctionBox;



const CourseItem = (props) => {
    const errors = props.errors;
    return (
        <Box sx={{ display: 'flexbox', alignItems: 'center' }}>
            <CssTextField sx={{ minWidth: 130, maxWidth: 200 }}
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
                error={errors.name}
                helperText={errors.name}
            />

            <CssTextField sx={{ minWidth: 100, maxWidth: 150 }}
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
                error={errors.code}
                helperText={errors.code}
            />

            <CSSFormControl sx={{ m: 1, minWidth: 100, maxWidth: 150 }} >
                <InputLabel id="sem-course"> SEM </InputLabel>
                <Select
                    name='sem'
                    value={props.course.sem}
                    label="SEM"
                    onChange={props.handleInputChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={0}> EVEN </MenuItem>
                    <MenuItem value={1}>  ODD </MenuItem>
                </Select>
                <FormHelperText> {errors.sem} </FormHelperText>
            </CSSFormControl>

            <CssTextField sx={{ minWidth: 100, maxWidth: 150 }}
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
                error={errors.students}
                helperText={errors.students}
            />
            <hr className='horizontalRule' />
        </Box>
    );
}



const CssTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        color: 'white'
    },
    '& label': {
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

    '& .MuiInputBase-input.Mui-disabled': {
        color: '#808080'
    },
    "& .MuiFormLabel-root.Mui-disabled": {
        color: "#ce3333 !important"
    },
    '& label.Mui-focused.Mui-disabled': {
        color: "#808080 !important",
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
        '& fieldset': {
            borderColor: "#ce3333 !important",
        },
        '&:hover fieldset': {
            borderColor: "#ce3333 !important",
        },
        '&.Mui-focused fieldset': {
            borderColor: "#ce3333 !important",
        },
    },
});


const CSSFormControl = styled(FormControl)({
    '& .MuiInputBase-input': {
        color: 'white'
    },
    '& label': {
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