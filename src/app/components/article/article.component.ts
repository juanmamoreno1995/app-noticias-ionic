import { Component, Input } from '@angular/core';
import { Article } from '../../interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article: Article;
  @Input() index: number;

  constructor(private iab: InAppBrowser, private platform: Platform, private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing, private storageServie: StorageService) { }

  openArticle() {

    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }

    window.open(this.article.url, '_blank');

  }

  async onOpenMenu() {

    const articleInFavorite: boolean = this.storageServie.articleInFavorite(this.article);

    const normalBtns: ActionSheetButton[] = [
      {
        text: articleInFavorite ? 'Remover Favorito' : 'Favorito',
        icon: articleInFavorite ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'Cancelar',
        cssClass: 'secondary'
      }
    ];

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };

    if (this.platform.is('capacitor')) {
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns
    });

    await actionSheet.present();
  }

  onShareArticle() {
    const { title, source, url } = this.article;
    this.socialSharing.share(
      title,
      source.name,
      null,
      url
    );
  }

  onToggleFavorite() {
    this.storageServie.saveRemoveArticle(this.article);
  }

}
