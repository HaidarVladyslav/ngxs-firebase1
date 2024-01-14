import { Injectable, inject } from "@angular/core";
import { take, tap } from "rxjs";
import { Action, NgxsOnInit, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { ZooService } from "./zoo.service";

export interface Animal {
  id: string;
  name: string;
  emoji?: string;
  hungry: boolean;
}

export type ZooStateModel = {
  animals: Animal[];
};

export const ZOO_STATE_TOKEN = new StateToken<string>('zoo');

export namespace AnimalNS {
  export class Add {
    static readonly type = '[Zoo] Add Animal';
    constructor(public name: string, public emoji?: string) { }
  }

  export class Feed {
    static readonly type = '[Zoo] Feed Animal';
    constructor(public animal: Animal) { }
  }

  export class Free {
    static readonly type = '[Zoo] Free Animal';
    constructor(public id: string) { }
  }

  export class GetAll {
    static readonly type = '[Zoo] Get All Animals';
  }
}

@State<ZooStateModel>({
  name: ZOO_STATE_TOKEN,
  defaults: {
    animals: []
  }
})
@Injectable()
export class ZooState implements NgxsOnInit {
  #zooService = inject(ZooService);

  @Selector()
  static animals(state: ZooStateModel) {
    return state.animals;
  }

  @Selector()
  static hungryAnimals(state: ZooStateModel) {
    return state.animals.filter(a => a.hungry).length;
  }

  @Action(AnimalNS.Add)
  addAnimal(ctx: StateContext<ZooStateModel>, { name, emoji }: AnimalNS.Add) {
    const newAnimal = { name, emoji, hungry: true };
    return this.#zooService.addAnimal(newAnimal).pipe(
      tap((d) => ctx.setState((state) => ({ ...state, animals: [...state.animals, { ...newAnimal, id: d.id }] })))
    )
  }

  @Action(AnimalNS.Feed)
  feedAnimal(ctx: StateContext<ZooStateModel>, { animal }: AnimalNS.Feed) {
    return this.#zooService.feedAnimal({ ...animal, hungry: false }).pipe(
      tap(() => ctx.setState(state => ({ ...state, animals: state.animals.map(a => animal.id !== a.id ? a : ({ ...a, hungry: false })) })))
    )
  }

  @Action(AnimalNS.Free)
  freeAnimal(ctx: StateContext<ZooStateModel>, { id }: AnimalNS.Free) {
    return this.#zooService.freeAnimal(id).pipe(
      tap(() => ctx.setState(state => ({ ...state, animals: state.animals.filter(animal => animal.id !== id) })))
    )
  }

  @Action(AnimalNS.GetAll)
  getAllAnimals(ctx: StateContext<ZooStateModel>) {
    return this.#zooService.getAnimals().pipe(
      tap(animals => ctx.setState({ animals })),
      take(1),
    )
  }

  public ngxsOnInit(ctx: StateContext<ZooStateModel>): void {
    ctx.dispatch(new AnimalNS.GetAll());
  }
}