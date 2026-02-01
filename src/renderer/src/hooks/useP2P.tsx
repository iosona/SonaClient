import { logger } from '@renderer/logger';
import Peer, { Instance } from 'simple-peer'

export type OnSignal = (signal: Peer.SignalData) => void;
export type CreatePeer = (stream: MediaStream, onSignal: OnSignal, onRestart: () => void) => Instance;
export type AddPeer = (incommingSignal: Peer.SignalData, stream: MediaStream, onSignal: OnSignal) => Instance;

export const useP2P = () => {
    const createPeer: CreatePeer = (stream, onSignal, onRestart) => {
        let isRestarting = false;
        let restartInterval: any = null;
        const peer: any = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            isRestarting = false;
            onSignal(data);
        });

        const startIceRestart = () => {
            if (isRestarting || !navigator.onLine) return;

            isRestarting = true;
            try {
                logger.error(`Ice restart triggered...`);
                peer._pc.restartIce();
                peer._pc.dispatchEvent(new Event('negotiationneeded'));
            } catch (e) {
                isRestarting = false;
                logger.error("RestartIce error", e);
            }
        };

        peer._pc.oniceconnectionstatechange = () => {
            const state = peer._pc.iceConnectionState;
            if (restartInterval) clearInterval(restartInterval);

            if (state === 'failed' || state === 'disconnected') {
                startIceRestart();
                setTimeout(() => {
                    const state = peer._pc?.iceConnectionState;
                    if (!state || state === 'failed' || state === 'disconnected') {
                        onRestart();
                    }
                }, 5000);
            }
        };

        return peer;
    };

    const addPeer: AddPeer = (incommingSignal, stream, onSignal) => {
        const peer: any = new Peer({ initiator: false, trickle: false, stream })
        peer.on('signal', onSignal);
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