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
        <h1 className="text-2xl font-semibold">Reportes de Ventas</h1>
        <p className="text-muted-foreground">
            Genera y visualiza reportes de ventas detallados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generador de Reportes con IA</CardTitle>
          <CardDescription>
            Selecciona un rango de fechas para generar un reporte de ventas inteligente desglosado por categoría.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportGenerator />
        </CardContent>
      </Card>
    </div>
  )
}
