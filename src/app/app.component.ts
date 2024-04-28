import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BenchmarkingResultDto } from './dtos/benchmarking-result-dto';
import { BenchmarkingResultFilter } from './interfaces/benchmarking-result-filter';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "./header/header.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, MatTableModule, HttpClientModule, MatSortModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, HeaderComponent]
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MatSort) _sort: MatSort | undefined;

  private _benchmarkingResultFilter: BenchmarkingResultFilter = {
    runtime: undefined,
    database: undefined,
    framework: undefined,
    methodName: undefined,
    batch: undefined
  };

  public title: string = 'database-benchmarking-ui';
  public displayedColumns: string[] = ['database', 'runtime', 'methodName', 'operationsSec', 'framework', 'batch'];
  public dataSource: MatTableDataSource<BenchmarkingResultDto> = new MatTableDataSource<BenchmarkingResultDto>(
    []
  );

  public runtimes: string[] = [];
  public databases: string[] = [];
  public frameworks: string[] = [];
  public methods: string[] = [];
  public batches: number[] = [];

  constructor(http: HttpClient) {
    http
    .get<Array<BenchmarkingResultDto>>("http://localhost:5297/BenchmarkingResults")
    .subscribe({
      next: (result) => {
        this.dataSource = new MatTableDataSource<BenchmarkingResultDto>(
          result
        );

        this.runtimes = [...new Set(result.map(item => item.runtime))];
        this.databases = [...new Set(result.map(item => item.database))];
        this.frameworks = [...new Set(result.map(item => item.framework))];
        this.methods = [...new Set(result.map(item => item.methodName))];
        this.batches = [...new Set(result.map(item => item.batch))];

        this.dataSource.sort = this._sort!;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this._sort!;
  }

  public onRuntimeSelectionChanged(value: string | undefined) {
    this._benchmarkingResultFilter.runtime = value;
    this._emitFilters();
  }

  public onDatabaseSelectionChanged(value: string | undefined) {
    this._benchmarkingResultFilter.database = value;
    this._emitFilters();
  }

  public onFrameworkSelectionChanged(value: string | undefined) {
    this._benchmarkingResultFilter.framework = value;
    this._emitFilters();
  }

  public onMethodSelectionChanged(value: string | undefined) {
    this._benchmarkingResultFilter.methodName = value;
    this._emitFilters();
  }

  public onBatchSelectionChanged(value: number | undefined) {
    this._benchmarkingResultFilter.batch = value;
    this._emitFilters();
  }

  private _emitFilters() {
    this.dataSource.filterPredicate = this._filterBenchmarkingResultData;
    this.dataSource.filter = JSON.stringify(this._benchmarkingResultFilter);
  }

  private _filterBenchmarkingResultData(data: BenchmarkingResultDto, filterObjectJSON: string): boolean {
    let filterObject: BenchmarkingResultFilter = JSON.parse(filterObjectJSON);

    return (filterObject.batch === undefined || data.batch == filterObject.batch) &&
           (filterObject.database === undefined || data.database == filterObject.database) &&
           (filterObject.runtime === undefined || data.runtime == filterObject.runtime) &&
           (filterObject.framework === undefined || data.framework == filterObject.framework) &&
           (filterObject.methodName === undefined || data.methodName == filterObject.methodName);
  }
}
