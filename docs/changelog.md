# Changelog

## [Unreleased]

### Added
- Session-based news search functionality
  - Session management implementation
  - Search history tracking
  - Session persistence
- Enhanced news display features
  - Responsive article layout
  - Image optimization
  - Article preview functionality
- Real-time updates system
  - WebSocket integration
  - Push notifications
  - Live search suggestions

## [0.1.0] - 2024-01-09

### Added
- Initial project setup
- Basic documentation structure
- Feature specifications document
- Technical architecture document

### Changed
- Reorganized documentation into separate files for better maintainability

### Technical
- Set up development environment
- Configured build tools and dependencies
- Established project structure


# Add the mechanism to add this poll thing to database instead of UI, like the backend itself should keep polling regardless of the UI tracker being open. right now i think the polling stops if i go away from the tracker pages


# directly entering http://localhost:5173/story-tracking/air%20sector%20demand created a new tracker with this keyword, stop that


# stories tracked after polling is not getting added in the supabase table