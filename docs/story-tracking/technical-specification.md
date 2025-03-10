# Story Tracking Feature - Technical Specification

## Overview
The Story Tracking feature allows users to follow news stories over time based on keywords. This document outlines the current implementation status and what remains to be implemented.

## Current Implementation Status

### Frontend Components
- ✅ `StoryTrackingContext.tsx`: Basic context for managing tracked stories in memory
- ✅ `StoryTrackingPage.tsx`: Page for displaying tracked stories for a specific keyword
- ✅ `StoryTrackingTabContext.tsx`: Component for displaying articles related to a tracked keyword
- ✅ `StoryTrackingTabs.tsx`: Component for displaying tabs of tracked stories

### Backend Components
- ✅ API Gateway endpoints for story tracking (`/api/story-tracking`)
- ✅ Basic story tracking service implementation in `story_tracking_service.py`
- ✅ Database models for tracked stories and tracked story articles

### Integration
- ✅ Frontend polling mechanism to fetch new articles for tracked keywords
- ✅ Backend integration with the frontend context
- ✅ User authentication integration for tracking stories per user

## Data Models

### Tracked Story
```typescript
interface TrackedStory {
  id: string;
  user_id: string;
  keyword: string;
  created_at: string;
  last_updated: string;
  articles: Article[];
}
```

### Article
```typescript
interface Article {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
}
```

## API Endpoints

### Create Tracked Story
```
POST /api/story_tracking
Request: { keyword: string, sourceArticleId?: string }
Response: { status: string, data: TrackedStory }
```

### Get Tracked Stories
```
GET /api/story_tracking
Response: { status: string, data: TrackedStory[] }
```

### Get Tracked Story Details
```
GET /api/story_tracking/{id}
Response: { status: string, data: TrackedStory }
```

### Delete Tracked Story
```
DELETE /api/story_tracking/{id}
Response: { status: string, message: string }
```

## Implementation Gaps

### Frontend
1. ✅ Update `StoryTrackingContext.tsx` to persist tracked stories to the backend
2. ✅ Add authentication integration to associate tracked stories with users
3. Implement error handling for API calls
4. Add loading states for API interactions

### Backend
1. Complete the implementation of `find_related_articles()` function in `story_tracking_service.py`
2. Implement background service to periodically update tracked stories with new articles
3. Add clustering algorithm to group related articles within a tracked story

## Testing Plan

### Unit Tests
- Test `StoryTrackingContext` methods (startTracking, stopTracking, addArticlesToStory)
- Test API handlers (create, get, delete)

### Integration Tests
- Test full flow from clicking track button to seeing story in list
- Test background updates with new articles

### Edge Cases
- Handle duplicate tracking attempts
- Handle empty results for uncommon keywords
- Test performance with many tracked stories

## Next Steps
1. ✅ Complete the backend integration with the frontend context
2. ✅ Implement user authentication integration
3. Complete the background service for updating tracked stories
4. Add clustering algorithm for grouping related articles
5. Add comprehensive error handling and loading states