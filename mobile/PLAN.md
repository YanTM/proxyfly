# Mobile Proxfier Implementation Plan

The goal is to create a 1:1 Android analog of the Proxfier desktop application. It will be a lightweight (<20MB) application that captures all system traffic and routes it through a proxy using the `sing-box` engine.

## User Review Required

> [!IMPORTANT]
> To build this project into a final APK, you will need **Android Studio** installed on your computer. I will provide all the code, but the final compilation step happens on your machine.

## Proposed Changes

### 1. Project Structure
We will create a native Android project (Kotlin) in the `mobile/` directory. This is the most efficient way to keep the app size small.

### 2. Core Engine: sing-box
- We will use the Android-compiled version of `sing-box`.
- Logic: The app will start a `VpnService`, create a TUN interface, and pass the file descriptor to the `sing-box` library.

### 3. User Interface
- We will use a **WebView** to load the same `index.html` used in the desktop version. This ensures a 1:1 visual match and keeps the project easy to maintain.

---

## Files to be Created

1. **MainActivity.kt**: The main entry point.
2. **ProxfierVpnService.kt**: Handles the VPN connection.
3. **AndroidManifest.xml**: App configuration.
4. **installation_guide.md**: Instructions for the smartphone.
