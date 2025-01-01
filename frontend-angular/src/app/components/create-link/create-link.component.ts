import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-link',
  templateUrl: './create-link.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CreateLinkComponent {
  formData = {
    title: '',
    url: '',
    description: '',
    tags: '',
  };

  constructor(private api: ApiService, private router: Router) {}

  async handleSubmit() {
    try {
      await this.api.createLink({
        ...this.formData,
        tags: this.formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Error creating link:', err);
      alert('Error creating link');
    }
  }
}
