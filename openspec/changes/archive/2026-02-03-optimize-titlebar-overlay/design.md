# Design: Overlay Title Bar Implementation

## Context

This application is a macOS network repair utility built with Tauri 2.x. Currently, it uses the default title bar style which consumes significant vertical space at the top of the window. The goal is to implement a more modern, space-efficient UI using Tauri's Overlay title bar style available on macOS.

### Current State
- `tauri.conf.json` uses default window configuration without `titleBarStyle`
- Frontend is built with React + Tailwind CSS
- Window dimensions: 900x700, resizable

### Constraints
- Must maintain macOS native behavior (traffic lights, window dragging)
- Cross-platform support (fallback on Windows/Linux)
- Minimal changes to existing UI components

## Goals / Non-Goals

**Goals:**
- Implement Overlay title bar style on macOS
- Ensure content respects traffic light safe area (left padding ~80px)
- Maintain all existing window functionality (resize, minimize, maximize, close)
- Provide seamless fallback on non-macOS platforms

**Non-Goals:**
- Custom traffic light button styling (keep native macOS buttons)
- Full window frame customization (outside Tauri's Overlay API)
- Changes to window dimensions or resizable behavior

## Decisions

### Decision: Use Tauri's built-in `titleBarStyle: "Overlay"`
**Rationale:** Tauri 2.x provides native support for Overlay style on macOS, which is the standard way to achieve this effect without custom window chrome implementations.

**Alternative Considered:**
- Custom window with `decorations: false` and manual traffic light implementation
- **Rejected:** Requires complex native code, more maintenance burden, harder to keep macOS native behavior

### Decision: Handle safe area via CSS padding
**Rationale:** The traffic lights in Overlay mode appear at the standard macOS position (top-left). Adding CSS padding to the root layout ensures content doesn't overlap.

**Implementation:**
- Add `padding-top` to account for title bar height (~22px in Overlay mode)
- Add `padding-left` to account for traffic light safe area (~80px on macOS)
- Use Tailwind's arbitrary values or custom CSS classes

### Decision: Use platform detection for conditional styling
**Rationale:** Overlay style only affects macOS. We should only apply safe-area padding on macOS to avoid unnecessary spacing on Windows/Linux.

**Implementation:**
- Tauri provides platform info via `os` plugin or window metadata
- Use CSS media queries or conditional class application based on platform

## Risks / Trade-offs

**Risk:** Content might still overlap with traffic lights if padding calculations are incorrect
- **Mitigation:** Test with various content types; use generous safe area (~80-100px left padding)

**Risk:** Drag region might conflict with interactive elements near the title bar
- **Mitigation:** Ensure drag region is clearly defined; avoid placing buttons in the top-left safe area

**Risk:** Window dragging behavior changes unexpectedly
- **Mitigation:** Verify that the entire title bar area remains draggable; Tauri's Overlay mode maintains this by default

## Migration Plan

1. **Phase 1: Configuration Update**
   - Update `tauri.conf.json` to add `titleBarStyle: "Overlay"`
   - Test on macOS to verify Overlay style applies

2. **Phase 2: Frontend Adjustments**
   - Add platform detection utility
   - Update root layout with conditional safe-area padding
   - Test content positioning with various screen sizes

3. **Phase 3: Validation**
   - Verify traffic lights don't overlap content
   - Test window resizing behavior
   - Confirm fallback on Windows/Linux works correctly

## Open Questions

- Should we hide the window title entirely, or keep it visible in the center?
- Is the default 80px left padding sufficient, or do we need dynamic calculation?
