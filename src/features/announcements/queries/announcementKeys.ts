export const announcementKeys = {
  all: ['announcements'] as const, 
  list: () => [...announcementKeys.all] as const, 
  detail: (id: number) => [...announcementKeys.all, id] as const,
};