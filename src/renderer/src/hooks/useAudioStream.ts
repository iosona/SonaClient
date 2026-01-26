import { logger } from "@renderer/logger";
import { useStorage } from "@renderer/providers/useStorage";
import { useEffect, useState } from "react";

export const useAudioStream = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const { mediaDevsIds } = useStorage();

    useEffect(() => {
        createStream().then(setStream);
    }, []);

    const createStream = async () => {
        try {
            return navigator.mediaDevices.getUserMedia({ 
                audio: {
                    deviceId: { exact: mediaDevsIds.inputAudioDevice }
                }, 
                video: false
            })
        } catch (error) {
            logger.error("Failed to get audio stream", error);
            return null;
        }
    }

    const stop = () => {
        if (!stream) return;
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        logger.debug("Audio stream destroyed");
    }

    const toggleMute = () => {
        if (!stream) return false;
        const audioTracks = stream.getAudioTracks();
        const isEnabled = audioTracks[0].enabled;
        audioTracks.forEach(track => {
            track.enabled = !isEnabled;
        });
        return isEnabled;
    }

    return {
        stream,
        stop,
        toggleMute,
        createStream,
        setStream
    }
}