import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

// List
import List from '@mui/material/List';
import { red } from '@mui/material/colors';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

import './feedbackSubmit.scss';

const FeedbackSubmit = (props) => {
  const profName = 'Dr ABCD';
  const courseName = 'Not Maths'
  const courseCode = 'CSE123'
  const year = '2020'
  const sem = "Even"
  const studens = "20"


  const [feedbackDetails, setFeedbackDetails,] = useState({
    feedback: '',
    skills: [],

  });

  // List state
  const [checked, setChecked] = useState([0]);

  // List handler
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1)
      newChecked.push(value);
    else
      newChecked.splice(currentIndex, 1);
    setChecked(newChecked);
  };

  return (
    <div className='feedbackSubmit'>
      <div className='feedbackSideStats'>
        <h1> Course Information </h1>
        <ul>
          <li> Professor: {profName} </li>
          <li> Course: {courseName} </li>
          <li> Code: {courseCode} </li>
          <li> Year: {year} </li>
          <li> Semester: {sem} </li>
          <li> Strength: {studens} </li>
        </ul>
      </div>

      <div className='feedbackMain'>
        <h1> Feedback Submission </h1>
        <div className='feedbackInput'>
          <CssTextField
            id="feedback-input"
            label="FEEDBACK"
            multiline
            rows={5}
          />

          <List sx={{
            border: '1px solid white',
            borderRadius: '3px',
            marginLeft: '1rem',
            width: '80%',
            maxWidth: 320,
            bgcolor: '#1f1f1f',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 150,
            '& ul': { padding: 0 },
          }}>
            {[0, 1, 2, 3].map((value) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem
                  key={value}
                  disablePadding
                >
                  <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        sx={{
                          color: red[800],
                          '&.Mui-checked': {
                            color: red[600],
                          },
                        }}
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className='hr' />
        <div className='feedbackFinal'>
          <CssTextField
            sx={{ margin: '1rem' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ConfirmationNumberIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
            }}
            id="input-ticket"
            name='ticket'
            //value={data.ticket}
            //onChange={props.handleInputChange}
            label="UNIQUE TICKET"
          //error={errors.ticket}
          //helperText={errors.ticket}
          />

          <Button sx={{ margin: '1rem', width: 300, height: 55, fontSize: '1rem' }} size='large' color="error" variant="contained" endIcon={<SendIcon />} onClick={props.handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackSubmit;



const CssTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& label': {
    color: 'white'
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ce3333',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
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