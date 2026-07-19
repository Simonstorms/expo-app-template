export type Gender = 'male' | 'female' | 'other';

export const genderOptions: { id: Gender; label: string }[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
];

export type UsageLevel = 'light' | 'regular' | 'heavy';

export const usageOptions: { id: UsageLevel; label: string; caption: string; dots: number }[] = [
  { id: 'light', label: '1-5', caption: 'Now and then', dots: 1 },
  { id: 'regular', label: '6-10', caption: 'Regular part of my day', dots: 3 },
  { id: 'heavy', label: '11+', caption: 'Heavy daily use', dots: 6 },
];

export type DiscoverySource =
  | 'instagram'
  | 'tiktok'
  | 'tv'
  | 'friends'
  | 'facebook'
  | 'youtube'
  | 'google';

export const sourceOptions: { id: DiscoverySource; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'tv', label: 'TV' },
  { id: 'friends', label: 'Friend or family' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'youtube', label: 'Youtube' },
  { id: 'google', label: 'Google' },
];

export type SnusType = 'pouches' | 'loose';

export type QuitGoal = 'quitCompletely' | 'cutBack' | 'stayFree';

export const goalOptions: { id: QuitGoal; label: string }[] = [
  { id: 'quitCompletely', label: 'Quit completely' },
  { id: 'cutBack', label: 'Cut back gradually' },
  { id: 'stayFree', label: 'Stay nicotine-free' },
];

export type Obstacle = 'consistency' | 'cravings' | 'support' | 'schedule' | 'socialPressure';

export const obstacleOptions: { id: Obstacle; label: string; symbol: string }[] = [
  { id: 'consistency', label: 'Lack of consistency', symbol: 'chart.bar.fill' },
  { id: 'cravings', label: 'Stress and cravings', symbol: 'bolt.fill' },
  { id: 'support', label: 'Lack of support', symbol: 'medal.fill' },
  { id: 'schedule', label: 'Busy schedule', symbol: 'calendar' },
  { id: 'socialPressure', label: 'Social pressure', symbol: 'person.2.fill' },
];
