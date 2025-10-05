import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-semibold">Users & Roles</h1>
        <div className="ml-auto">
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add User
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Control user access and permissions for your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No Users Defined</h3>
            <p className="text-sm text-muted-foreground">
              Add users to manage roles and permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
