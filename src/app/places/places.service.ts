import {inject, Injectable, signal} from '@angular/core';

import { Place } from './place.model';
import {catchError, map, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  httpClient = inject(HttpClient)

  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces("http://localhost:3000/places", "Something went wrong! Please, try again later.")
  }

  loadUserPlaces() {
    return this.fetchPlaces("http://localhost:3000/user-places", "Something went wrong! Please try again later.")
      .pipe(
        tap({
          next: (userPlaces) => {this.userPlaces.set(userPlaces)}
        })
      );
  }

  addPlaceToUserPlaces(place: Place) {

    if(!this.userPlaces().some((p: Place) => place.id === p.id)) {
      this.userPlaces.update((prevPlaces => [...prevPlaces, place]));

      this.httpClient.put('http://localhost:3000/user-places', {
        placeId: place.id,
      }).subscribe();
    }
  }

  removeUserPlace(p: Place) {
    this.userPlaces.set(
      this.userPlaces()
        .filter((place) => place.id !== p.id)
    );

    return this.httpClient.delete('http://localhost:3000/user-places/' + p.id, {});
  }

  fetchPlaces(url : string, errorMessage : string) {
    return this.httpClient
      .get<{places: Place[]}>(`${url}`)
      .pipe(
        map(resData => resData.places),
        catchError(() => {
          return throwError(
            () => new Error(`${errorMessage}`)
          );
        })
      )

  }
}
