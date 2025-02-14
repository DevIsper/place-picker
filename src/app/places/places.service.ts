import {inject, Injectable, signal} from '@angular/core';

import { Place } from './place.model';
import {catchError, map, throwError} from "rxjs";
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
  }

  addPlaceToUserPlaces(place: Place) {
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id,
    }).subscribe();
  }

  removeUserPlace(place: Place) {
    return this.httpClient.delete('http://localhost:3000/user-places/' + place.id, {});
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
