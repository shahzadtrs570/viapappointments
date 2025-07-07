/*eslint-disable react/jsx-sort-props*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/order*/
/*eslint-disable sort-imports*/

"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@package/ui/card"
import { Switch } from "@package/ui/switch"
import { Button } from "@package/ui/button"
import { Label } from "@package/ui/label"
import { Separator } from "@package/ui/separator"
import { Save } from "lucide-react"

interface NotificationSettings {
  email: {
    newMatches: boolean
    offerUpdates: boolean
    contractSignatures: boolean
    marketingUpdates: boolean
  }
  push: {
    newMatches: boolean
    offerUpdates: boolean
    contractSignatures: boolean
    marketingUpdates: boolean
  }
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  deviceHistory: boolean
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      newMatches: true,
      offerUpdates: true,
      contractSignatures: true,
      marketingUpdates: false,
    },
    push: {
      newMatches: true,
      offerUpdates: true,
      contractSignatures: true,
      marketingUpdates: false,
    },
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    loginNotifications: true,
    deviceHistory: true,
  })

  const handleNotificationChange = (
    type: "email" | "push",
    setting: keyof NotificationSettings["email"],
    checked: boolean
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: checked,
      },
    }))
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and notifications
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              {`Choose which emails you'd like to receive`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Property Matches</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails when new properties match your buy boxes
                </p>
              </div>
              <Switch
                checked={notifications.email.newMatches}
                onCheckedChange={(checked) =>
                  handleNotificationChange("email", "newMatches", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Offer Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about changes to your offers
                </p>
              </div>
              <Switch
                checked={notifications.email.offerUpdates}
                onCheckedChange={(checked) =>
                  handleNotificationChange("email", "offerUpdates", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Contract Signatures</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications about contract signing status
                </p>
              </div>
              <Switch
                checked={notifications.email.contractSignatures}
                onCheckedChange={(checked) =>
                  handleNotificationChange(
                    "email",
                    "contractSignatures",
                    checked
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>
              Configure your mobile and desktop notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Property Matches</Label>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications for new matching properties
                </p>
              </div>
              <Switch
                checked={notifications.push.newMatches}
                onCheckedChange={(checked) =>
                  handleNotificationChange("push", "newMatches", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Offer Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Real-time notifications about offer status changes
                </p>
              </div>
              <Switch
                checked={notifications.push.offerUpdates}
                onCheckedChange={(checked) =>
                  handleNotificationChange("push", "offerUpdates", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Contract Signatures</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when contracts are signed
                </p>
              </div>
              <Switch
                checked={notifications.push.contractSignatures}
                onCheckedChange={(checked) =>
                  handleNotificationChange(
                    "push",
                    "contractSignatures",
                    checked
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={security.twoFactorEnabled}
                onCheckedChange={(checked) =>
                  setSecurity((prev) => ({
                    ...prev,
                    twoFactorEnabled: checked,
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of new sign-ins to your account
                </p>
              </div>
              <Switch
                checked={security.loginNotifications}
                onCheckedChange={(checked) =>
                  setSecurity((prev) => ({
                    ...prev,
                    loginNotifications: checked,
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Device History</Label>
                <p className="text-sm text-muted-foreground">
                  Keep track of devices used to access your account
                </p>
              </div>
              <Switch
                checked={security.deviceHistory}
                onCheckedChange={(checked) =>
                  setSecurity((prev) => ({ ...prev, deviceHistory: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg">
            <Save className="mr-2 size-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
