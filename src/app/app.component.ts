import { Component } from '@angular/core';
import { FormGroup,  FormBuilder } from '@angular/forms';
import { LoggerService } from './logger.service';
import { BackendService } from './backend.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  form: FormGroup;

  constructor(private fb: FormBuilder, private loggerService: LoggerService, private backend: BackendService) {
    this.form = fb.group({
      message: '',
      level: 'ERROR'
    });

    this.loggerService.submitted.subscribe(
      data => {
        console.log('Data submitted to server', data);
      },
      err => {
        console.error('An error happened', err);
      });
  }

  onFormSubmit({value}) {
    this.loggerService.log(value);

    // reset the message
    this.form.get('message').setValue('');
  }

  onBackendWorkingChanged(val) {
    console.log(val.target.checked);
  }

}
