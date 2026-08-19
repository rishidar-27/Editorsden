export const initialEditors = [
  {
    id: 'e1',
    fullName: 'Marcus Chen',
    email: 'marcus.chen@email.com',
    city: 'San Francisco, CA',
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus',
    bio: 'Senior video editor specializing in YouTube tech content and fast-paced commercial reels with 5+ years experience.',
    skills: ['Reels Editing', 'YouTube Editing', 'Color Grading', 'Motion Graphics'],
    editingSoftware: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    experience: 5,
    availability: 'Full-Time (40+ hrs/week)',
    verificationStatus: 'Verified',
    portfolioLinks: [
      { title: 'Commercial Showreel 2025', url: 'https://youtube.com' },
      { title: 'Tech Review Edit Samples', url: 'https://vimeo.com' }
    ],
    sampleVideos: [
      { title: '4K Cinematic Color Grade', url: 'https://youtube.com', thumbnail: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=300' }
    ],
    active: true,
    lastLogin: '2026-08-18T18:30:00Z',
    rating: 4.9
  },
  {
    id: 'e2',
    fullName: 'Elena Rodriguez',
    email: 'elena.rodriguez@email.com',
    city: 'New York, NY',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    bio: 'Passionate lifestyle and beauty reel editor. Expert in motion typography and audio syncing.',
    skills: ['Reels Editing', 'Commercial Ads', 'Audio Mixing'],
    editingSoftware: ['Adobe Premiere Pro', 'After Effects'],
    experience: 4,
    availability: 'Part-Time (20–30 hrs/week)',
    verificationStatus: 'Verified',
    portfolioLinks: [
      { title: 'Beauty Brand Campaign', url: 'https://youtube.com' }
    ],
    sampleVideos: [],
    active: true,
    lastLogin: '2026-08-17T12:00:00Z',
    rating: 4.8
  },
  {
    id: 'e3',
    fullName: 'David Park',
    email: 'david.park@email.com',
    city: 'Los Angeles, CA',
    avatarUrl: 'https://i.pravatar.cc/150?u=david',
    bio: 'Podcast edit suite specialist and short-form YouTube shorts creator with high viewer retention strategies.',
    skills: ['YouTube Editing', 'Podcast Editing', 'Thumbnail Design'],
    editingSoftware: ['DaVinci Resolve', 'Adobe Premiere Pro'],
    experience: 3,
    availability: 'Full-Time (40+ hrs/week)',
    verificationStatus: 'Verified',
    portfolioLinks: [],
    sampleVideos: [],
    active: true,
    lastLogin: '2026-08-18T16:15:00Z',
    rating: 4.7
  },
  {
    id: 'e4',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    city: 'London, UK',
    avatarUrl: 'https://i.pravatar.cc/150?u=priya',
    bio: 'Wedding storyteller and documentary filmmaker with deep color science knowledge.',
    skills: ['Wedding Videos', 'Motion Graphics', 'Color Grading'],
    editingSoftware: ['DaVinci Resolve', 'Final Cut Pro'],
    experience: 4,
    availability: 'Weekends (10–15 hrs/week)',
    verificationStatus: 'Pending',
    portfolioLinks: [],
    sampleVideos: [],
    active: true,
    lastLogin: '2026-08-18T14:00:00Z',
    rating: 4.6
  },
  {
    id: 'e5',
    fullName: 'James Wilson',
    email: 'james.wilson@email.com',
    city: 'Chicago, IL',
    avatarUrl: 'https://i.pravatar.cc/150?u=james',
    bio: 'Commercial brand film editor and podcast series editor.',
    skills: ['Reels Editing', 'YouTube Editing', 'Podcast Editing'],
    editingSoftware: ['Adobe Premiere Pro'],
    experience: 6,
    availability: 'Full-Time (40+ hrs/week)',
    verificationStatus: 'Verified',
    portfolioLinks: [],
    sampleVideos: [],
    active: true,
    lastLogin: '2026-08-18T09:00:00Z',
    rating: 4.9
  }
];

export const initialProjects = [
  {
    id: 'p1',
    title: 'Aurora Skincare — Q4 Launch Campaign',
    clientName: 'Aurora Cosmetics Inc.',
    description: 'Full video asset production for nationwide skincare launch across Instagram, TikTok, and YouTube.',
    status: 'In Progress',
    subtasks: [
      {
        id: 'st-1',
        title: 'Hero Brand Film (60s)',
        taskType: 'Commercial Ads',
        assignedEditorIds: ['e1', 'e2'],
        deadline: '2025-05-19T23:59:59Z',
        status: 'In Progress'
      },
      {
        id: 'st-2',
        title: 'Instagram Reel Series (5x)',
        taskType: 'Reels Editing',
        assignedEditorIds: ['e2'],
        deadline: '2025-05-20T23:59:59Z',
        status: 'Ready for Review',
        deliverableLink: 'https://drive.google.com/aurora-reels'
      },
      {
        id: 'st-3',
        title: 'Product Tutorial Videos (3x)',
        taskType: 'YouTube Editing',
        assignedEditorIds: ['e1'],
        deadline: '2025-05-25T23:59:59Z',
        status: 'Assigned'
      },
      {
        id: 'st-4',
        title: 'Thumbnail Design Package',
        taskType: 'Thumbnail Design',
        assignedEditorIds: ['e3'],
        deadline: '2025-05-20T23:59:59Z',
        status: 'Ready for Review',
        deliverableLink: 'https://drive.google.com/aurora-thumbs'
      }
    ]
  },
  {
    id: 'p2',
    title: 'TechFlow SaaS — Product Demo Series',
    clientName: 'TechFlow Inc.',
    description: 'SaaS product demo video series highlighting automated workflow features.',
    status: 'In Progress',
    subtasks: [
      {
        id: 'st-5',
        title: 'Motion Graphics Intro Package',
        taskType: 'Motion Graphics',
        assignedEditorIds: ['e1'],
        deadline: '2025-05-21T23:59:59Z',
        status: 'In Progress'
      },
      {
        id: 'st-6',
        title: 'Feature Walkthrough Video',
        taskType: 'YouTube Editing',
        assignedEditorIds: ['e3'],
        deadline: '2025-05-22T23:59:59Z',
        status: 'In Progress'
      },
      {
        id: 'st-7',
        title: 'Social Teasers (4x)',
        taskType: 'Reels Editing',
        assignedEditorIds: ['e2'],
        deadline: '2025-05-21T23:59:59Z',
        status: 'Ready for Review',
        deliverableLink: 'https://drive.google.com/techflow-teasers'
      }
    ]
  }
];
