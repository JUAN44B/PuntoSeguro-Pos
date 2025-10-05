'use server';

/**
 * @fileOverview Generates a sales report for a specified time period, broken down by product category.
 *
 * - generateSalesReport - A function that generates the sales report.
 * - GenerateSalesReportInput - The input type for the generateSalesReport function.
 * - GenerateSalesReportOutput - The return type for the generateSalesReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesReportInputSchema = z.object({
  startDate: z.string().describe('The start date for the sales report (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the sales report (YYYY-MM-DD).'),
});

export type GenerateSalesReportInput = z.infer<typeof GenerateSalesReportInputSchema>;

const GenerateSalesReportOutputSchema = z.object({
  report: z.string().describe('A detailed sales report broken down by product category.'),
});

export type GenerateSalesReportOutput = z.infer<typeof GenerateSalesReportOutputSchema>;

export async function generateSalesReport(input: GenerateSalesReportInput): Promise<GenerateSalesReportOutput> {
  return generateSalesReportFlow(input);
}

const generateSalesReportPrompt = ai.definePrompt({
  name: 'generateSalesReportPrompt',
  input: {schema: GenerateSalesReportInputSchema},
  output: {schema: GenerateSalesReportOutputSchema},
  prompt: `You are an expert sales analyst. Generate a sales report for the period between {{startDate}} and {{endDate}}, broken down by product category. Include total sales, units sold, and any notable trends for each category. Format the report for easy readability by a business supervisor.`,
});

const generateSalesReportFlow = ai.defineFlow(
  {
    name: 'generateSalesReportFlow',
    inputSchema: GenerateSalesReportInputSchema,
    outputSchema: GenerateSalesReportOutputSchema,
  },
  async input => {
    const {output} = await generateSalesReportPrompt(input);
    return output!;
  }
);
