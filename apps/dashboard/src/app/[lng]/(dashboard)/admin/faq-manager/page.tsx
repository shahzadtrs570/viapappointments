import { authOptions } from "@package/auth"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { FAQManagerComponent } from "./_components/FAQManagerComponent"

export default async function FAQManagerPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">FAQ Manager</h1>
      <FAQManagerComponent />
    </div>
  )
}
