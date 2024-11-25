export interface CommentResponse {
  createdAt: number;
  updatedAt: number;
  firstName: string;
  lastName: string;
  comment: string;
  id: string;
  userId: string;
  clientId: string;
}

export interface AddComment {
  firstName: string;
  lastName: string;
  comment: string;
  userId: string;
  clientId: string;
}
