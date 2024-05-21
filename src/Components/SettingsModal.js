import { Modal, Typography, Box } from '@mui/material';

const SettingsModal = ({ open, handleClose }) => {
    return (
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
    );
};

export default SettingsModal;