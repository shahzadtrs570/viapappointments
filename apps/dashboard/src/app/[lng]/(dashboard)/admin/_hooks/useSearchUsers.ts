import { useEffect, useMemo, useState } from "react"

import _ from "lodash"

import type { Option } from "@package/ui/autocomplete"

import { api } from "@/lib/trpc/react"

export function useSearchUsers() {
  const [selectedOption, setSelectedOption] = useState<Option>({
    label: "",
    value: "",
  })
  const [inputValue, setInputValue] = useState<string>("")

  const searchUsersQuery = api.admin.users.getByEmail.useQuery(
    { email: inputValue },
    { enabled: false, initialData: [] }
  )

  const userOptions = useMemo(
    () =>
      searchUsersQuery.data.map((option) => ({
        value: option.id,
        label: option.email,
      })),
    [searchUsersQuery.data]
  )

  const debouncedChangeHandler = useMemo(
    () => _.debounce(searchUsersQuery.refetch, 400),
    [searchUsersQuery.refetch]
  )

  useEffect(
    () => () => {
      debouncedChangeHandler.cancel()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return {
    userOptions,
    setInputValue,
    debouncedChangeHandler,
    searchUsersQuery,
    selectedOption,
    setSelectedOption,
  }
}
