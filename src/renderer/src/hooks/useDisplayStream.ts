import { DisplayInfo } from "@renderer/components/ScreenSelector";
import { logger } from "@renderer/logger";
import { useEffect, useState } from "react"

export const useDisplayStream = (displayInfo: DisplayInfo | null) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isError, setIsError] = useState<boolean>(false);

    const stop = () => {
        if (!stream) return;
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsError(false);
        logger.debug("Display stream destroyed");
    }

    useEffect(() => {
        if (!displayInfo) return;
        if (stream) stop();
        (async () => {
            try {
                const s = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        frameRate: { max: 10 },
                        displaySurface: 'monitor',
                        width: { max: 1280 }, 
                        height: { max: 720 },
                    },
                    audio: displayInfo.isSound
                });

                const videoTrack = s.getVideoTracks()[0];
                if (videoTrack) {
                    if ('contentHint' in videoTrack) {
                        videoTrack.contentHint = 'text'; 
                    }
                }

                setStream(s);
                setIsError(false);
            } catch (error) {
                logger.error("Failed to get display stream", error);
                setIsError(true);
            }
        })();
    }, [displayInfo]);

    return {
        stream,
        isError,
        stop
    }
}