## ADDED Requirements

### Requirement: Flush DNS cache
The system SHALL provide a function to flush the system's DNS cache.

#### Scenario: Successful cache flush
- **WHEN** user clicks the "Refresh DNS Cache" button
- **THEN** the system SHALL call the backend flush_dns_cache command
- **AND** display a success notification

#### Scenario: Handle flush error
- **WHEN** the backend returns an error during cache flush
- **THEN** the system SHALL display an error notification with the error details

#### Scenario: Show flush in progress
- **WHEN** the cache flush operation is in progress
- **THEN** the system SHALL disable the button
- **AND** display a loading indicator
