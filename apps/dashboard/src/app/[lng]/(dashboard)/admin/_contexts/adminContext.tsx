"use client"

import { createContext, useContext, useState } from "react"

import { subtractDays } from "@package/utils"

import type { DateRange } from "@package/utils"
import type { PaginationState } from "@tanstack/react-table"

type AdminContextProviderProps = {
  children: React.ReactNode
}

type AdminContext = {
  dateRange: DateRange | undefined
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
}

const AdminContext = createContext<AdminContext | null>(null)

export function AdminContextProvider({ children }: AdminContextProviderProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subtractDays(7),
    to: new Date(),
  })

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  return (
    <AdminContext.Provider
      value={{ dateRange, setDateRange, pagination, setPagination }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdminContext() {
  const dateContext = useContext(AdminContext)

  if (!dateContext) {
    throw new Error(
      "useAdminContext should be used within a AdminContextProvider"
    )
  }

  return dateContext
}
