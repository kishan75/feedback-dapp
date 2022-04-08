import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';


// CheckForm
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';


// Adornments
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// CSS
import './generateTicketsFunctionBox.scss';



const generateTicketsFunctionBox = (props) => {
    const data = props.data;
    const errors = props.errors;
    const nameOptions = props.mainOptions;
    const codeOptions = props.subOptions.code;
    const yearOptions = props.subOptions.year;
    const semOptions = props.subOptions.sem;
    const studentsOptions = props.subOptions.students;
    const emails = props.data.emails;

    // For Datagrid:
    const columns = [
        { field: 'id', headerName: 'S-No.', width: 90 },
        { field: 'email', headerName: 'Student E-Mail', width: 200 }
    ];
    let rows = [];
    for (var i = 0; i < emails.length; i++)
        rows.push({ id: i + 1, email: emails[i] });

    return (
        <div className='fbox'>
            <h1> GENERATE TICKETS </h1>
            <br />
            <br />
            <Box component="form" autoComplete="off" className='muiboxmain'>
                <div>
                    <CSSFormControl sx={{ m: 1, minWidth: 200 }} >
                        <InputLabel id="menu-course-name"> COURSE </InputLabel>
                        <Select
                            name='name'
                            value={data.name}
                            label="COURSE"
                            onChange={(e) => { props.handleInputChange(e); props.handleMainChange(e); }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {nameOptions.map((value, idx) => (
                                <MenuItem key={idx} value={value}> {value} </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.name}</FormHelperText>
                    </CSSFormControl>

                    <CSSFormControl sx={{ m: 1, minWidth: 200 }} >
                        <InputLabel id="menu-course-code"> CODE </InputLabel>
                        <Select
                            name='code'
                            value={data.code}
                            label="CODE"
                            onChange={props.handleInputChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {codeOptions.map((value, idx) => (
                                <MenuItem key={idx} value={value}> {value} </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.code}</FormHelperText>
                    </CSSFormControl>

                    <CSSFormControl sx={{ m: 1, minWidth: 200 }} >
                        <InputLabel id="menu-course-year"> YEAR </InputLabel>
                        <Select
                            name='year'
                            value={data.year}
                            label="YEAR"
                            onChange={props.handleInputChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {yearOptions.map((value, idx) => (
                                <MenuItem key={idx} value={value}> {value} </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.year}</FormHelperText>
                    </CSSFormControl>

                    <CSSFormControl sx={{ m: 1, minWidth: 200 }} >
                        <InputLabel id="menu-course-sem"> SEM </InputLabel>
                        <Select
                            name='sem'
                            value={data.sem}
                            label="SEM"
                            onChange={props.handleInputChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {semOptions.map((value, idx) => (
                                <MenuItem key={idx} value={idx}> {value} </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.sem}</FormHelperText>
                    </CSSFormControl>

                    <CSSFormControl sx={{ m: 1, minWidth: 200 }} >
                        <InputLabel id="menu-course-studs"> STUDENTS </InputLabel>
                        <Select
                            name='students'
                            value={data.students}
                            label="STUDENTS"
                            onChange={props.handleInputChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {studentsOptions.map((value, idx) => (
                                <MenuItem key={idx} value={value}> {value} </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.students}</FormHelperText>
                    </CSSFormControl>
                </div>

                <div>
                    {props.data.emails.length > 0 ?
                        <div style={{ height: 400, width: 320, marginRight: 20 }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                            />
                        </div> : null}
                </div>

            </Box>

            <div className='buttonflex'>
                <Button sx={{ m: 2, width: 300 }} size='large' color="error" variant="contained" endIcon={<SendIcon />} onClick={props.handleSubmit}>
                    Send
                </Button>
                <label htmlFor="icon-button-file">
                    <Input id="icon-button-file" accept=".csv, .txt" type="file" name='emailsfile' onChange={props.handleFileChange} />
                    <Button sx={{ m: 2, width: 250 }} variant="outlined" component="span" color="error" startIcon={<UploadFileIcon style={{ color: 'red' }} />}>
                        Upload
                    </Button>
                </label>
            </div>
            <FormHelperText sx={{ m: 2 }}>{errors.emails}</FormHelperText>

        </div>
    );
}

export default generateTicketsFunctionBox;


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


const Input = styled('input')({
    display: 'none',
});