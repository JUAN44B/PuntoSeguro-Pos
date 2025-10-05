"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { generateSalesReport } from "@/ai/flows/generate-sales-report"
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const FormSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "A start date is required.",
    }),
    to: z.date({
      required_error: "An end date is required.",
    }),
  }),
})

export default function ReportGenerator() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [report, setReport] = React.useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    setReport(null)
    try {
      const result = await generateSalesReport({
        startDate: format(data.dateRange.from, "yyyy-MM-dd"),
        endDate: format(data.dateRange.to, "yyyy-MM-dd"),
      })
      setReport(result.report)
    } catch (error) {
      console.error("Failed to generate report:", error)
      toast({
        variant: "destructive",
        title: "Error Generating Report",
        description: "There was a problem generating the sales report. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Date range</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                                field.value.to ? (
                                <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                </>
                                ) : (
                                format(field.value.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value?.from}
                            selected={{ from: field.value?.from, to: field.value?.to}}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Report
                </Button>
            </form>
            </Form>
        </div>
        <div className="md:col-span-2">
            <Card className="min-h-[300px]">
                <CardHeader>
                    <CardTitle>Generated Report</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[300px]" />
                        </div>
                    )}
                    {report && (
                        <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                            {report}
                        </div>
                    )}
                    {!isLoading && !report && (
                        <p className="text-center text-muted-foreground pt-10">Your generated report will appear here.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
