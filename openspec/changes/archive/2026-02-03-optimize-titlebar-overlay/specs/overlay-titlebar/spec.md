# Spec: Overlay Title Bar

## ADDED Requirements

### Requirement: Window uses Overlay title bar style
The system SHALL use Tauri's Overlay title bar style on macOS to create an immersive, space-efficient window chrome.

#### Scenario: Application launches on macOS
- **WHEN** the application launches on macOS
- **THEN** the window displays with Overlay title bar style
- **AND** the window control buttons (close, minimize, maximize) float over the content area

### Requirement: Content respects traffic light safe area
The system SHALL ensure window content does not overlap with macOS traffic light buttons (close, minimize, maximize) when using Overlay style.

#### Scenario: Rendering main content
- **WHEN** the main content area renders
- **THEN** the top padding accounts for the traffic light safe area (approximately 40px on the left side)
- **AND** the window title remains visible in the center

### Requirement: Window maintains resizable behavior
The system SHALL preserve the window's resizable behavior when using Overlay title bar style.

#### Scenario: Resizing window
- **WHEN** the user resizes the window
- **THEN** the traffic light buttons remain in their standard position (top-left)
- **AND** the content area adjusts accordingly
- **AND** the Overlay style remains active

### Requirement: Cross-platform compatibility
The system SHALL gracefully handle Overlay title bar style on non-macOS platforms by using appropriate fallbacks.

#### Scenario: Running on Windows or Linux
- **WHEN** the application runs on Windows or Linux
- **THEN** the window uses default title bar style
- **AND** the application functions normally without Overlay-specific styling
