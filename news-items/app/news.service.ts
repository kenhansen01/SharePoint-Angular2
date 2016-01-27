/// <reference path="../../scripts/typings/sharepoint/sharepoint.d.ts" />
import {Injectable, NgZone} from 'angular2/core';
import {Headers, RequestMethod} from 'angular2/http';
import {RequestService, RequestURL, SearchParams, SearchOptions} from 'request.service';
import 'rxjs/add/operator/map';

export interface PageProps {
  id: number;
  siteUrl: string;
  listName: string;
  uri: string;
  spType: string;
  eTag: string;
  nextRequest: string;
}

export interface NewsItems {
  id: number;
  title: string;
  bodyText: string;
  bodySummary: string;
  contentChannels: Array<string>;
  fieldValueUri: string;
  authorName?: string;
  authorEmail?: string;
  imageUrl?: string;
}


@Injectable()
export class NewsService {

  constructor(private _requestService: RequestService, private _ngZone: NgZone) { }

  getPageProperties() {
    let pagePropUrl = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists(guid'${_spPageContextInfo.pageListId.substring(1, _spPageContextInfo.pageListId.length - 1)}')/items(${_spPageContextInfo.pageItemId})`;
    return this._requestService.makeRequest(pagePropUrl).map((res) => { return res });
  }

  getFields(pageProps: PageProps, fieldName?: string, fieldProp?: string) {
    let listUrl = `${pageProps.siteUrl}/_api/web/lists/getbytitle('${pageProps.listName}')/fields`;
    let listSearch = new SearchParams({
      filter: fieldName != null ? `Title eq '${fieldName}'`: null,
      select: fieldProp
    }).searchParams;
    return this._requestService.makeRequest(listUrl, listSearch).map((res) => { return res.results });
  }

  getNewsHeadlines(pageProps: PageProps, channel?: string) {
    let newsUrl = `${pageProps.siteUrl}/_api/web/lists/getbytitle('${pageProps.listName}')/items`;
    let newsSearch = new SearchParams({
      top: '12',
      select: 'Id,Title,News_x0020_Body,Content_x0020_Channels,FieldValuesAsHtml,Author/EMail,Author/Title',
      orderby: 'Id desc',
      expand: 'Author',
      filter: channel != null ? `Content_x0020_Channels eq '${channel}'` : null
    }).searchParams;

    return this._requestService.makeRequest(newsUrl, newsSearch).map((res) => { return res });
  }

  getNextResults(nextUrl: string) {
    return this._requestService.makeRequest(nextUrl).map((res) => { return res });
  }

  getNewsImage(itemUrl: string) {
    let newsImageUrl = `${itemUrl}`;
    return this._requestService.makeRequest(newsImageUrl).map((res) => { return res });
  }

}