import {Component, DestroyRef, inject, Input, OnInit, signal} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import {Place} from "../place.model";
import {PlacesService} from "../places.service";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  placesService = inject(PlacesService);

  places = this.placesService.loadedUserPlaces;
  isFetching = signal(false);
  error = signal('')

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.placesService.loadUserPlaces()
      .subscribe({
        next: (places) => {
          console.log(this.placesService.loadedUserPlaces);
        },
        complete: () => {this.isFetching.set(false)},
        error: (error: Error) => {this.error.set(error.message)}
      })

    this.destroyRef.onDestroy(sub.unsubscribe);
  }

  onSelectPlace(p: Place) {
    this.isFetching.set(true);
    this.placesService.removeUserPlace(p)
      .subscribe({
        complete: () => {this.isFetching.set(false)}
      })
  }
}
