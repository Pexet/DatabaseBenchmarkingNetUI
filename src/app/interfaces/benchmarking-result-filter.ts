export interface BenchmarkingResultFilter {
    database: string | undefined,
    runtime: string | undefined,
    methodName: string | undefined,
    framework: string | undefined,
    batch: number | undefined
}