// src/services/bookmarkService.ts
import config from "../config/config";

const API_BASE_URL = config.api.baseUrl;

export async function addBookmark(userId: string, newsId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/bookmarks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ news_id: newsId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add bookmark");
  }
  return response.json();
}

export async function removeBookmark(bookmarkId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/bookmarks/${bookmarkId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to remove bookmark");
  }
  return response.json();
}

export async function listBookmarks(userId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/bookmarks?user_id=${encodeURIComponent(userId)}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch bookmarks");
  }
  return response.json();
}