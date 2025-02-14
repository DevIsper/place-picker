import {Component, DestroyRef, inject, Input, OnInit, signal} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import {Place} from "../place.model";
import {HttpClient} from "@angular/common/http";
import {catchError, map, throwError} from "rxjs";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);

  places = signal<Place[] | undefined>(undefined)
  error = signal("");
  isFetching = signal(false);

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/user-places')
      .pipe(
        map(resData => resData.places),
        catchError((err) => throwError(() =>
          new Error("Ocorreu um erro.")))
      )
      .subscribe({
        next: (places: Place[]) => {
          this.places.set(places)
        },
        complete: () => {this.isFetching.set(false);},
        error: (err: Error) => {this.error.set(err.message);}
      })

    this.destroyRef.onDestroy(sub.unsubscribe);
  }

  onSelectPlace($event: Place) {

  }
}
