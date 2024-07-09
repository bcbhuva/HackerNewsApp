import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HackerNewsService } from './services/hacker-news.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Story } from './story.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLoading: boolean = false;
  displayedColumns: string[] = ['title', 'url'];
  dataSource = new MatTableDataSource<Story>;

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit(): void {
    this.loadStories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public loadStories(): void {
    this.isLoading = true;
    this.hackerNewsService.getNewestStories().subscribe(
      (data : Story[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      (err) => {
        alert(err);
        this.isLoading = false;
      }
    );
  }

  public search(filterValue: string): void {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource

    if (filterValue) {
      this.isLoading = true;
      this.dataSource.filter = filterValue;
      this.isLoading = false;
    } else {
      this.loadStories();
    }
  }
}

