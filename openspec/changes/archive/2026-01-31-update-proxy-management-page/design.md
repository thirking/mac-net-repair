## Context
Currently, the application has basic proxy management capabilities in the backend (`src-tauri/src/commands/proxy.rs`), primarily focused on reading proxy status and clearing all proxies. The frontend lacks a comprehensive interface for users to granularly control these settings. Users need a way to view and edit HTTP, HTTPS, and SOCKS proxy settings individually.

## Goals / Non-Goals

**Goals:**
- Implement backend commands to set individual proxy configurations (server, port, enabled state).
- Create a user-friendly frontend interface for managing proxy settings.
- Ensure real-time synchronization between system proxy settings and the UI.
- Provide a safe way to clear all proxies.

**Non-Goals:**
- Supporting advanced proxy configurations like PAC files or automatic proxy discovery (WPAD) in this iteration.
- Managing proxies for network interfaces other than the active primary service (though the backend supports specifying service names).
- Cross-platform support (Windows/Linux) - this is specific to macOS (`networksetup`).

## Decisions

### Decision: Backend Command Structure
We will extend `src-tauri/src/commands/proxy.rs` with specific commands for setting proxies.
- **Why**: Keeps proxy-related logic encapsulated in one module.
- **Approach**: Add `set_http_proxy`, `set_https_proxy`, `set_socks_proxy` commands that take server, port, and enabled status. This maps directly to `networksetup` commands.

### Decision: Frontend State Management
We will use a local state in the proxy management component, initialized by fetching current settings on mount.
- **Why**: Proxy settings are external system state. We don't need global app state management for this unless other components need to react to proxy changes (which they currently don't).
- **Refinement**: We might add a "refresh" button or auto-refresh on window focus if external changes are frequent, but manual refresh is sufficient for V1.

### Decision: UI Layout
Use a card-based layout for each proxy type (HTTP, HTTPS, SOCKS) with a toggle switch and input fields.
- **Why**: Clearly separates concerns and allows independent control.

## Risks / Trade-offs

- **Risk**: `networksetup` commands require specific permissions or might fail if the user doesn't have admin rights (though usually runs in user context for user-specific settings, some system-wide changes might prompt for password).
  - **Mitigation**: Handle command failures gracefully and display error messages to the user.
- **Risk**: Race conditions if the user changes settings in System Settings while the app is open.
  - **Mitigation**: Accept that the app shows a snapshot. Re-fetching settings after any write operation ensures UI eventual consistency.

## Migration Plan
No data migration needed as this interacts directly with system settings.
Deploy simply requires the new build with updated backend and frontend assets.
