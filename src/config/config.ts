export const config = {
    api: {
        baseUrl: 'http://localhost:5001',
        endpoints: {
            fetchNews: '/api/news/fetch',
            processNews: '/api/news/process'
        }
    }
};

export default config;