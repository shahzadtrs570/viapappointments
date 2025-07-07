import { featureFlags } from "@package/utils"
import { createSearchAPI } from "fumadocs-core/search/server"

import { blog, docs } from "@/lib/fuma"

const publishedBlogs = blog.getPages().filter((page) => page.data.published)
const documentationPages = docs.getPages()

const docsAndBlogs = [
  ...(featureFlags.docs ? documentationPages : []),
  ...(featureFlags.blog ? publishedBlogs : []),
]

export const { GET } = createSearchAPI("advanced", {
  indexes: docsAndBlogs.map((page) => ({
    title: page.data.title,
    structuredData: page.data.exports.structuredData,
    id: page.url,
    url: page.url,
  })),
})
