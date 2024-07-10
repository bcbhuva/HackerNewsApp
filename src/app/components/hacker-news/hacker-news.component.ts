import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Story } from 'src/app/models/story.model';
import { HackerNewsService } from 'src/app/services/hacker-news.service';

@Component({
  selector: 'app-hacker-news',
  templateUrl: './hacker-news.component.html',
  styleUrls: ['./hacker-news.component.scss']
})
export class HackerNewsComponent implements AfterViewInit, OnInit {

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
      if(this.dataSource)
      {
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.dataSource.paginator = this.paginator;
      }
      else
      this.loadStories();
    }
  }
}

