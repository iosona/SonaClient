import avatar1 from './avatars/a1.jpg'
import avatar2 from './avatars/a2.jpg'
import avatar3 from './avatars/a3.jpg'
import avatar4 from './avatars/a4.jpg'
import avatar5 from './avatars/a5.jpg'
import avatar6 from './avatars/a6.jpg'
import avatar7 from './avatars/a7.jpg'
import avatar8 from './avatars/a8.jpg'
import appIcon from '../../../resources/sona.png'
import { IKeyBind } from './types'
import { KeyBindEvent } from './enums'

export const GITHUB_URL = "https://github.com/iosona/SonaClient"
export const TERMS_OF_USE_URL = "https://github.com/iosona/SonaClient/blob/main/TermsOfUse.txt"
export const PRIVACY_POLICY_URL = "https://github.com/iosona/SonaClient/blob/main/PrivacyPolicy.txt"
export const SERVER_URL = import.meta.env.VITE_SERVER_URL
export const API_KEY = import.meta.env.VITE_SERVER_API_KEY
export const VERSION = "1.0.2"
export const APP_ICON = appIcon;

export const avatarsList: any[] = [
    {
        id: "a1",
        src: avatar1
    },
    {
        id: "a2",
        src: avatar2
    },
    {
        id: "a3",
        src: avatar3
    },
    {
        id: "a4",
        src: avatar4
    },
    {
        id: "a5",
        src: avatar5
    },
    {
        id: "a6",
        src: avatar6
    },
    {
        id: "a7",
        src: avatar7
    },
    {
        id: "a8",
        src: avatar8
    }
]

export const QUALITY = [
    {
        name: "144p",
        resolution: [256, 144]
    },
    {
        name: "240p",
        resolution: [426, 240]
    },
    {
        name: "340p",
        resolution: [340, 480]
    },
    {
        name: "480p",
        resolution: [640, 480]
    },
    {
        name: "720p",
        resolution: [1280, 720]
    },
    {
        name: "1080p",
        resolution: [1920, 1080]
    }
]

export const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'uk', label: 'Українська' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'sp', label: 'Español' },
    { code: 'ch', label: '简体中文' }
];

export const FPS_RANGE = [
    10,
    15,
    20,
    25,
    30
]

export const ALLOWED_SPECIAL_KEYS = ['CONTROL', 'ALT', 'SHIFT']
export const ALLOWED_SIMPLE_KEYS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'I', 'X', 'Y', 'Z', 
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+'
];

export const ANONYMOUS_VOICE_PITCH = -5;

export const DEFAULT_KEY_BINDS: IKeyBind[] = [
    {
        event: KeyBindEvent.QuickMicroMuteToggle,
        keys: ["CONTROL", "D"]
    },
    {
        event: KeyBindEvent.LeaveFromCall,
        keys: ["CONTROL", "H"]
    },
    {
        event: KeyBindEvent.ClearChat,
        keys: ["CONTROL", 'K']
    },
    {
        event: KeyBindEvent.MembersMuteToggle,
        keys: ["CONTROL", "B"]
    },
    {
        event: KeyBindEvent.ChatOpenToggle,
        keys: ["CONTROL", "E"]
    },
    {
        event: KeyBindEvent.StopScreenSharing,
        keys: ["CONTROL", "S"]
    }
]