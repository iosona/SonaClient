import { DisplayInfo } from "@renderer/components/ScreenSelector";
import { QUALITY } from "@renderer/constants";
import { logger } from "@renderer/logger";
import { useStorage } from "@renderer/providers/useStorage";
import { useEffect, useState } from "react"

export const useDisplayStream = (displayInfo: DisplayInfo | null) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const { sharingFPS, sharingQuality } = useStorage();

    const stop = () => {
        if (!stream) return;
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsError(false);
        logger.debug("Display stream destroyed");
    }

    const getResolution = () => QUALITY.find(q => q.name === sharingQuality)?.resolution || [1280, 720]

    useEffect(() => {
        if (!displayInfo) return;
        if (stream) stop();
        (async () => {
            try {
                const r = getResolution()
                const s = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        frameRate: { max: sharingFPS },
                        displaySurface: 'monitor',
                        width: { max: r[0] }, 
                        height: { max: r[1] },
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

    const updateQuality = async (resolution: number[], fps: number) => {
        if (!stream) return;
        try {
            const videoTrack = stream.getVideoTracks()[0];
            await videoTrack.applyConstraints({
                width: { max: resolution[0] },
                height: { max: resolution[1] },
                frameRate: { max: fps }
            })
            logger.success("Quality has been successfully changed");
        } catch (error) {
            logger.error("Failed to change display stream quality", error);
        }
    }

    useEffect(() => {
        updateQuality(getResolution(), sharingFPS);
    }, [sharingFPS, sharingQuality]);


    return {
        stream,
        isError,
        updateQuality,
        stop
    }
}