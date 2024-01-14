import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Animal, AnimalNS, ZooState, ZooStateModel } from './zoo.state';

@Component({
  selector: 'app-zoo',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  template: `
    <h2>
      @if ((hungryAnimals$ | async); as val) {
       we have {{ val }} hungry animals, please feed them 🍽️
      } @else {
       everyone is fed 😘
      }
    </h2>
    <div>
      <h4>type animal name to add</h4>
      <label for="name">Name
        <input type="text" name="name" [(ngModel)]="animal.name"> 
      </label>
      <label for="emoji">Emoji
        <input type="text" name="emoji" [(ngModel)]="animal.emoji"> 
      </label>
      <button (click)="addAnimals()" [disabled]="!animal.name.length">add +</button>
    </div>
    <ul>
      @for (a of (animals$ | async); track a.id) {
        <li>{{ a.emoji || '👾' }} {{ a.name }}
        @if (a.hungry) {
         <button (click)="feedAnimal(a)">🥩</button>
        } @else {
          ❤️
        }
        <button (click)="freeAnimal(a.id)">🏹</button>
        </li>
      }
    </ul>
  `,
  styles: `
    label {
      display: block;
      margin-bottom: 4px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZooComponent {
  @Select(ZooState.animals) animals$!: Observable<ZooStateModel['animals']>;
  @Select(ZooState.hungryAnimals) hungryAnimals$!: Observable<number>;
  #store = inject(Store);
  private readonly animalsInitialState = { name: '', emoji: '' };
  public animal = { ...this.animalsInitialState };

  public addAnimals(): void {
    if (!this.animal) return;
    if (this.animal) {
      this.#store.dispatch(new AnimalNS.Add(this.animal.name, this.animal.emoji));
      this.animal = { ...this.animalsInitialState };
    }
  }

  public feedAnimal(id: Animal): void {
    this.#store.dispatch(new AnimalNS.Feed(id));
  }

  public freeAnimal(id: Animal['id']): void {
    this.#store.dispatch(new AnimalNS.Free(id));
  }
}
