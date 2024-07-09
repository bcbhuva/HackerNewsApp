import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackerNewsService } from './hacker-news.service';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService]
    });

    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch newest stories', () => {
    const dummyStories = [
      { id: 1, title: 'Story 1', url: 'https://example.com/story1', type:'story' },
      { id: 2, title: 'Story 2', url: 'https://example.com/story2', type:'story'}
    ];

    service.getNewestStories().subscribe(stories => {
      expect(stories.length).toBe(2);
      expect(stories).toEqual(dummyStories);
    });

    const req = httpMock.expectOne(service['apiBaseUrl'] + 'stories');
    expect(req.request.method).toBe('GET');
    req.flush(dummyStories);
  });
});
