import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Link, Comment } from '../../models/link.interface';

@Component({
  selector: 'app-link-detail',
  templateUrl: './link-detail.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class LinkDetailComponent implements OnInit {
  link: Link | null = null;
  comments: Comment[] = [];
  newComment = '';
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLinkAndComments(id);
    }
  }

  async loadLinkAndComments(id: string) {
    try {
      this.loading = true;
      const [linkResponse, commentsResponse] = await Promise.all([
        this.api.getLink(id),
        this.api.getComments(id),
      ]);
      this.link = linkResponse.data;
      this.comments = commentsResponse.data;
    } catch (err) {
      this.error = 'Error loading link details';
      console.error('Error:', err);
    } finally {
      this.loading = false;
    }
  }

  async handleVote(value: number) {
    if (!this.link) return;

    try {
      const response = await this.api.voteLink(this.link._id, value);
      this.link = response.data;
    } catch (err) {
      console.error('Error voting:', err);
      alert('Error voting');
    }
  }

  async handleCommentSubmit() {
    if (!this.link || !this.newComment.trim()) return;

    try {
      await this.api.createComment({
        linkId: this.link._id,
        content: this.newComment,
      });
      this.newComment = '';
      const commentsResponse = await this.api.getComments(this.link._id);
      this.comments = commentsResponse.data;
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Error posting comment');
    }
  }
}
