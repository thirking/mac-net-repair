## 1. Backend Implementation (Rust)

- [x] 1.1 Update `ProxyConfig` struct in `src-tauri/src/commands/proxy.rs` if needed to support setting values (currently supports it, verify serialization).
- [x] 1.2 Implement `set_http_proxy` command in `src-tauri/src/commands/proxy.rs` to configure HTTP proxy via `networksetup`.
- [x] 1.3 Implement `set_https_proxy` command in `src-tauri/src/commands/proxy.rs` to configure HTTPS proxy via `networksetup`.
- [x] 1.4 Implement `set_socks_proxy` command in `src-tauri/src/commands/proxy.rs` to configure SOCKS proxy via `networksetup`.
- [x] 1.5 Register new commands in `src-tauri/src/main.rs` (or `lib.rs` if using Tauri 2.0 structure).
- [x] 1.6 Verify `clear_all_proxies` implementation covers all requirements.

## 2. Frontend Implementation (React/Tauri)

- [x] 2.1 Create TypeScript interfaces for Proxy settings matching the Rust structs.
- [x] 2.2 Create `ProxyCard` component to display and edit a single proxy type (toggle, server input, port input).
- [x] 2.3 Create `ProxyManagement` page/container that fetches initial state using `get_proxy_settings`.
- [x] 2.4 Implement "Clear All Proxies" button with confirmation and call `clear_all_proxies`.
- [x] 2.5 Wire up `ProxyCard` components to call respective set commands on save/toggle.
- [x] 2.6 Add error handling and loading states for async operations.
- [x] 2.7 Add navigation to the new Proxy Management page (if not replacing an existing route).

## 3. Validation

- [x] 3.1 Verify reading current system proxy settings works correctly.
- [x] 3.2 Verify toggling proxies on/off updates system settings.
- [x] 3.3 Verify changing server/port updates system settings.
- [x] 3.4 Verify "Clear All" disables all proxies.
