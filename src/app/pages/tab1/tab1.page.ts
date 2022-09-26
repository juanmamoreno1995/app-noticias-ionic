import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  public articles: Article[] = [];

  constructor(private newService: NewsService) { }

  ngOnInit(): void {
    this.newService.getTopHeadlines().subscribe(resp => {
      this.articles.push(...resp);
    });
  }

  loadData() {
    this.newService.getTopHeadlinesByCategory('business', true)
      .subscribe(articles => {
        console.log('Articles',articles);
        console.log('This Articles',this.articles);
        if (articles.length === this.articles.length) {
          this.infiniteScroll.disabled = true;
          return;
        }

        this.articles = articles;
        this.infiniteScroll.complete();

      });
  }
}
