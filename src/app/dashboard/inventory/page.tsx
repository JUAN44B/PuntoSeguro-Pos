import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { products } from "@/lib/data"
import { PlusCircle, File } from "lucide-react"

export default function InventoryPage() {
    const lowStockProducts = products.filter(p => p.stock <= 10);
    const bestSellingProducts = [...products].sort((a,b) => b.stock - a.stock).slice(0, 5);


  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Inventory</h1>
             <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export Report
                    </span>
                </Button>
                <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Adjustment
                    </span>
                </Button>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Total Stock Value</CardDescription>
                    <CardTitle className="text-4xl">$125,430</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                    Based on purchase price
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Items with Low Stock</CardDescription>
                    <CardTitle className="text-4xl">{lowStockProducts.length}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                    Items with 10 or fewer units
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Total Product Variants</CardDescription>
                    <CardTitle className="text-4xl">{products.length}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                    Across all categories
                    </div>
                </CardContent>
            </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Low Stock Products</CardTitle>
                <CardDescription>
                    These products need to be reordered soon.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lowStockProducts.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="destructive">{product.stock}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Best Selling Products</CardTitle>
                <CardDescription>
                    Your top performing products by units sold.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bestSellingProducts.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell className="text-right">{product.stock}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
