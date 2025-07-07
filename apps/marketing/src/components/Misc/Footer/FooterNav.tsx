/* eslint-disable */
import { Typography } from "@package/ui/typography"
import Link from "next/link"

type FooterNavProps = {
  title: string
  links: { href: string; title: string }[]
}

export function FooterNav({ title, links }: FooterNavProps) {
  return (
    <div className="flex flex-col">
      <Typography
        className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100"
        variant="h3"
      >
        {title}
      </Typography>
      <div className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link 
            key={link.title} 
            href={link.href}
            className="group relative inline-block w-fit text-gray-600 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <Typography
              className="text-sm font-normal"
              variant="body"
            >
              {link.title}
            </Typography>
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full dark:bg-blue-400"></span>
          </Link>
        ))}
      </div>
    </div>
  )
}
