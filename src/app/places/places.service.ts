import {inject, Injectable, signal} from '@angular/core';

import { Place } from './place.model';
import {catchError, map, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ErrorService} from "../shared/error.service";

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  private httpClient = inject(HttpClient)
  private errorService = inject(ErrorService);
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

    let prevPlaces = this.userPlaces();

    if(!this.userPlaces().some((p: Place) => place.id === p.id)) {
      this.userPlaces.update((prevPlaces => [...prevPlaces, place]));

      this.httpClient.put('http://localhost:3000/user-places', {
        placeId: place.id,
      }).subscribe({
        error: () => {
          this.userPlaces.set(prevPlaces)
          this.errorService.showError("ERROR N. 9123919951923912R91923192399 CALL IMEDIATE SUPPORT!!!!!!!!!");
        }
      });
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
