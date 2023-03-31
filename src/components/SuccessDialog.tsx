import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Icon,
    IconButton,
    Input
} from "@mui/material";
import {inspect} from "util";
import styles from '@/styles/Home.module.scss'
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {useEffect, useState} from "react";

export interface SuccessDialogProps {
    url?: string;
    onClose: () => void;

}

export default function SuccessDialog({url, onClose}: SuccessDialogProps) {
    const [secure, setSecure] = useState<boolean>(false);
    useEffect(() => {
        setSecure(window.isSecureContext);
    }, []);

    return <Dialog
        open={url !== undefined}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={onClose}
        sx={{
            '& .MuiDialog-paper': {
                backgroundColor: '#3f4459',
                width: '100%',
            },
            '& .MuiDialogTitle-root,.MuiDialogContentText-root': {
                color: 'white',
                fontFamily: '\'Roboto Mono\', monospace',
            }
        }}
    >
        <DialogTitle id='alert-dialog-title'>Cool link is ready!</DialogTitle>
        <DialogContent style={{width: '100%', display: 'block'}} className={styles.successdialog} sx={{position: 'relative'}}>
            <DialogContentText id='alert-dialog-description'>
                <input value={url} readOnly/>
            </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
            <Button onClick={onClose} color='info' autoFocus>Close</Button>
            {secure && <Button onClick={() => window.navigator.clipboard.writeText(url!)} color='success' autoFocus>Copy</Button>}

        </DialogActions>
    </Dialog>
}