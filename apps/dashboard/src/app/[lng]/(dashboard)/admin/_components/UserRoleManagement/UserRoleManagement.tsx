/* eslint-disable */
"use client"

import { useState } from "react"
import { Button } from "@package/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Badge } from "@package/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { AlertTriangle, Shield, User, Crown } from "lucide-react"
import { toast } from "@package/ui/toast"

import { api } from "@/lib/trpc/react"

type UserRoleManagementProps = {
  userId: string
  currentRole: "USER" | "ADMIN" | "SUPER_ADMIN"
  userEmail: string
}

const roleConfig = {
  USER: {
    label: "User",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: User,
    description: "Standard user with basic permissions",
  },
  ADMIN: {
    label: "Admin",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Shield,
    description: "Admin user with elevated permissions",
  },
  SUPER_ADMIN: {
    label: "Super Admin",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Crown,
    description: "Super admin with full system access",
  },
}

export function UserRoleManagement({
  userId,
  currentRole,
  userEmail,
}: UserRoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState<
    "USER" | "ADMIN" | "SUPER_ADMIN"
  >(currentRole)
  const [isUpdating, setIsUpdating] = useState(false)

  const utils = api.useUtils()
  const updateRoleMutation = api.admin.users.updateRole.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      })
      utils.admin.users.getById.invalidate({ userId })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      })
      setSelectedRole(currentRole) // Reset selection on error
    },
    onSettled: () => {
      setIsUpdating(false)
    },
  })

  const handleRoleUpdate = async () => {
    if (selectedRole === currentRole) {
      toast({
        title: "Info",
        description: "No role change selected",
      })
      return
    }

    setIsUpdating(true)
    updateRoleMutation.mutate({
      userId,
      role: selectedRole,
    })
  }

  const CurrentRoleIcon = roleConfig[currentRole].icon
  const SelectedRoleIcon = roleConfig[selectedRole].icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Role Display */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <CurrentRoleIcon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Current Role</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
          <Badge className={roleConfig[currentRole].color}>
            {roleConfig[currentRole].label}
          </Badge>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Change Role To:
          </label>
          <Select
            value={selectedRole}
            onValueChange={(value: "USER" | "ADMIN" | "SUPER_ADMIN") =>
              setSelectedRole(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleConfig).map(([role, config]) => (
                <SelectItem key={role} value={role}>
                  <div className="flex items-center gap-2">
                    <config.icon className="h-4 w-4" />
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRole !== currentRole && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <SelectedRoleIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  New Role: {roleConfig[selectedRole].label}
                </span>
              </div>
              <p className="text-xs text-blue-700">
                {roleConfig[selectedRole].description}
              </p>
            </div>
          )}
        </div>

        {/* Warning for Role Changes */}
        {selectedRole !== currentRole && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-medium mb-1">Role Change Warning</p>
              <p>
                Changing user roles will immediately affect their access
                permissions. Make sure this change is intended and authorized.
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleRoleUpdate}
          disabled={selectedRole === currentRole || isUpdating}
          className="w-full"
          variant={selectedRole !== currentRole ? "default" : "secondary"}
        >
          {isUpdating
            ? "Updating..."
            : selectedRole === currentRole
              ? "No Changes"
              : `Update to ${roleConfig[selectedRole].label}`}
        </Button>
      </CardContent>
    </Card>
  )
}
