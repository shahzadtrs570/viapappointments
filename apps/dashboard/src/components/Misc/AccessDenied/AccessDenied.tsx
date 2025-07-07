import { Typography } from "@package/ui/typography"

export function AccessDenied() {
  return (
    <section>
      <Typography variant="h1">Access Denied</Typography>
      <Typography variant="body">
        You don&apos;t have the necessary permissions to access this page.
      </Typography>
    </section>
  )
}
