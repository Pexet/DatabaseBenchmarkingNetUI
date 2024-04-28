export interface BenchmarkingResultDto {
    database: string,
    runtime: string,
    methodName: string,
    operationsSec: number,
    framework: string,
    batch: number
}