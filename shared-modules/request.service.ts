import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from 'angular2/http';
import 'rxjs/add/operator/map';

export class RequestURL {
  fullURL: string;
  siteUrl = _spPageContextInfo.siteAbsoluteUrl;
  webUrl = _spPageContextInfo.webAbsoluteUrl;
  getLibraryItemsByUrlStart = '/_api/web/GetFolderByServerRelativeUrl(\'';
  getLibraryItemsByUrlEnd = '\')/files';
  getListItemsByNameStart = '/_api/lists/getbytitle(\'';
  getListItemsByNameEnd = '\')/';
  constructor(
    spUrlListParam: string,    
    isCollectionRequest: boolean,
    isLibraryRequest: boolean,
    isPost: boolean
  ) {
    let baseURL = isCollectionRequest ? this.siteUrl : this.webUrl,
      apiStart = this.getListItemsByNameStart,
      apiEnd = isPost ? this.getListItemsByNameEnd + 'getitems' : this.getListItemsByNameEnd + 'items';
    if (isLibraryRequest) {
      apiStart = this.getLibraryItemsByUrlStart;
      apiEnd = this.getLibraryItemsByUrlEnd;
    }
    
    this.fullURL = [baseURL, apiStart, spUrlListParam, apiEnd].join('')
  }
}

export interface SearchOptions {
  select?: string;
  orderby?: string;
  expand?: string;
  filter?: string;
  top?: string;
}

export class SearchParams {
  searchParams: URLSearchParams;
  constructor(searchOptions: SearchOptions = {
    select: null,
    orderby: null,
    expand: null,
    filter: null,
    top: null
  }) {
    let search = new URLSearchParams();
    if (searchOptions.select)
      search.set('$select', searchOptions.select)
    if (searchOptions.orderby)
      search.set('$orderby', searchOptions.orderby)
    if (searchOptions.expand)
      search.set('$expand', searchOptions.expand)
    if (searchOptions.filter)
      search.set('$filter', searchOptions.filter)
    if (searchOptions.top)
      search.set('$top', searchOptions.top)
    this.searchParams = search;
  }
}

@Injectable()
export class RequestService {

  constructor(private _http: Http) { }

  makeRequest(
    reqURL: string,
    search: URLSearchParams = null,
    body: string = null,
    method: RequestMethod = RequestMethod.Get,
    headers: Headers = new Headers({ accept: 'application/json; odata=verbose', 'content-type': 'application/json; odata=verbose' })
  ) {
    let reqOptions = new RequestOptions({
      url: reqURL,
      method: method,
      headers: headers,
      body: body,
      search: search
    });
    let req = new Request(reqOptions)
    return this._http.request(req).map((res) => { return res.json().d });
  }

  getXReqDigest(url: string) {
    return this.makeRequest(url, null, null, RequestMethod.Post).map((res) => { return res });
  }
}