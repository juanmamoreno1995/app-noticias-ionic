import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  // se pone el static por si queremos utilizarlo en el ngOnInit y que no sea undefined
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

  public categories: string[] = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  public selectedCategory: string = this.categories[0];
  public articles: Article[] = [];

  constructor(private newService: NewsService) { }

  segmentChanged(e: Event) {
    this.selectedCategory = (e as CustomEvent).detail.value;
    this.newService.getTopHeadlinesByCategory(this.selectedCategory).subscribe(articles => {
      this.articles = [...articles];
    });

  }

  ngOnInit(): void {
    this.newService.getTopHeadlinesByCategory(this.selectedCategory).subscribe(articles => {
      console.log(articles);
      this.articles = [...articles];
    });
  }

  loadData() {
    this.newService.getTopHeadlinesByCategory(this.selectedCategory, true)
      .subscribe(articles => {

        if (articles.length === this.articles.length) {
          this.infiniteScroll.disabled = true;
          return;
        }

        this.articles = articles;
        this.infiniteScroll.complete();

      });
  }

}
