import { VolumeDown, VolumeMute, VolumeOff, VolumeUp } from "@mui/icons-material";
import { avatarsList } from "./constants";

export function getHexColorByUsername(username: string) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
}

export function getAvatarSrcById(id: string | null) {
    return avatarsList.find(a => a.id === id)?.src;
}

export function getUIFromVolume(volume: number) {
    if (volume === 0) {
        return {
            icon: VolumeOff,
            color: "error"
        }
    }
    if (volume >= 1 && volume <= 40) {
        return {
            icon: VolumeMute,
            color: "warning"
        }
    }
    if (volume >= 41 && volume <= 70) {
        return {
            icon: VolumeDown,
            color: "success"
        }
    }
    if (volume >= 71) {
        return {
            icon: VolumeUp,
            color: "primary"
        }
    }
    return undefined
}