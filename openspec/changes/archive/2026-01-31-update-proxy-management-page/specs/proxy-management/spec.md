## ADDED Requirements

### Requirement: View Proxy Status
The system SHALL display the current configuration and status (enabled/disabled) for HTTP, HTTPS, and SOCKS proxies.

#### Scenario: Display current settings
- **WHEN** user visits the proxy management page
- **THEN** system fetches and displays the enabled status, server, and port for each proxy type

### Requirement: Toggle Proxy Types
The system SHALL allow users to independently enable or disable HTTP, HTTPS, and SOCKS proxies.

#### Scenario: Enable HTTP proxy
- **WHEN** user toggles the HTTP proxy switch to ON
- **THEN** system enables the HTTP proxy configuration in system settings

#### Scenario: Disable SOCKS proxy
- **WHEN** user toggles the SOCKS proxy switch to OFF
- **THEN** system disables the SOCKS proxy configuration in system settings

### Requirement: Edit Proxy Configuration
The system SHALL allow users to modify the server address and port number for each proxy type.

#### Scenario: Update HTTPS proxy server
- **WHEN** user enters a new server address and port for HTTPS proxy and saves
- **THEN** system updates the HTTPS proxy configuration with the new values

### Requirement: Clear All Proxies
The system SHALL provide a function to disable all proxy types and clear their configurations simultaneously.

#### Scenario: Clear all settings
- **WHEN** user clicks the "Clear All Proxies" button
- **THEN** system disables HTTP, HTTPS, and SOCKS proxies
- **AND** system clears any auto-proxy configuration
