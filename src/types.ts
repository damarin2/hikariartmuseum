export interface Artwork {
  id: string;
  title: string;
  category?: any;
  comments?: string;
  photo?: { url: string };
  createdAt: string;
}

export interface ExhibitionEvent {
  start: Date;
  end: Date;
  category: string;
  message: string;
  type: string;
}