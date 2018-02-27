import { Injectable } from '@angular/core';
import { LogMessage } from './log-message';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

/**
 * This is the fake receiver of the log messages since there's
 * no backend involved here
 */
@Injectable()
export class BackendService {
  private logMessages: LogMessage[] = [];
  isWorking = true;

  constructor() { }

  setWorking(isWorking) {
    this.isWorking = isWorking;
  }

  getMessages() {
    return this.logMessages;
  }

  send(logMessage: LogMessage | LogMessage[]) {
    if (this.isWorking) {
      if(logMessage instanceof Array) {
        this.logMessages.push(...logMessage);
      } else {
        this.logMessages.push(logMessage);
      }

      return of({ status: 'OK'});
    } else {
      
      return _throw(new Error('server unavailable'));
    }
  }

}