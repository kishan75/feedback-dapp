import React, { useState } from 'react';
import Admin from '../Modals/Admin/admin';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import './adminBar.scss';


const AdminBar = (props) => {

    // For AdminModal Modal
    const [openAdmin, setOpenAdmin] = useState(false);
    const handleOpenAdmin = () => setOpenAdmin(true);
    const handleCloseAdmin = () => setOpenAdmin(false);

    return (
        <div className="invisSlider">
            <div className="adminBar">
                <ul>
                    <li>
                        <Button size="small" color="error" onClick={handleOpenAdmin}> ADMIN </Button>
                    </li>
                    <Modal
                        open={openAdmin}
                        onClose={handleCloseAdmin}
                        aria-labelledby="admin"
                        aria-describedby="For admin controls"
                    >
                        <Box sx={style}>
                            <Admin {...props} closeModal={handleCloseAdmin} />
                        </Box>
                    </Modal>
                </ul>
            </div>
        </div>
    );
};

export default AdminBar;



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    overflow: 'scroll',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '75%',
    bgcolor: '#00000099',
    border: '2px solid #000',
    boxShadow: 24,
    p: 0,
};