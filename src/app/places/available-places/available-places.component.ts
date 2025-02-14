import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import {PlacesService} from "../places.service";

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {

  destroyRef = inject(DestroyRef)
  placesService = inject(PlacesService);

  isFetching = signal(false);
  places = signal<Place[] | undefined>(undefined);
  error = signal('')

  ngOnInit(): void {
    this.isFetching.set(true);
    const sub = this.placesService.loadAvailablePlaces()
      .subscribe({
        next: (places) => {
          this.places.set(places);
          },
        complete: () => {
          this.isFetching.set(false);
          },
        error: (error: Error) => {this.error.set(error.message)}
        }
      );

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }


  onSelectPlace(p: Place) {
    this.placesService.addPlaceToUserPlaces(p);
  }
}
