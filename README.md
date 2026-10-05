# PMUK Mac Recorder

PMUK Recorder for macOS v1.4.3.

This build matches the PMUK desktop recorder workflow with local recording storage, CRM login, all-leads access, retryable uploads, call outcome fields, Initial Call completion, callback scheduling and `pmuk-recorder://` deep links.

## Automatic Mac build

GitHub Actions builds the DMG and ZIP automatically on every push to `main`, and can also be run manually from the Actions tab using **Build PMUK Mac Recorder**.

The resulting installer files are available as workflow artifacts.

## Server compatibility

Use with PMUK v3.2.124 or later.

## macOS permissions

On first run, allow Microphone and Screen/System Audio permissions when prompted. If needed, enable PMUK Recorder under **System Settings > Privacy & Security**, then restart the app.

## Signing

The automated build is currently unsigned/not notarised. macOS may show a security warning on first launch. Apple Developer ID signing/notarisation can be added later without changing the recorder workflow.


Build workflow enabled.
