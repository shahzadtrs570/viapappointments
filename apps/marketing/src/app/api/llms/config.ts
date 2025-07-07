import config, {
  shouldCrawlUrl as rootShouldCrawlUrl,
} from "../../../../../../rain.config"

// Re-export the crawl rules and shouldCrawlUrl function
export const crawlRules = config.crawler.rules
export const shouldCrawlUrl = rootShouldCrawlUrl
