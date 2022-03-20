import React, { useState } from 'react';
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Button } from '@mui/material';
import CanteenFunctionBox from '../../FunctionBox/CanteenFunctionBox/canteenFunctionBox';
import CurrencyBitcoin from '@mui/icons-material/CurrencyBitcoin';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { red } from "@mui/material/colors";
import Avatar from '@mui/material/Avatar';

import './canteen.scss';

const Canteen = (props) => {
  const food = {
    Burger: 5,
    Juice: 2,
    Pizza: 15,
    Samosa: 3,
    Maggie: 5,
  }

  const [order, setOrder] = useState({
    foods: [],
    price: 0,
    error: ''
  });


  // Handlers
  const handleFoodChange = (foods) => {
    let price = 0
    for (var i = 0; i < foods.length; i++)
      price += food[foods[i]]

    setOrder({ price: price, foods: foods })
  }


  const handleSubmit = () => {
    if (props.balance < order.price) {
      setOrder({ ...order, error: `Insufficient tokens (${props.balance})` })
      return;
    }



  }

  return (
    <div className='cards'>
      <div className='fbox'>
        <h1> VIRTUAL CANTEEN </h1>
        <br />
        <br />
        <div className='innerCanteen'>
          Select items to order:
          <br /> <br />
          <CanteenFunctionBox titleLeft='Stock:' titleRight='Cart:' items={Object.keys(food)} food={food} handleFoodChange={handleFoodChange} />
          <div className='priceWindow'>
            <CssTextField
              sx={{ margin: "1rem", maxWidth: "300px", placeSelf: 'center' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <Avatar sx={{ bgcolor: red[800] }} > <CurrencyBitcoin /> </Avatar>
                  </InputAdornment>
                ),
              }}
              id="total-price"
              name="price"
              disabled
              value={order.price}
              label="TOTAL"
              error={order.error}
              helperText={order.error}
            />
            <Button variant='outlined' color='error' endIcon={<ShoppingCartOutlinedIcon />} sx={{ color: 'white' }}
              onClick={handleSubmit} size="large">
              ORDER
            </Button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Canteen;


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

  "& .MuiFormLabel-root.Mui-error.Mui-disabled": {
    color: "#ffdd00 !important"
  },
  '& label.Mui-focused.Mui-error.Mui-disabled': {
    color: "white !important",
  },
  '& .MuiOutlinedInput-root.Mui-error.Mui-disabled': {
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
    color: 'white'
  },
  "& .MuiFormLabel-root.Mui-disabled": {
    color: "#ce3333 !important"
  },
  '& label.Mui-focused.Mui-disabled': {
    color: "white !important",
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