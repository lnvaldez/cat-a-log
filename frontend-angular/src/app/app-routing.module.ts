import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkListComponent } from './components/link-list/link-list.component';
import { LinkDetailComponent } from './components/link-detail/link-detail.component';
import { CreateLinkComponent } from './components/create-link/create-link.component';
import { EditLinkComponent } from './components/edit-link/edit-link.component';

const routes: Routes = [
  { path: '', component: LinkListComponent },
  { path: 'link/:id', component: LinkDetailComponent },
  { path: 'create', component: CreateLinkComponent },
  { path: 'edit/:id', component: EditLinkComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
