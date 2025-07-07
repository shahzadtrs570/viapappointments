import { loader } from "fumadocs-core/source"
import { createMDXSource, defaultSchemas } from "fumadocs-mdx"
import { z } from "zod"

import type { InferMetaType, InferPageType } from "fumadocs-core/source"

import { map } from "~/.map"

const frontmatterDocs = defaultSchemas.frontmatter.extend({
  updatedAt: z.string().optional(),
})

const frontmatterBlog = defaultSchemas.frontmatter.extend({
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  coverImage: z.string(),
  authorName: z.string(),
  keywords: z.array(z.string()),
  published: z.boolean(),
})

const frontmatterLegal = defaultSchemas.frontmatter.extend({
  updatedAt: z.string(),
  published: z.boolean(),
})

export const docs = loader({
  baseUrl: "/docs",
  rootDir: "docs",
  source: createMDXSource(map, {
    schema: { frontmatter: frontmatterDocs },
  }),
})

export const blog = loader({
  baseUrl: "/blog",
  rootDir: "blog",
  source: createMDXSource(map, {
    schema: { frontmatter: frontmatterBlog },
  }),
})

export const legal = loader({
  baseUrl: "/legal",
  rootDir: "legal",
  source: createMDXSource(map, {
    schema: { frontmatter: frontmatterLegal },
  }),
})

export type BlogPage = InferPageType<typeof blog>
export type BlogMeta = InferMetaType<typeof blog>

export type LegalPage = InferPageType<typeof legal>
export type LegalMeta = InferMetaType<typeof legal>
