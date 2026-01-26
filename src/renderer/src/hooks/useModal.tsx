import { useState } from "react";

export const useModal = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<any>(null);

    const handleOpen = (_d?: any) => {
        setOpen(true);
        setData(_d);
    }
    const handleClose = () => {
        setOpen(false);
    }

    return {
        open,
        data,
        handleClose,
        handleOpen
    }
}