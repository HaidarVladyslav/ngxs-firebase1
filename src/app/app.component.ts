import { Component } from '@angular/core';
import { ZooComponent } from './zoo/zoo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ZooComponent],
  template: `
    <app-zoo />
  `,
  styles: [],
})
export class AppComponent {
}
