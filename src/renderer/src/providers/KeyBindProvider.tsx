import { ALLOWED_SIMPLE_KEYS, DEFAULT_KEY_BINDS } from "@renderer/constants";
import { IKeyBind } from "@renderer/types";
import { createContext, FC, useEffect, useState } from "react";

export interface KeyBindContext {
    updateKeyBind: (eventName: string, data: any) => void;
    keybinds: IKeyBind[];
}

export const keyBindContext = createContext<KeyBindContext>({} as KeyBindContext);

const KEY_BINDS_NAME = "keyBinds";

export const KeyBindProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [keybinds, setKeyBinds] = useState<IKeyBind[]>(DEFAULT_KEY_BINDS);

    useEffect(() => {
        try {
            const binds = JSON.parse(localStorage.getItem(KEY_BINDS_NAME) || '');
            if (!Array.isArray(binds)) {
                return;
            }
            setKeyBinds(binds);
        } catch (error) {
            
        }
    }, []);

    const updateKeyBind = (eventName: string, data: any) => {
        setKeyBinds(prev => {
            const binds = prev.map(bind => {
                if (bind.event === eventName) {
                    return {
                        ...bind,
                        ...data
                    }
                }
                return bind;
            })
            localStorage.setItem(KEY_BINDS_NAME, JSON.stringify(binds));
            return binds;
        });

    }

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            const isSpecialKeyPressed = e.ctrlKey || e.altKey || e.shiftKey;
            if (isSpecialKeyPressed && ALLOWED_SIMPLE_KEYS.includes(key)) {
                const firstKey = e.ctrlKey ? "CONTROL" : e.altKey ? "ALT" : "SHIFT";
                console.log(firstKey, key);
                const keybind = keybinds.find(bind => bind.keys[0] === firstKey && bind.keys[1] === key);
                console.log(keybinds, keybind);
                if (!keybind || !keybind.action) {
                    return;
                }

                keybind.action();
            }
        }
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        }
    }, [keybinds]);

    return (
        <keyBindContext.Provider value={{ 
            keybinds,
            updateKeyBind
        }}>
            {children}
        </keyBindContext.Provider>
    );
}