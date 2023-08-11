type Tool = {
  id: string
  name: string
  url: string
  aboutUrl?: string
  description: string
  toolkits: string[]
  tags: string[]
  needProject: boolean
}

export const tools: Tool[] = [
  {
    id: 'siteaudit',
    name: 'Site Audit',
    url: 'https://www.semrush.com/siteaudit/',
    aboutUrl: 'https://www.semrush.com/kb/31-site-audit',
    description:
      'Site Audit helps you to analyze your website’s health and fix any issues that are affecting its performance in search engines.',
    toolkits: ['SEO', 'Technical SEO'],
    tags: ['SEO', 'Technical SEO'],
    needProject: true,
  },
  {
    id: 'positiontracking',
    name: 'Position Tracking',
    url: 'https://www.semrush.com/position-tracking/',
    aboutUrl: 'https://www.semrush.com/kb/32-position-tracking',
    description:
      'Position Tracking allows you to track your website’s ranking for target keywords in the Google top 100 organic and paid results.',
    toolkits: ['SEO', 'Rank Tracking'],
    tags: ['SEO', 'Rank Tracking'],
    needProject: true,
  },
  {
    id: 'opsc',
    name: 'On Page SEO Checker',
    url: 'https://www.semrush.com/on-page-seo-checker/',
    aboutUrl: 'https://www.semrush.com/kb/292-seo-ideas',
    description:
      'On Page SEO Checker is a tool that helps you to make your website pages better optimized for search engines.',
    toolkits: ['SEO', 'Content Marketing'],
    tags: ['SEO', 'Content Marketing'],
    needProject: true,
  },
  {
    id: 'domainoverview',
    name: 'Domain Overview',
    url: 'https://www.semrush.com/analytics/overview/',
    aboutUrl: 'https://www.semrush.com/kb/254-domain-overview',
    description:
      'Domain Overview is a report that provides general information about a domain’s backlinks, organic and paid search, and display advertising.',
    toolkits: ['SEO', 'Competitive Research'],
    tags: ['SEO', 'Competitive Research'],
    needProject: false,
  },
  // Unchecked
  {
    id: 'organicresearch',
    name: 'Organic Research',
    url: 'https://www.semrush.com/analytics/organic/',
    aboutUrl: 'https://www.semrush.com/kb/20-organic-research',
    description:
      'Organic Research is a report that provides you with insights into your competitors’ organic content strategy.',
    toolkits: ['SEO', 'Competitive Research'],
    tags: ['SEO', 'Competitive Research'],
    needProject: false,
  },
  {
    id: 'backlinkanalytics',
    name: 'Backlink Analytics',
    url: 'https://www.semrush.com/analytics/backlinks/',
    aboutUrl: 'https://www.semrush.com/kb/22-backlinks',
    description:
      'Backlink Analytics is a report that provides you with insights into your backlink profile and helps you to identify toxic links.',
    toolkits: ['SEO', 'Link Building'],
    tags: ['SEO', 'Link Building'],
    needProject: false,
  },
  {
    id: 'keywordresearch',
    name: 'Keyword Research',
    url: 'https://www.semrush.com/keyword-research/',
    aboutUrl: 'https://www.semrush.com/kb/17-keyword-research',
    description:
      'Keyword Research helps you to find the right keywords for your website and to analyze the competition for those keywords.',
    toolkits: ['SEO', 'Keyword Research'],
    tags: ['SEO', 'Keyword Research'],
    needProject: false,
  },
  {
    id: 'advertisingresearch',
    name: 'Advertising Research',
    url: 'https://www.semrush.com/analytics/advertising/',
    aboutUrl: 'https://www.semrush.com/kb/21-advertising-research',
    description:
      'Advertising Research is a report that provides you with insights into your competitors’ advertising strategies.',
    toolkits: ['Advertising', 'Competitive Research'],
    tags: ['Advertising', 'Competitive Research'],
    needProject: false,
  },
  {
    id: 'marketexplorer',
    name: 'Market Explorer',
    url: 'https://www.semrush.com/market-explorer/',
    aboutUrl: 'https://www.semrush.com/kb/33-market-explorer',
    description:
      'Market Explorer helps you to analyze your market and to find new opportunities for growth.',
    toolkits: ['Marketing', 'Competitive Research'],
    tags: ['Marketing', 'Competitive Research'],
    needProject: false,
  },
]
