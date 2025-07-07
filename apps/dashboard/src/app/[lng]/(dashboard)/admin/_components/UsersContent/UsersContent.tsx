"use client"

import { Autocomplete } from "@package/ui/autocomplete"
import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"
import Link from "next/link"

import type { PaginatedUsers } from "../../_types"

import { useSearchUsers } from "../../_hooks/useSearchUsers"
import { UsersTable } from "../UsersTable/UsersTable"

type UsersContentProps = {
  initialPaginatedUsersData: PaginatedUsers
}

export function UsersContent({ initialPaginatedUsersData }: UsersContentProps) {
  const {
    selectedOption,
    setSelectedOption,
    setInputValue,
    debouncedChangeHandler,
    userOptions,
    searchUsersQuery,
  } = useSearchUsers()

  return (
    <section className="flex flex-col gap-8">
      <Typography variant="h1">User Management</Typography>
      <section className="flex items-center gap-2">
        <Autocomplete
          emptyCommandMessage="No users found."
          inputPlaceholder="Search users..."
          isLoading={searchUsersQuery.isFetching}
          options={userOptions}
          searchPlaceholder="Search users..."
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onInputChange={async (searchQuery) => {
            setInputValue(searchQuery)
            if (searchQuery.length > 0) {
              await debouncedChangeHandler()
            }
          }}
        />
        <Button asChild>
          <Link href={`/admin/users/${selectedOption.value}`}>View user</Link>
        </Button>
      </section>
      <UsersTable initialPaginatedUsersData={initialPaginatedUsersData} />
    </section>
  )
}
