/* eslint-disable */

declare module "npm-audit-report" {
  interface ReportOptions {
    reporter: "detail" | "json" | "parseable"
    withColor?: boolean
    withUnicode?: boolean
  }

  interface ReportResult {
    report: string
    exitCode: number
  }

  export function createReport(
    data: any,
    options: ReportOptions
  ): Promise<ReportResult>
}
