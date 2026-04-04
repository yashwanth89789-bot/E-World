export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  url?: string;
  timestamp: string;
  category: string;
}

export interface MapState {
  center: [number, number];
  zoom: number;
}
