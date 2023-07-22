import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DiscoverPageRoutingModule } from './discover-routing.module';
import { DiscoverPage } from './discover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    DiscoverPageRoutingModule
  ],
  declarations: [DiscoverPage]
})
export class DiscoverPageModule { }
