// src/utils/api.ts

export async function fetchSummary(articleText: string) {
    // Use the backend URL from the environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseUrl}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article_text: articleText }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch summary');
    }
  
    return response.json();
  }