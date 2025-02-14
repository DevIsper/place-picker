import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {

  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef)

  isFetching = signal(false);
  places = signal<Place[] | undefined>(undefined);
  error = signal('')

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.httpClient
      .get<{places: Place[]}>('http://localhost:3000/places')
      .pipe(
        map(resData => resData.places),
        catchError((err) => {
          console.log(err);
          return throwError(
            () => new Error("Something went wrong! Please, try again later.")
          );
        })
      )
      .subscribe({
        next: (places) => {
          this.places.set(places);
          },
        complete: () => {
          this.isFetching.set(false);
          },
        error: (err : Error) => {
          this.error.set(err.message);
        }
    }
    );


    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }


  onSelectPlace(p: Place) {
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: p.id,
    }).subscribe({
      next: (place) => {console.log(place)}
    });
  }
}
