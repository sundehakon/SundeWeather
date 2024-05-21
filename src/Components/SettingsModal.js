import { Button, Modal, Typography, Box } from '@mui/material';
import React, { useState } from 'react';

const SettingsModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>Open</Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    color: 'black',
                    boxShadow: 24,
                    padding: 4,
                }}>
                    <Typography variant='h5'>Settings</Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default SettingsModal;