import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { LoggerService } from './logger.service';
import { BackendService } from './backend.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports:      [ BrowserModule, ReactiveFormsModule, HttpClientModule ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ],
  providers: [LoggerService, BackendService]
})
export class AppModule { }
