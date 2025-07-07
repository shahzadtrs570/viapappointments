import { useState } from "react"

export function usePropertiesTableActions() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  }
}
