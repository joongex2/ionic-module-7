import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';
import { Place } from './place.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    // return [...this._places];
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>('https://ionic-angular-course-463f0-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places.json')
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId,
                resData[key].location)
              );
            }
          }
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string): Observable<Place> {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-course-463f0-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places/${id}.json`
      ).pipe(map<PlaceData, Place>(placeData => {
        return new Place(
          id,
          placeData.title,
          placeData.description,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location
        )
      }));
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{ imageUrl: string, imagePath: string }>(
      'https://us-central1-ionic-angular-course-463f0.cloudfunctions.net/storeImage',
      uploadData
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation, imageUrl: string) {
    let generatedId: string;
    const newPlace = new Place(Math.random().toString(), title, description, imageUrl, price, dateFrom, dateTo, this.authService.userId, location);
    return this.http
      .post<{ name: string }>('https://ionic-angular-course-463f0-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places.json', {
        ...newPlace,
        id: null
      })
      .pipe(
        switchMap(resData => {
          generatedId = resData.name
          return this.places
        }),
        take(1),
        delay(1000),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(`https://ionic-angular-course-463f0-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places/${placeId}.json`, { ...updatedPlaces[updatedPlaceIndex], id: null })
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    )
  }
}
