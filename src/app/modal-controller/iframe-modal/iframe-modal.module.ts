import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IframeModalPageRoutingModule } from './iframe-modal-routing.module';

import { IframeModalPage } from './iframe-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IframeModalPageRoutingModule
  ],
  declarations: [IframeModalPage]
})
export class IframeModalPageModule {}
