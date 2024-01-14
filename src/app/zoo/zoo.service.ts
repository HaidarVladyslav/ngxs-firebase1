import { Injectable, inject } from '@angular/core';
import { Observable, defer } from 'rxjs';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Animal } from './zoo.state';

const ANIMAL_KEY = 'animals';

@Injectable({
  providedIn: 'root'
})
export class ZooService {
  #firestore: Firestore = inject(Firestore);

  public getAnimals(): Observable<Animal[]> {
    const animalCollection = collection(this.#firestore, ANIMAL_KEY);
    return collectionData(animalCollection, { idField: 'id' }) as Observable<Animal[]>;
  }

  public addAnimal(animal: Omit<Animal, 'id'>) {
    const animalCollection = collection(this.#firestore, ANIMAL_KEY);
    return defer(() => addDoc(animalCollection, animal));
  }

  public freeAnimal(id: Animal['id']) {
    const animal = doc(this.#firestore, ANIMAL_KEY + '/' + id);
    return defer(() => deleteDoc(animal));
  }

  public feedAnimal(animal: Animal) {
    const animalDoc = doc(this.#firestore, ANIMAL_KEY + '/' + animal.id);
    return defer(() => setDoc(animalDoc, animal));
  }
}
