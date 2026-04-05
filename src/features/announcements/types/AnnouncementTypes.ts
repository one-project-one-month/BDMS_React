
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