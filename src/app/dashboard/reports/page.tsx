import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ReportGenerator from "./components/report-generator"

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Sales Reports</h1>
        <p className="text-muted-foreground">
            Generate and view detailed sales reports.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Report Generator</CardTitle>
          <CardDescription>
            Select a date range to generate an intelligent sales report broken down by category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportGenerator />
        </CardContent>
      </Card>
    </div>
  )
}
