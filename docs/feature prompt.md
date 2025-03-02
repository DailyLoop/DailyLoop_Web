# Information Gathering Template for Feature Implementation

To effectively implement features using AI tools like Windsurf or Cursor, gather this comprehensive information for each feature:

## 1. Feature Overview

- **Feature name** - Brief, descriptive name
- **One-line summary** - Concise description of what the feature does
- **User problem** - What user need does this solve?
- **Success metrics** - How will you measure if this feature is successful?

## 2. User Experience

- **User stories** - "As a [user], I want to [action] so that [benefit]"
- **User flow** - Step-by-step sequence of interactions
- **UI mockups** - Either references or rough descriptions
- **Edge cases** - How to handle errors or unusual scenarios

## 3. Technical Implementation

- **Data models** - Schema definitions, new fields or tables needed
- **API endpoints** - HTTP method, URL, request/response formats
- **Frontend components** - What components need to be created/modified
- **State management** - How state is stored, updated, and shared

## 4. Existing Code Context

- **Related files** - Key files that will be modified or are relevant
- **Integration points** - How this connects with existing features
- **Dependencies** - Libraries or services needed

## 5. Testing Approach

- **Unit test scenarios** - What needs to be tested at component level
- **Integration test scenarios** - How components work together
- **Edge cases to test** - Unusual or error scenarios

## Example for Story Tracking Feature

```markdown
# Story Tracking Feature Implementation

## Feature Overview
- **Name**: Story Tracking
- **Summary**: Allow users to follow news stories over time based on keywords
- **User problem**: Users want to stay updated on evolving news stories without manual searching
- **Success metrics**: User engagement with tracked stories, time spent on tracking pages

## User Experience
- **User story**: As a reader, I want to track interesting news stories so I can follow developments over time
- **User flow**:
  1. User reads an article
  2. User clicks "Track Story" button
  3. System confirms tracking has started
  4. User can view all tracked stories in dedicated section
  5. User receives updates when new related articles are found
  6. User can stop tracking when no longer interested

## Technical Implementation
- **Data models**:
  - TrackedStory: { id, userId, keyword, createdAt, lastUpdated }
  - TrackedStoryArticle: { storyId, articleId, addedAt }

- **API endpoints**:
  - POST /api/story-tracking (Create)
  - GET /api/story-tracking (List all for user)
  - GET /api/story-tracking/{id} (Get details)
  - DELETE /api/story-tracking/{id} (Remove)

- **Frontend components**:
  - StoryTrackingContext (State management)
  - TrackingButton (UI component)
  - TrackingListPage (Tracked stories overview)
  - StoryDetailPage (Individual story with related articles)

- **State management**:
  - Context API storing tracked stories
  - Local loading states for tracking actions

## Existing Code Context
- **Key files**:
  - StoryTrackingContext.tsx (needs backend integration)
  - ArticleView.tsx (already has tracking button UI)
  - routes.py (needs new API endpoints)
  - database/models.py (needs new models)

- **Integration points**:
  - Authentication system for user identification
  - Article search system for finding related articles

## Testing Approach
- **Unit tests**:
  - Context methods (startTracking, stopTracking)
  - API handlers (create, get, delete)

- **Integration tests**:
  - Full flow from clicking track button to seeing story in list
  - Background updates with new articles

- **Edge cases**:
  - Handling duplicate tracking attempts
  - Empty results for uncommon keywords
  - Performance with many tracked stories
```

When working with AI development tools, providing this structured information upfront helps the AI understand:

1. What you're trying to build (purpose and scope)
2. How it should work (user experience)
3. How it should be implemented (technical details)
4. How it connects to existing code (context)
5. How to verify it works (testing)

This approach dramatically improves the quality and relevance of AI-generated code, reducing iterations and helping you implement features more efficiently.