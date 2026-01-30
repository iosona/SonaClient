import { logger } from '@renderer/logger';
import Peer, { Instance } from 'simple-peer'

export type OnSignal = (signal: Peer.SignalData) => void;
export type CreatePeer = (stream: MediaStream, onSignal: OnSignal, onReconnect: () => void) => Instance;
export type AddPeer = (incommingSignal: Peer.SignalData, stream: MediaStream, onSignal: OnSignal) => Instance;

export const useP2P = () => {
    const createPeer: CreatePeer = (stream, onSignal, onReconnect) => {
        const peer: any = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', onSignal);
        peer._pc.oniceconnectionstatechange = () => {
            const state = peer._pc.iceConnectionState;
            window.api.sendNotify(`Ice state changed in createPeer: ${state}`, "ICE CHANGE");
            logger.warn(`Ice state changed increatepeer: ${state}`)
            if (state === 'failed' || state === 'disconnected') {
                logger.warn("Connection lost. Reconnecting...");
                //onReconnect();
            }
        }
        logger.debug("New peer created");
        return peer;
    }

    const addPeer: AddPeer = (incommingSignal, stream, onSignal) => {
        const peer: any = new Peer({ initiator: false, trickle: false, stream })
        peer.on('signal', onSignal);
        
        peer._pc.oniceconnectionstatechange = () => {
            const state = peer._pc.iceConnectionState;
            window.api.sendNotify(`Ice state changed in addPeer: ${state}`, "ICE CHANGE");
            logger.warn(`Ice state changed in addPeer: ${state}`)
            if (state === 'failed' || state === 'disconnected') {
                logger.warn("Connection lost. Reconnecting...");
                //onReconnect();
            }
        }

        peer.signal(incommingSignal);
        logger.debug("Incomming peer added");
        return peer;
    }

    const addStreamToPeer = (peer: Instance, stream: MediaStream) => {
        stream.getTracks().forEach(track => peer.addTrack(track, stream))
    }

    const removeStreamFromPeer = (peer: Instance, stream: MediaStream) => {
        stream.getTracks().forEach(track => peer.removeTrack(track, stream));
    }

    return {
        createPeer,
        addPeer,
        addStreamToPeer,
        removeStreamFromPeer
    }
}