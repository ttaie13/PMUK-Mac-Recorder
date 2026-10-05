PMUK Recorder v1.3.0 - macOS build

This is the same recorder application as the Windows v1.3.0 build, configured for macOS.

BUILD ON macOS OR CLOUD MAC RUNNER
1. npm install
2. npm run dist:mac
3. The DMG and ZIP are created in dist/

INSTALL
Open the DMG and install PMUK Recorder into Applications. On first launch macOS will ask for microphone permission.

IMPORTANT
This source is not Apple Developer ID signed/notarised. For frictionless distribution to staff Macs, sign/notarise the build with an Apple Developer account.

CRM API
The application uses https://pmukofficial.com/desktop_recorder_api.php, the same API as the Windows build.
