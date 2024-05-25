import { Modal, Typography, Box, Switch } from '@mui/material';
import LanguageSwitcher from './LanguageSwitcher';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';

const SettingsModal = ({ open, handleClose, displayFlag, setDisplayFlag, displayFavorites, setDisplayFavorites }) => {
    const { t } = useTranslation();

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
                    <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold' }}>{t('settings')}</Typography>
                    <SettingsIcon />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ marginRight: 3 }}>{t('language')}</Typography>
                        <LanguageSwitcher />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>{t('displayFlag')}</Typography>
                        <Switch checked={displayFlag} onChange={handleDisplayFlag} name='displayFlag' />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>{t('displayFavorites')}</Typography>
                        <Switch checked={displayFavorites} onChange={handleDisplayFavorites} name='displayFavorites' />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default SettingsModal;
