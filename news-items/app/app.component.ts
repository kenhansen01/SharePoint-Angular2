/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />

import {Component, Injectable, OnInit, NgZone, Directive, ElementRef, Renderer} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {NewsItems, NewsService, PageProps} from './news.service';

declare var jQuery: JQueryStatic;

@Component({
  selector: 'display-news',
  directives: [NgFor, ROUTER_DIRECTIVES],
  providers: [NewsService],
  bindings: [NewsService],
  template: `
    <div class="col-md-4" id="channel-filter">
      <div class="channels">
        <div *ngFor="#channel of channels" class="channel-item" [class.is-selected]="channel == currentChannel"  (click)="getNews(channel)">{{ channel }}</div>
      </div>
    </div>
    <div class="col-md-8" id="news-item-results">
      <div *ngFor="#newsItem of newsResults; #idx = index; #last = last;" class="news-item-container" (click)="showDetail(newsItem)" [class.last-result]="last">
        <div class="news-item-image">
          <div [innerHTML]="newsItem.imageUrl"></div>
          <div class="news-item-image-overlay"></div>
          <h2>{{newsItem.title}}</h2>
        </div>
        <div class="news-item-headline">
          <p>{{newsItem.bodySummary}}</p>
        </div>
      </div>
      <last-result></last-result>
    </div>
    <div class="news-item-detail modal fade" role="dialog" aria-labelledby="newsModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <div class="news-item-image">
              <div [innerHTML]="selectedItem.imageUrl"></div>
            </div>
            <div class="modal-news-content">
              <h1>{{selectedItem.title}}</h1>
              <div class="news-item-article" [innerHTML]="selectedItem.bodyText"></div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
})

export class AppComponent implements OnInit {

  newsResults: Array<NewsItems>;
  channels: Array<string>;
  pageProperties: PageProps;
  currentChannel: string;
  showDetailView: boolean;
  selectedItem: NewsItems;
  flag: boolean;

  constructor(private _newsService: NewsService, private _ngZone: NgZone) {
    this.newsResults = [];
    this.currentChannel = null;
    this.showDetailView = false;
    this.selectedItem = {
      id: null,
      title: '',
      bodyText: '',
      bodySummary: '',
      contentChannels: [],
      fieldValueUri: '',
      authorName: '',
      authorEmail: '',
      imageUrl: null
    };
    this.flag = false;
    let self = this; //jQuery hack
    jQuery('#s4-workspace').scroll(function (evt) {
      self.isScrolling(self);
    });
  }

  getNews(channel?: string) {
    let selectedChannel = channel == 'Home' ? null : channel;
    this.currentChannel = channel == null ? 'Home' : channel;
    this._newsService.getNewsHeadlines(this.pageProperties, selectedChannel).subscribe((newsResults) => {
      let parser = new DOMParser();
      this.newsResults = [];
      this.pageProperties.nextRequest = newsResults.__next;
      this._ngZone.run(() => { console.log('Got the news!') });
      for (let item of newsResults.results) {
        let newsItem = {
          id: item.Id,
          title: item.Title,
          bodyText: item.News_x0020_Body,
          bodySummary: parser.parseFromString(item.News_x0020_Body_x0020_, "text/html").documentElement.textContent.substring(0, 220),
          contentChannels: item.Content_x0020_Channels.results,
          fieldValueUri: item.FieldValuesAsHtml.__deferred.uri,
          authorName: item.Author.Title,
          authorEmail: item.Author.Email,
          imageUrl: null
        }
        this.newsResults.push(newsItem);
        this._newsService.getNewsImage(newsItem.fieldValueUri).subscribe((result) => {
          newsItem.imageUrl = result.News_x005f_x0020_x005f_Image;
          this._ngZone.run(() => { console.log('Got the image!') });
        });
      }
    });
  }

  showDetail(newsItem: NewsItems) {
    this.showDetailView = true;
    jQuery('.news-item-detail').modal();
    this.selectedItem = newsItem;    
  }

  onScrollLast() {
    if (this.flag) return;
    this.flag = true;
    this._newsService.getNextResults(this.pageProperties.nextRequest).subscribe((newsResults) => {
      let parser = new DOMParser();
      this.pageProperties.nextRequest = newsResults.__next;
      this._ngZone.run(() => { console.log('Got the news!') });
      for (let item of newsResults.results) {
        let newsItem = {
          id: item.Id,
          title: item.Title,
          bodyText: item.News_x0020_Body,
          bodySummary: parser.parseFromString(item.News_x0020_Body_x0020_, "text/html").documentElement.textContent.substring(0, 220),
          contentChannels: item.Content_x0020_Channels.results,
          fieldValueUri: item.FieldValuesAsHtml.__deferred.uri,
          authorName: item.Author.Title,
          authorEmail: item.Author.Email,
          imageUrl: null
        }
        this.newsResults.push(newsItem);
        this._newsService.getNewsImage(newsItem.fieldValueUri).subscribe((result) => {
          newsItem.imageUrl = result.News_x005f_x0020_x005f_Image;
          this._ngZone.run(() => { console.log('Got the image!') });
        });
      }
      this.flag = false;
    });
  }

  isScrolling(self:any) {
    let winHeight = jQuery(window).height();
    let elTop = jQuery('last-result').offset().top;
    if (elTop < winHeight * 1.15) {
      if (self.pageProperties.nextRequest != null)
        self.onScrollLast()
    }
  }


  ngOnInit() {
    
    this._newsService.getPageProperties().subscribe((res) => {
      this.pageProperties = {
        id: res.Id,
        siteUrl: res.Site_x0020_URL,
        listName: res.List_x0020_Name,
        uri: res.__metadata.uri,
        spType: res.__metadata.type,
        eTag: res.__metadata.etag,
        nextRequest: null
      }
      this._ngZone.run(() => { console.log('Got the Page Props!') });

      this.getNews();

      this._newsService.getFields(this.pageProperties, 'DBS Content Channels', 'Choices').subscribe((newsFields) => {
        this.channels = newsFields[0].Choices.results;
        this._ngZone.run(() => { console.log('Got the channels!') });
      });
    });
  }
}
