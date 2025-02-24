export const config = {
    api: {
        baseUrl: 'http://localhost:5001',
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