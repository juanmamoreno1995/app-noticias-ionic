import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewsResponse, Article, ArticlesByCategoryAndPage } from '../interfaces';
import { map } from 'rxjs/operators';

import { storedArticlesByCategory } from '../data/mock-news';


const apiKey = environment.apikey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {


  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = storedArticlesByCategory;

  constructor(private http: HttpClient) { }


  private executeQuery<T>(endpoint: string) {
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apiKey,
        country: 'us'
      }
    });
  }



  // eslint-disable-next-line @typescript-eslint/member-ordering
  getTopHeadlines(): Observable<Article[]> {
    return this.getTopHeadlinesByCategory('business');

    // return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
    //   .pipe(
    //     map(({ articles }) => articles)
    //   );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getTopHeadlinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]> {

    return of(this.articlesByCategoryAndPage[category].articles);


    // Esto se usaría sin el mocks

    // if (loadMore) {
    //   return this.getArticlesByCategory(category);
    // }

    // if (this.articlesByCategoryAndPage[category]) {
    //   return of(this.articlesByCategoryAndPage[category].articles);
    // }

    // return this.getArticlesByCategory(category);

  }


  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (!Object.keys(this.articlesByCategoryAndPage).includes(category)) {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      };
    }
    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
      .pipe(
        map(({ articles }) => {

          if (articles.length === 0) {
            return this.articlesByCategoryAndPage[category].articles;
          }



          this.articlesByCategoryAndPage[category] = {
            page,
            articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]
          };
          return this.articlesByCategoryAndPage[category].articles;
        })
      );
  }
}
