import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-link',
  templateUrl: './edit-link.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class EditLinkComponent implements OnInit {
  formData = {
    title: '',
    url: '',
    description: '',
    tags: '',
  };
  loading = true;
  error: string | null = null;
  private id: string | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadLink(this.id);
    }
  }

  async loadLink(id: string) {
    try {
      this.loading = true;
      const response = await this.api.getLink(id);
      const link = response.data;
      this.formData = {
        title: link.title,
        url: link.url,
        description: link.description || '',
        tags: link.tags ? link.tags.join(', ') : '',
      };
    } catch (err) {
      this.error = 'Error loading link';
      console.error('Error loading link:', err);
    } finally {
      this.loading = false;
    }
  }

  async handleSubmit() {
    if (!this.id) return;

    try {
      await this.api.updateLink(this.id, {
        ...this.formData,
        tags: this.formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Error updating link:', err);
      alert('Error updating link');
    }
  }
}
