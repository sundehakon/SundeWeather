import { Modal, Typography, Box, Switch } from '@mui/material';

const SettingsModal = ({ open, handleClose, displayFlag, setDisplayFlag }) => {

    const handleChange = (event) => {
        setDisplayFlag(event.target.checked);
    };

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
                borderRadius: 7
            }}>
                <Typography variant='h5' sx={{ textAlign: 'center', marginBottom: 1 }}>Settings</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Display Country Flag?</Typography>
                    <Switch checked={displayFlag} onChange={handleChange} name='displayFlag' />
                </Box>
            </Box>
        </Modal>
    );
};

export default SettingsModal;