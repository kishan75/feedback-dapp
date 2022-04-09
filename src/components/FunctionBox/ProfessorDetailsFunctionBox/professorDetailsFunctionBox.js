import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Adornments
import InputAdornment from '@mui/material/InputAdornment';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// CSS
import './professorDetailsFunctionBox.scss';



const professorDetailsFunctionBox = (props) => {
    const data = props.data;
    const errors = props.errors;

    return (
        <div className='fbox'>
            <h1> PROFESSOR DETAILS </h1>
            <br />
            <Box component="form" autoComplete="off">
                <CssTextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountBalanceWalletIcon />
                            </InputAdornment>
                        )
                    }}
                    id="input-address"
                    name='address'
                    value={data.address}
                    disabled
                    //onChange={props.handleInputChange}
                    label="ADDRESS"
                    error={errors.address}
                    helperText={errors.address}
                />


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
                    value={data.ticket}
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
                    value={data.name}
                    onChange={props.handleInputChange}
                    label="NAME"
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
                    value={data.email}
                    onChange={props.handleInputChange}
                    label="EMAIL"
                    type='email'
                    error={errors.email}
                    helperText={errors.email}
                />


            </Box>
            <div className='centerbutton'>
                <Button sx={{ m: 2, width: 300 }} size='large' color="error" variant="contained" endIcon={<HowToRegIcon />} onClick={props.handleSubmit}>
                    Register
                </Button>

                <label htmlFor="icon-button-img" disabled={props.disableUpload.disabled}>
                    <Input id="icon-button-img" accept=".jpeg, .jpg, .png" type="file" name='pic' onChange={props.handleFileChange} disabled={props.disableUpload.disabled} />
                    <Button sx={{ m: 2, width: 250 }} variant="outlined" component="span" color="error" startIcon={<PhotoCamera style={{ color: 'red' }} />}>
                        {props.disableUpload.disabled ? props.disableUpload.message : 'Upload Image'}
                    </Button>
                </label>
                <br></br>
                <div className='yellow'>{errors.file}</div>
            </div>
        </div>
    );
}

export default professorDetailsFunctionBox;




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

const Input = styled('input')({
    display: 'none',
});