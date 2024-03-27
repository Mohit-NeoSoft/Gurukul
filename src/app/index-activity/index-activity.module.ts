import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndexActivityPageRoutingModule } from './index-activity-routing.module';

import { IndexActivityPage } from './index-activity.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndexActivityPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [IndexActivityPage]
})
export class IndexActivityPageModule {}
