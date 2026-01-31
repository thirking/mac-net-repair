## ADDED Requirements

### Requirement: Network service selection
The system SHALL allow users to select a network service to configure DNS settings for.

#### Scenario: Load available services
- **WHEN** the DNS page loads
- **THEN** the system SHALL fetch and display all available network services

#### Scenario: Select a service
- **WHEN** user selects a network service from the dropdown
- **THEN** the system SHALL load and display the current DNS servers for that service

### Requirement: Display current DNS servers
The system SHALL display the list of currently configured DNS servers for the selected network service.

#### Scenario: Show empty state
- **WHEN** the selected service has no custom DNS servers configured
- **THEN** the system SHALL display an empty state or "Using default DNS" message

#### Scenario: Show DNS list
- **WHEN** the selected service has DNS servers configured
- **THEN** the system SHALL display each DNS server address in a list

### Requirement: Add DNS server
The system SHALL allow users to add a new DNS server to the selected network service.

#### Scenario: Add valid DNS server
- **WHEN** user enters a valid IP address (IPv4 or IPv6) in the input field
- **AND** clicks the "Add" button
- **THEN** the system SHALL add the DNS server to the list
- **AND** clear the input field

#### Scenario: Reject invalid DNS address
- **WHEN** user enters an invalid IP address
- **AND** clicks the "Add" button
- **THEN** the system SHALL display an error message
- **AND** not add the server to the list

#### Scenario: Prevent duplicate DNS server
- **WHEN** user tries to add a DNS server that already exists in the list
- **THEN** the system SHALL display a warning message
- **AND** not add the duplicate server

### Requirement: Remove DNS server
The system SHALL allow users to remove a DNS server from the list.

#### Scenario: Remove single DNS server
- **WHEN** user clicks the delete button next to a DNS server
- **THEN** the system SHALL remove that DNS server from the list

### Requirement: Save DNS configuration
The system SHALL save the DNS server list to the selected network service.

#### Scenario: Save changes
- **WHEN** user clicks the "Save" button
- **THEN** the system SHALL call the backend to set the DNS servers
- **AND** display a success message

#### Scenario: Save with empty list
- **WHEN** user removes all DNS servers and clicks "Save"
- **THEN** the system SHALL clear the DNS configuration for that service
- **AND** display a success message

#### Scenario: Handle save error
- **WHEN** the backend returns an error during save
- **THEN** the system SHALL display an error message
- **AND** keep the current list state for retry

### Requirement: Loading and feedback states
The system SHALL provide visual feedback during operations.

#### Scenario: Show loading state
- **WHEN** the system is fetching or saving data
- **THEN** the system SHALL display a loading indicator

#### Scenario: Show operation result
- **WHEN** an operation completes successfully or fails
- **THEN** the system SHALL display a notification with the result
