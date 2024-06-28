import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';

export type ParamsType = { [key: string]: any } | null;

export class ApiBase {
  private http = inject(HttpClient);
  protected apiBaseUrl: string = 'https://dummyjson.com';

  static createRouteUrl(routeParams: ParamsType, url: string) {
    if (routeParams) {
      for (const params in routeParams) {
        url = url.replace(`:${params}`, routeParams[params]);
      }
    }
    return url;
  }

  static createQueryParams(queryParams: ParamsType) {
    let params = new HttpParams();
    if (queryParams) {
      for (const key in queryParams) {
        params = params.append(key, queryParams[key]);
      }
    }
    return params;
  }

  protected getData<T>(
    url: string,
    routeParams: ParamsType = null,
    queryParams: ParamsType = null
  ) {
    const routeUrl = routeParams
      ? ApiBase.createRouteUrl(routeParams, url)
      : url;
    const urlQueryParams = ApiBase.createQueryParams(queryParams || {});

    return this.http.get<T>(`${this.apiBaseUrl}${routeUrl}`, {
      params: urlQueryParams,
    });
  }

  protected postData(
    url: string,
    routeParams: ParamsType = null,
    queryParams: ParamsType = null,
    payload: any
  ) {
    const routeUrl = routeParams
      ? ApiBase.createRouteUrl(routeParams, url)
      : url;
    const urlQueryParams = ApiBase.createQueryParams(queryParams || {});

    return this.http.post(`${this.apiBaseUrl}${routeUrl}`, payload, {
      params: urlQueryParams,
    });
  }
}
