import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from './../../../shared/shared.modules';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';
import { PlaceDetailPage } from './place-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [PlaceDetailPage, CreateBookingComponent],
  // entryComponents: [CreateBookingComponent]
})
export class PlaceDetailPageModule { }
