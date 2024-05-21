import { Button, Modal, Typography } from '@mui/material';
const SettingsModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    
    return (
        <Button onClick={handleOpen}>Open</Button>
        <Modal>
            <Typography>Modal</Typography>
        </Modal>
    );
};