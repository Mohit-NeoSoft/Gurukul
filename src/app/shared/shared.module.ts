import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterPage } from '../footer/footer.page';

@NgModule({
  declarations: [FooterPage],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FooterPage]
})
export class SharedModule { }
