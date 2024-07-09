import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {

  private apiBaseUrl = 'https://hackernews-api.azurewebsites.net/api/';//environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNewestStories(): Observable<any> {
    return this.http.get<any>(this.apiBaseUrl + 'stories');
  }
}