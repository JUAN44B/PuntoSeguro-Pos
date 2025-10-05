import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function PurchasesPage() {
  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-semibold">Purchases</h1>
        <div className="ml-auto">
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              New Purchase Order
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>
            Track and manage your purchase orders to suppliers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">No Purchase Orders Yet</h3>
            <p className="text-sm text-muted-foreground">
              Create a new purchase order to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
