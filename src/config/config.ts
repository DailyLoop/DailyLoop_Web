export const config = {
    api: {
        baseUrl: 'http://localhost:8080',
        // baseUrl: 'https://dailylooppy-backend-99775608725.us-central1.run.app',
        endpoints: {
            fetchNews: '/api/news/fetch',
            processNews: '/api/news/process',
            storyTracking: '/api/story_tracking'
        },
        // summarizedNewsPath: '../news-aggregator/data/summarized/summarized_news.json'  
        summarizedNewsPath: '/Users/rishabhshah/Desktop/newsfeast/news-aggregator-frontend/public/summarized_news.json'  
    }
};

export default config;