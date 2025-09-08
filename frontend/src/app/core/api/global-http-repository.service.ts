import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TranslateService} from '../i18n/translate.service';
import {ErrorApiResponse} from '../model/response.model';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GlobalHttpApi {
  protected readonly http = inject(HttpClient);
  protected readonly i18n = inject(TranslateService);
  protected readonly apiUrl = environment.apiUrl ?? '';

  protected headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': this.i18n.lang()
    });

  protected createErrorResponse(error: any): ErrorApiResponse {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return {
      success: false,
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      correlationId: '',
      reason: message,
      path: window.location.pathname
    };
  }
}
