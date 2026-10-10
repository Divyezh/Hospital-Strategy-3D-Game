export interface UserProfile {
  name: string;
  initials: string;
  role: string;
}

export const CURRENT_USER: UserProfile = {
  name: 'Divyesh Soni',
  initials: 'DS',
  role: 'Hospital Operations Manager',
};
