import { Modal, Typography, Box, Switch } from '@mui/material';
import LanguageSwitcher from './LanguageSwitcher';
import SettingsIcon from '@mui/icons-material/Settings';

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
                padding: 8,
                borderRadius: 7
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 3, gap: 1 }}>
                    <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold' }}>Settings</Typography>
                    <SettingsIcon />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ marginRight: 3 }}>Choose Language</Typography>
                        <LanguageSwitcher />
                    </Box>
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
