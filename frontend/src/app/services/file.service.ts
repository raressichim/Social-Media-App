import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import saveAs from 'file-saver';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  download(fileName: string): Observable<void> {
    return this.http
      .get(`http://localhost:8080/api/files/download/${fileName}`, {
        withCredentials: true,
        observe: 'events',
        responseType: 'blob',
      })
      .pipe(
        map((event: HttpEvent<Blob>) => {
          if (event.type === HttpEventType.Response) {
            const blob = new Blob([event.body!], {
              type: event.headers.get('Content-Type')!,
            });
            saveAs(blob, fileName);
          }
        })
      );
  }
}
