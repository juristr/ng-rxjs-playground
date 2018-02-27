import { Injectable } from '@angular/core';
import { LogMessage } from './log-message';
import { BackendService } from './backend.service';
import { Subject } from 'rxjs/Subject';
import { tap, zip, catchError, filter, bufferTime, concatMap, share, retryWhen, delayWhen, flatMap } from 'rxjs/operators';
import { range } from 'rxjs/observable/range';
import { timer } from 'rxjs/observable/timer';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { genericRetryStrategy } from './generic-retry';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoggerService {
  private sendToServer = new Subject<LogMessage>();

  public submissionStream = this.sendToServer
      .pipe(
        // only submit those having a given property
        filter(log => log.level === 'ERROR' || log.level === 'FATAL'),

        // only emit every 5 seconds
        bufferTime(5000),

        // emit only if there are values to submit
        filter(data => data.length > 0),

        // just for debugging
        tap(x => console.log('sending..', x)),

        concatMap((data: LogMessage[]) => {
          return this.http.post('/api/logs', data)
            .pipe(
              retryWhen(genericRetryStrategy({
                maxRetryAttempts: 3,
                scalingDuration: 1000
              })),
              catchError(error => {
                console.log('Client: Got an error');
                return _throw({
                  error: error,
                  data: data
                });
              })
            );
        }),

        // share the observable so that we
        // don't multiple ones for each subscribe
        // otherwise multiple HTTP requests would
        // be made
        share()
      );

  constructor(private backend: BackendService, private http: HttpClient) {
    // we subscribe here, otherwise since observables are lazy
    // nothing would happen
    this.submissionStream.subscribe();
  }

  log(log: LogMessage) {
    this.sendToServer.next(log);
    return this.submissionStream;
  }

}