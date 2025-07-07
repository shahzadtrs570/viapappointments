import { DocsBody, DocsPage } from "fumadocs-ui/page"
import { notFound } from "next/navigation"

import type { Metadata } from "next"

import { legal } from "@/lib/fuma"

type PageParams = {
  lng: string
  slug: string[]
}

export function generateStaticParams(): Array<PageParams> {
  const pages = legal.getPages()
  const supportedLanguages = ["en", "fr", "it"]
  const staticParamsSet = new Set<string>()

  const resultParams: Array<PageParams> = []

  pages.forEach((page) => {
    const pageSlug = page.slugs[0]

    supportedLanguages.forEach((lang) => {
      let langSuffix = ""

      if (lang !== "en") {
        langSuffix = `-${lang}`
      }

      if (pageSlug.endsWith(langSuffix)) {
        const baseSlug = langSuffix
          ? pageSlug.slice(0, -langSuffix.length)
          : pageSlug

        const paramKey = `${lang}/${baseSlug}`
        if (!staticParamsSet.has(paramKey)) {
          resultParams.push({
            lng: lang,
            slug: [baseSlug],
          })
          staticParamsSet.add(paramKey)
        }
      }
    })
  })

  const baseSlugsFromFiles = new Set<string>()
  pages.forEach((page) => {
    let baseSlug = page.slugs[0]
    supportedLanguages.forEach((lang) => {
      if (baseSlug.endsWith(`-${lang}`)) {
        baseSlug = baseSlug.slice(0, -(lang.length + 1))
      }
    })
    baseSlugsFromFiles.add(baseSlug)
  })

  if (resultParams.length === 0 && baseSlugsFromFiles.size > 0) {
    supportedLanguages.forEach((lng) => {
      baseSlugsFromFiles.forEach((baseSlug) => {
        const paramKey = `${lng}/${baseSlug}`
        if (!staticParamsSet.has(paramKey)) {
          resultParams.push({ lng, slug: [baseSlug] })
          staticParamsSet.add(paramKey)
        }
      })
    })
  }

  return resultParams
}

export function generateMetadata({
  params,
}: {
  params: PageParams
}): Metadata | undefined {
  const { lng, slug } = params
  if (!lng) notFound()

  let pagePath = [...slug]
  if (lng !== "en" && pagePath.length > 0 && !pagePath[0].endsWith(`-${lng}`)) {
    pagePath = [pagePath[0] + `-${lng}`]
  }

  const page = legal.getPage(pagePath)
  if (page == null || !page.data.published) {
    notFound()
  }

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default function LegalPage({ params }: { params: PageParams }) {
  const { lng, slug } = params

  let pagePath = [...slug]
  if (lng !== "en" && pagePath.length > 0 && !pagePath[0].endsWith(`-${lng}`)) {
    pagePath = [pagePath[0] + `-${lng}`]
  }

  const page = legal.getPage(pagePath)

  if (page == null || !page.data.published) {
    notFound()
  }

  const MDX = page.data.exports.default

  return (
    <DocsPage lastUpdate={page.data.updatedAt} toc={page.data.exports.toc}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
      </DocsBody>
    </DocsPage>
  )
}
