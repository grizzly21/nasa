import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  rovers = [
    {value: 'curiosity', viewValue: 'Curiosity'},
    {value: 'opportunity', viewValue: 'Opportunity'},
    {value: 'spirit', viewValue: 'Spirit'},
  ]
}
