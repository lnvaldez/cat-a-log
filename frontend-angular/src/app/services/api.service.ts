import { Injectable } from '@angular/core';
import axios from 'axios';
import { Link, Comment } from '../models/link.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL = 'http://localhost:5000/api';

  // Links
  getAllLinks() {
    return axios.get<Link[]>(`${this.API_URL}/links`);
  }

  getLink(id: string) {
    return axios.get<Link>(`${this.API_URL}/links/${id}`);
  }

  createLink(data: Partial<Link>) {
    return axios.post<Link>(`${this.API_URL}/links`, data);
  }

  updateLink(id: string, data: Partial<Link>) {
    return axios.put<Link>(`${this.API_URL}/links/${id}`, data);
  }

  deleteLink(id: string) {
    return axios.delete(`${this.API_URL}/links/${id}`);
  }

  voteLink(id: string, vote: number) {
    return axios.post<Link>(`${this.API_URL}/links/${id}/vote`, { vote });
  }

  // Comments
  getComments(linkId: string) {
    return axios.get<Comment[]>(`${this.API_URL}/comments/${linkId}`);
  }

  createComment(data: { linkId: string; content: string }) {
    return axios.post<Comment>(`${this.API_URL}/comments`, data);
  }
}
