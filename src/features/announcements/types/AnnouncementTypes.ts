
export type AnnouncementDetailTypes = {
  title: string;
  category: string;
  content: string;
  isActive: boolean;
  expiredAt: {
    year: number;
    month: number;
    day: number;
    dayOfWeek?: number;
  };
};

export type AnnouncementResponseTypes = {
  id: number;
  title: string;
  category: string;
  content: string;
  isActive: boolean;
  expiredAt: {
    year: number;
    month: number;
    day: number;
    dayOfWeek?: number;
  };
}; 

export interface Announcement {
  id: number;
  title: string;
  category: string;
  content: string;
  isActive: boolean;
  expiredAt: {
    year: number;
    month: number;
    day: number;
    dayOfWeek?: number;
  };
}