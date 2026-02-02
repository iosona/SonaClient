import { useContext } from "react";
import { keyBindContext } from "./KeyBindProvider";

export const useKeyBind = () => useContext(keyBindContext);