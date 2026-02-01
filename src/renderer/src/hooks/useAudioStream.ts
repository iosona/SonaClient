import { logger } from "@renderer/logger";
import { useStorage } from "@renderer/providers/useStorage";
import { getRandomInteger } from "@renderer/utils";
import { useEffect, useState } from "react";
import * as Tone from 'tone';

export const useAudioStream = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mic, setMic] = useState<Tone.UserMedia | null>(null);
    const { mediaDevsIds, isVoiceChange } = useStorage();

    useEffect(() => {
        createStream().then(setStream);
    }, []);

    const createAnonymousAudioStream = async () => {
        await Tone.start();
  
        const micro = new Tone.UserMedia();
        setMic(micro);
        await micro.open();

        const compressor = new Tone.Compressor({
            threshold: -24,
            ratio: 4
        });

        const randomPitch = getRandomInteger(-6, -3.5);
        const pitchShift = new Tone.PitchShift({
            pitch: randomPitch
        });

        const volumeBoost = new Tone.Gain(2.5);

        const audioCtx = Tone.getContext().rawContext as AudioContext;
        const dest = audioCtx.createMediaStreamDestination();

        micro.chain(compressor, pitchShift, volumeBoost, dest);
        
        return dest.stream;
    }

    const createStream = async () => {
        if (isVoiceChange) {
            return createAnonymousAudioStream();
        }
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
        if (mic) {
            mic.close();
            mic.dispose();
            setMic(null);
        }
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