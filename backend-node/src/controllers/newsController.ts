import { Request, Response } from 'express';
import Parser from 'rss-parser';

const parser = new Parser();

const RSS_FEEDS = [
    'https://finance.yahoo.com/news/rssindex',
    'http://feeds.marketwatch.com/marketwatch/topstories/',
];

// @desc    Get latest financial news from RSS feeds
// @route   GET /api/news
// @access  Public
export const getLatestNews = async (req: Request, res: Response) => {
    try {
        const feedPromises = RSS_FEEDS.map(url => parser.parseURL(url));
        const feeds = await Promise.all(feedPromises);

        let allItems: any[] = [];

        feeds.forEach(feed => {
            if (feed.items) {
                // Add source info to each item
                const sourceTitle = feed.title || 'Unknown Source';
                const itemsWithSource = feed.items.map(item => ({
                    ...item,
                    source: sourceTitle.includes('Yahoo') ? 'Yahoo Finance' :
                        sourceTitle.includes('MarketWatch') ? 'MarketWatch' : sourceTitle
                }));
                allItems = [...allItems, ...itemsWithSource];
            }
        });

        // Sort by pubDate descending
        allItems.sort((a, b) => {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });

        // Limit to 20 items
        const latestNews = allItems.slice(0, 20).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            contentSnippet: item.contentSnippet,
            source: item.source,
            guid: item.guid || item.link
        }));

        res.json(latestNews);
    } catch (error: any) {
        console.error('RSS Feed Error:', error);
        res.status(500).json({ message: 'Failed to fetch news feed' });
    }
};
