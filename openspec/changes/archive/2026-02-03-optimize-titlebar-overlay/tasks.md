# Tasks: Overlay Title Bar Implementation

## 1. Configuration Update

- [x] 1.1 Add `titleBarStyle: "Overlay"` to `tauri.conf.json` window configuration
- [x] 1.2 Verify configuration is valid by running `pnpm tauri dev` and checking for errors

## 2. Frontend Safe Area Implementation

- [x] 2.1 Install `@tauri-apps/plugin-os` if not already available for platform detection
- [x] 2.2 Create utility function to detect macOS platform
- [x] 2.3 Update root layout/App component with conditional padding for macOS traffic light safe area (left ~80px, top ~40px)
- [x] 2.4 Test that content no longer overlaps with traffic lights

## 3. Cross-Platform Testing

- [x] 3.1 Test on macOS to verify Overlay style works correctly
- [x] 3.2 Verify traffic light buttons are accessible and functional
- [x] 3.3 Test window resizing behavior with Overlay style
- [x] 3.4 Confirm Windows/Linux builds are not negatively affected

## 4. Polish and Documentation

- [x] 4.1 Adjust safe area padding values based on visual testing
- [x] 4.2 Update any hardcoded header heights that might conflict with new layout
- [x] 4.3 Document the Overlay title bar implementation in code comments
