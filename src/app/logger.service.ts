import { Injectable } from '@angular/core';
import { LogMessage } from './log-message';
import { BackendService } from './backend.service';
import { Subject } from 'rxjs/Subject';
import { tap, zip, catchError, filter, bufferTime, concatMap, share, retryWhen, delayWhen, flatMap } from 'rxjs/operators';
import { range } from 'rxjs/observable/range';
import { timer } from 'rxjs/observable/timer';
import { of } from 'rxjs/observable/of';

import { genericRetryStrategy } from './generic-retry';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoggerService {
  private sendToServer = new Subject<LogMessage>();

  public submitted = this.sendToServer
      .pipe(
        // only submit those having a given property
        filter(log => log.level === 'ERROR' || log.level === 'FATAL'),

        // wait 5 secs and submit in batches
        bufferTime(5000),

        // emit only if there are values to submit
        filter(data => data.length > 0),

        // just for debugging
        tap(x => console.log('sending..', x)),

        concatMap((data: LogMessage[]) => {
          return this.http.post('/someendpoint', data)
            .pipe(
              retryWhen(genericRetryStrategy({
                maxRetryAttempts: 3,
                scalingDuration: 1000
              })),
              catchError(error => {
                console.log('Client: Got an error')
                return of(error)
              })
            );
            
            // .pipe(
            //   retryWhen(attempts => {
            //     return attempts
            //       .pipe(
            //         // 5 trials, generate 1 -> 5
            //         zip(range(1,3), (_, i) => i),
            //         delayWhen(i => {
            //           const retryDelay = i * 1000;
            //           console.log(`Delaying retry by ${retryDelay} secs`);
            //           return timer(retryDelay);
            //         }),
            //         catchError(error => {
            //           console.log('Client: Got an error')
            //           return of(error)
            //         })
            //       );
            //   })
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
    this.submitted.subscribe();
  }

  log(log: LogMessage) {
    this.sendToServer.next(log);
    return this.submitted;
  }

}