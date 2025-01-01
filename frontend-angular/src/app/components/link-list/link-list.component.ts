import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Link } from '../../models/link.interface';

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class LinkListComponent implements OnInit {
  links: Link[] = [];
  activeTags: Set<string> = new Set();
  allTags: string[] = [];
  loading = true;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadLinks();
  }

  async loadLinks() {
    try {
      this.loading = true;
      const response = await this.api.getAllLinks();
      this.links = response.data;
      this.updateTags(response.data);
    } catch (err) {
      this.error = 'Error loading links';
      console.error('Error loading links:', err);
    } finally {
      this.loading = false;
    }
  }

  updateTags(links: Link[]) {
    const tagSet = new Set<string>();
    links.forEach((link) => {
      if (link.tags) {
        link.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    this.allTags = Array.from(tagSet).sort();
  }

  toggleTag(tag: string) {
    if (this.activeTags.has(tag)) {
      this.activeTags.delete(tag);
    } else {
      this.activeTags.add(tag);
    }
  }

  clearTags() {
    this.activeTags.clear();
  }

  get filteredLinks() {
    return this.links.filter((link) => {
      if (this.activeTags.size === 0) return true;
      return (
        link.tags &&
        Array.from(this.activeTags).every((tag) => link.tags!.includes(tag))
      );
    });
  }

  async deleteLink(id: string) {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await this.api.deleteLink(id);
      await this.loadLinks();
    } catch (err) {
      console.error('Error deleting link:', err);
      alert('Error deleting link');
    }
  }
}
