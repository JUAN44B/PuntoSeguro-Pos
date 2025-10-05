import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground">
                Manage your store settings and preferences.
            </p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Update your business name, address, and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Settings form will be here.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Users & Roles</CardTitle>
          <CardDescription>
            Manage who can access your store and what they can do.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">User management table will be here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
