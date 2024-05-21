import { Modal, Typography, Box, Switch } from '@mui/material';

const SettingsModal = ({ open, handleClose, displayFlag, setDisplayFlag, displayFavorites, setDisplayFavorites }) => {

    const handleDisplayFlag = (event) => {
        setDisplayFlag(event.target.checked);
    };

    const handleDisplayFavorites = (event) => {
        setDisplayFavorites(event.target.checked);
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>Display Country Flag?</Typography>
                        <Switch checked={displayFlag} onChange={handleDisplayFlag} name='displayFlag' />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>Display Favorites?</Typography>
                        <Switch checked={displayFavorites} onChange={handleDisplayFavorites} name='displayFavorites' />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default SettingsModal;