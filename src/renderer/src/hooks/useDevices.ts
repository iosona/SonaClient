import { useEffect, useMemo, useState } from "react"

export const useDevices = () => {
    const [outputDevs, setOutputDevs] = useState<MediaDeviceInfo[]>([]);
    const [inputDevs, setInputDevs] = useState<MediaDeviceInfo[]>([]);

    const allDevs = useMemo(() => {
        return navigator.mediaDevices.enumerateDevices();
    }, []);

    const getOutputDevices = async () => {
        return (await allDevs)
            .filter(dev => dev.kind === 'audiooutput')
    }

    const getInputDevices = async () => {
        return (await allDevs)
            .filter(dev => dev.kind === 'audioinput')
    }

    useEffect(() => {
        getOutputDevices().then(setOutputDevs);
        getInputDevices().then(setInputDevs);
    }, []);

    return {
        outputDevs,
        inputDevs
    }
}