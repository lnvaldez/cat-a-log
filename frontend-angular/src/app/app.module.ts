import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LinkListComponent } from './components/link-list/link-list.component';
import { LinkDetailComponent } from './components/link-detail/link-detail.component';
import { CreateLinkComponent } from './components/create-link/create-link.component';
import { EditLinkComponent } from './components/edit-link/edit-link.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    LinkListComponent,
    LinkDetailComponent,
    CreateLinkComponent,
    EditLinkComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
