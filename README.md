# Sona Client

![Sona Screen](https://github.com/iosona/SonaClient/blob/main/screens/call_screen.jpg?raw=true)

Sona Client is a cross-platform desktop application designed for anonymous voice calls. Create private rooms or join existing ones by ID to communicate without revealing personal information.

# Features

#### • Anonymity: Focus on communication without worrying about your identity.

#### • Simple interface: Intuitive design for quickly creating and joining calls.

#### • Room creation: Easily initiate a new call session.

#### • Join by ID: Connect to existing rooms using a unique ID.

#### • Cross-platform: Works on Windows, macOS, and Linux (thanks to Electron).

#### • Connection Status: A visual indicator of the connection status.

# How to Use

### 1. Create a Room:

• Click the "Create Room" button.

• The app will automatically generate a unique room ID. Share this ID with anyone who needs to join.

• Once the room is created, you will be automatically connected to it.

### 2. Join the Room:

• Enter the received room ID in the "Enter ID" field.

• Click the "Join" button.

• Once successfully connected, you can start chatting.

### 3. Connection Status:

• The indicator in the upper left corner will show the current connection status (e.g., "Connecting...").

# Installation (for users)

### Sona Client is available for Windows, macOS, and Linux. You can download the latest version from the releases page: https://github.com/iosona/SonaClient/releases

# Supported platforms:
#### • Windows: sona-setup.exe

#### • Linux: Sona.AppImage

# Building from source (for developers)

#### To build and run Sona Client from source, follow these instructions.

### Requirements

#### • Node.js (LTS version recommended)
#### • npm (comes with Node.js) or Yarn

## Steps

## 1. Clone the repository:

```
git clone https://github.com/iosona/SonaClient
cd sona
```

## 2. Install dependencies:

```
npm install
# or
yarn install
```
The postinstall script will automatically install dependencies for Electron Builder.

## 3. Run in development mode:

```
npm run dev
```

## 4. Build for production:

```
npm run build
```

## 5. Build for specific platforms:
• Windows:

```
npm run build:win
```
• macOS:
```
npm run build:mac
```
• Linux:
```
npm run build:linux
```

## 6. Other scripts:
#### • npm run format: Format code with Prettier.
#### • npm run lint: Check code for errors with ESLint.
#### • npm run typecheck: Check TypeScript types for Node.js and the web part.
#### • npm run start: Run a preview of the built application. #### • npm run build:unpack: Build the unpacked version of the application.

# Technologies Used

#### • Electron: A framework for creating cross-platform desktop applications using web technologies.

#### • Electron Vite: A tool for rapidly developing Electron applications.

#### • Electron Builder: A tool for packaging and building Electron applications for various platforms.

#### • TypeScript: A programming language with typing for increased code reliability.

#### • Node.js: A runtime environment for server-side JavaScript (and in Electron).