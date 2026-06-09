export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';
export type SpotType = 'street' | 'park' | 'bowl' | 'stairs' | 'ledge' | 'rail' | 'gap' | 'manual';

export interface Skater {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  skillLevel: SkillLevel;
  location: string;
  followers: number;
  following: number;
  spotsAdded: number;
  bio: string;
  isFollowing?: boolean;
}

export interface Spot {
  id: string;
  name: string;
  description: string;
  type: SpotType;
  skillLevel: SkillLevel;
  latitude: number;
  longitude: number;
  address: string;
  neighborhood: string;
  thumbnail: string;
  clipCount: number;
  skaterCount: number;
  rating: number;
  addedBy: Skater;
  tags: string[];
  security: 'none' | 'low' | 'medium' | 'high';
  surface: 'smooth' | 'rough' | 'mixed';
  checkedInNow: number;
}

export interface FeedPost {
  id: string;
  skater: Skater;
  spot: Spot;
  caption: string;
  thumbnail: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: string;
  trick?: string;
}

export const MOCK_SKATERS: Skater[] = [
  {
    id: '1',
    username: 'venice_ripper',
    displayName: 'Jake Torres',
    avatar: 'https://i.pravatar.cc/150?img=11',
    skillLevel: 'advanced',
    location: 'Venice Beach, LA',
    followers: 4200,
    following: 310,
    spotsAdded: 47,
    bio: 'Venice local 🛹 Hitting spots since 2015',
    isFollowing: true,
  },
  {
    id: '2',
    username: 'dtla_grinds',
    displayName: 'Maya Chen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    skillLevel: 'pro',
    location: 'Downtown LA',
    followers: 12800,
    following: 220,
    spotsAdded: 89,
    bio: 'DTLA streets are my playground 🔥',
    isFollowing: false,
  },
  {
    id: '3',
    username: 'sk8_novice_la',
    displayName: 'Carlos Rivera',
    avatar: 'https://i.pravatar.cc/150?img=15',
    skillLevel: 'beginner',
    location: 'East LA',
    followers: 340,
    following: 560,
    spotsAdded: 5,
    bio: 'Learning the basics 🤙 East LA rep',
    isFollowing: true,
  },
  {
    id: '4',
    username: 'hollywood_lines',
    displayName: 'Zoe Kim',
    avatar: 'https://i.pravatar.cc/150?img=9',
    skillLevel: 'intermediate',
    location: 'Hollywood, LA',
    followers: 2100,
    following: 890,
    spotsAdded: 22,
    bio: 'Hollywood gaps and rails 🎬',
    isFollowing: false,
  },
];

export const MOCK_SPOTS: Spot[] = [
  {
    id: '1',
    name: 'Venice Beach Skate Park',
    description: 'Iconic open-air park right on the beach. Bowls, street course, everything.',
    type: 'park',
    skillLevel: 'beginner',
    latitude: 33.985,
    longitude: -118.4725,
    address: '1800 Ocean Front Walk',
    neighborhood: 'Venice',
    thumbnail: 'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=400',
    clipCount: 342,
    skaterCount: 89,
    rating: 4.9,
    addedBy: MOCK_SKATERS[0],
    tags: ['iconic', 'beginner-friendly', 'bowl', 'street'],
    security: 'none',
    surface: 'smooth',
    checkedInNow: 12,
  },
  {
    id: '2',
    name: 'Hollywood High Rail',
    description: 'The legendary Hollywood High School rail. Classic spot.',
    type: 'rail',
    skillLevel: 'advanced',
    latitude: 34.1016,
    longitude: -118.3406,
    address: '1521 Highland Ave',
    neighborhood: 'Hollywood',
    thumbnail: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400',
    clipCount: 1204,
    skaterCount: 412,
    rating: 4.7,
    addedBy: MOCK_SKATERS[3],
    tags: ['legendary', 'rail', 'steep', 'classic'],
    security: 'medium',
    surface: 'smooth',
    checkedInNow: 3,
  },
  {
    id: '3',
    name: 'DTLA Courthouse Ledges',
    description: 'Perfect marble ledges in the civic center. Wax up and go.',
    type: 'ledge',
    skillLevel: 'intermediate',
    latitude: 34.0534,
    longitude: -118.2427,
    address: '200 N Spring St',
    neighborhood: 'Downtown',
    thumbnail: 'https://images.unsplash.com/photo-1518981734379-7f31fcf17a3a?w=400',
    clipCount: 567,
    skaterCount: 203,
    rating: 4.5,
    addedBy: MOCK_SKATERS[1],
    tags: ['marble', 'ledges', 'smooth', 'downtown'],
    security: 'low',
    surface: 'smooth',
    checkedInNow: 7,
  },
  {
    id: '4',
    name: 'Stoner Park Skate Plaza',
    description: 'Chill West LA park. Great for learning street basics.',
    type: 'park',
    skillLevel: 'beginner',
    latitude: 34.027,
    longitude: -118.4353,
    address: '1835 Stoner Ave',
    neighborhood: 'West LA',
    thumbnail: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400',
    clipCount: 89,
    skaterCount: 45,
    rating: 4.3,
    addedBy: MOCK_SKATERS[2],
    tags: ['chill', 'park', 'beginner', 'west-la'],
    security: 'none',
    surface: 'smooth',
    checkedInNow: 4,
  },
  {
    id: '5',
    name: 'Macarthur Park Gap',
    description: 'Gnarly gap over the path. Not for the faint of heart.',
    type: 'gap',
    skillLevel: 'pro',
    latitude: 34.0589,
    longitude: -118.2774,
    address: 'Macarthur Park',
    neighborhood: 'Westlake',
    thumbnail: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400',
    clipCount: 78,
    skaterCount: 31,
    rating: 4.6,
    addedBy: MOCK_SKATERS[1],
    tags: ['gap', 'dangerous', 'pro', 'gnarly'],
    security: 'low',
    surface: 'rough',
    checkedInNow: 1,
  },
];

export const MOCK_FEED: FeedPost[] = [
  {
    id: '1',
    skater: MOCK_SKATERS[0],
    spot: MOCK_SPOTS[0],
    caption: 'Sunday session at Venice 🤙 smooth as butter today',
    thumbnail: 'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=600',
    likes: 847,
    comments: 42,
    isLiked: true,
    timestamp: '2h ago',
    trick: 'Kickflip',
  },
  {
    id: '2',
    skater: MOCK_SKATERS[1],
    spot: MOCK_SPOTS[1],
    caption: 'Finally got the 50-50 down at Hollywood High 🔥🔥🔥',
    thumbnail: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=600',
    likes: 3200,
    comments: 156,
    isLiked: false,
    timestamp: '5h ago',
    trick: '50-50 Grind',
  },
  {
    id: '3',
    skater: MOCK_SKATERS[3],
    spot: MOCK_SPOTS[2],
    caption: 'DTLA marble slaps different 💎 courthouse ledges never miss',
    thumbnail: 'https://images.unsplash.com/photo-1518981734379-7f31fcf17a3a?w=600',
    likes: 1100,
    comments: 67,
    isLiked: true,
    timestamp: '8h ago',
    trick: 'Boardslide',
  },
  {
    id: '4',
    skater: MOCK_SKATERS[2],
    spot: MOCK_SPOTS[3],
    caption: 'First time landing an ollie up a curb!! Stoner Park is goated for beginners',
    thumbnail: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600',
    likes: 234,
    comments: 28,
    isLiked: false,
    timestamp: '12h ago',
    trick: 'Ollie',
  },
];
