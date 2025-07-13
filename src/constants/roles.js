// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// User Badges
export const USER_BADGES = {
  NEWCOMER: 'newcomer',
  ACTIVE_MEMBER: 'active_member',
  CONTRIBUTOR: 'contributor',
  EXPERT: 'expert',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Badge Descriptions
export const BADGE_DESCRIPTIONS = {
  [USER_BADGES.NEWCOMER]: 'Welcome to the community!',
  [USER_BADGES.ACTIVE_MEMBER]: 'Active community member',
  [USER_BADGES.CONTRIBUTOR]: 'Regular content contributor',
  [USER_BADGES.EXPERT]: 'Knowledge expert in the field',
  [USER_BADGES.MODERATOR]: 'Community moderator',
  [USER_BADGES.ADMIN]: 'Administrator'
};

// Default badge for new users
export const DEFAULT_USER_BADGE = USER_BADGES.NEWCOMER;
export const DEFAULT_USER_ROLE = USER_ROLES.USER;
