import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { HackerNewsService } from 'src/app/services/hacker-news.service';
import { HackerNewsComponent } from './hacker-news.component';
import { Story } from 'src/app/models/story.model';

describe('HackerNewsComponent', () => {
  let component: HackerNewsComponent;
  let fixture: ComponentFixture<HackerNewsComponent>;
  let mockHackerNewsService: jasmine.SpyObj<HackerNewsService>;
  let element: DebugElement;

  beforeEach(waitForAsync(() => {
    mockHackerNewsService = jasmine.createSpyObj('HackerNewsService', ['getNewestStories']);

    TestBed.configureTestingModule({
      declarations: [HackerNewsComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: HackerNewsService, useValue: mockHackerNewsService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HackerNewsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

   it('should load stories on initialization', waitForAsync(() => {
    const mockStories: Story[] = [
      { id: 1, title: 'Angular Story', url: 'http://story1.com', type:'story' },
      { id: 2, title: 'React Story', url: 'http://story2.com', type:'story' }
    ];
    mockHackerNewsService.getNewestStories.and.returnValue(of(mockStories));

    fixture.detectChanges(); // ngOnInit

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isLoading).toBeFalse();
      expect(component.dataSource.data).toEqual(mockStories);
    });
  }));

  it('should handle error while loading stories', waitForAsync(() => {
    mockHackerNewsService.getNewestStories.and.returnValue(throwError('Service error'));

    spyOn(window, 'alert');

    fixture.detectChanges(); // ngOnInit

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isLoading).toBeFalse();
      expect(window.alert).toHaveBeenCalledWith('Service error');
    });
  }));

  it('should filter stories based on search input', () => {
    const mockStories: Story[] = [
      { id: 1, title: 'Angular Story', url: 'http://story1.com', type:'story' },
      { id: 2, title: 'React Story', url: 'http://story2.com', type:'story' }
    ];
    mockHackerNewsService.getNewestStories.and.returnValue(of(mockStories));

    fixture.detectChanges(); // ngOnInit

    component.search('angular');
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].title).toContain('Angular Story');
  });

  it('should reset and reload stories when search input is cleared', () => {
    const mockStories: Story[] = [
      { id: 1, title: 'Angular Story', url: 'http://story1.com', type:'story' },
      { id: 2, title: 'React Story', url: 'http://story2.com', type:'story' }
    ];
    mockHackerNewsService.getNewestStories.and.returnValue(of(mockStories));

    fixture.detectChanges(); // ngOnInit

    component.search(''); // empty search
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(mockStories);
  });
});