export interface Village {
  id: string;
  name: string;
  state: string;
  district: string;
  coordinates: [number, number];
  fraType: 'IFR' | 'CFR';
  landArea: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  population: number;
  forestCover: number;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'scheme' | 'announcement' | 'warning' | 'update';
  priority: 'high' | 'medium' | 'low';
  coordinates: [number, number];
  village?: string;
  state: string;
  district: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  targetAudience: 'all' | 'local' | 'government';
  attachments?: string[];
}

export interface State {
  name: string;
  districts: string[];
}

export const mockVillages: Village[] = [
  {
    id: '1',
    name: 'Kumhargaon',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    coordinates: [22.5957, 80.3689],
    fraType: 'CFR',
    landArea: 1250,
    status: 'Approved',
    population: 2847,
    forestCover: 78,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Patalkot',
    state: 'Madhya Pradesh',
    district: 'Chhindwara',
    coordinates: [22.0696, 78.9390],
    fraType: 'IFR',
    landArea: 890,
    status: 'Pending',
    population: 1653,
    forestCover: 65,
    lastUpdated: '2024-01-10'
  },
  {
    id: '4',
    name: 'Jhirnia',
    state: 'Odisha',
    district: 'Rayagada',
    coordinates: [19.1663, 83.4156],
    fraType: 'IFR',
    landArea: 1560,
    status: 'Rejected',
    population: 2156,
    forestCover: 45,
    lastUpdated: '2024-01-08'
  },
  {
    id: '5',
    name: 'Kendupali',
    state: 'Odisha',
    district: 'Kalahandi',
    coordinates: [20.0484, 83.1648],
    fraType: 'CFR',
    landArea: 1890,
    status: 'Approved',
    population: 2890,
    forestCover: 71,
    lastUpdated: '2024-01-18'
  },
  {
    id: '7',
    name: 'Kothagudem',
    state: 'Telangana',
    district: 'Khammam',
    coordinates: [17.5512, 80.6177],
    fraType: 'CFR',
    landArea: 1450,
    status: 'Approved',
    population: 2156,
    forestCover: 68,
    lastUpdated: '2024-01-14'
  },
  {
    id: '8',
    name: 'Agartala Forest',
    state: 'Tripura',
    district: 'Dhalai',
    coordinates: [23.8315, 91.2862],
    fraType: 'IFR',
    landArea: 920,
    status: 'Pending',
    population: 1834,
    forestCover: 72,
    lastUpdated: '2024-01-11'
  }
];

export const mockStates: State[] = [
  {
    name: 'Madhya Pradesh',
    districts: ['Mandla', 'Chhindwara', 'Balaghat', 'Dindori']
  },
  {
    name: 'Odisha',
    districts: ['Rayagada', 'Kalahandi', 'Koraput', 'Malkangiri']
  },
  {
    name: 'Telangana',
    districts: ['Adilabad', 'Khammam', 'Warangal', 'Nizamabad']
  },
  {
    name: 'Tripura',
    districts: ['Dhalai', 'Gomati', 'Khowai', 'Sepahijala']
  }
];

export const mockStatistics = {
  totalVillages: 2847,
  approvedClaims: 1653,
  pendingClaims: 892,
  rejectedClaims: 302,
  totalLandArea: 48750, // in hectares
  forestCoverPercent: 67.8,
  monthlyGrowth: [
    { month: 'Jan', approved: 145, pending: 89, rejected: 23 },
    { month: 'Feb', approved: 167, pending: 76, rejected: 19 },
    { month: 'Mar', approved: 189, pending: 94, rejected: 31 },
    { month: 'Apr', approved: 156, pending: 112, rejected: 28 },
    { month: 'May', approved: 198, pending: 87, rejected: 15 },
    { month: 'Jun', approved: 223, pending: 103, rejected: 22 }
  ]
};

export const mockRecommendations = [
  {
    id: '1',
    title: 'MGNREGA Integration',
    description: 'Link forest conservation activities with MGNREGA for sustainable income.',
    priority: 'High',
    villages: 34,
    estimatedImpact: '85%'
  },
  {
    id: '2',
    title: 'Bamboo Cultivation Scheme',
    description: 'Promote bamboo cultivation in suitable CFR areas for economic benefits.',
    priority: 'Medium',
    villages: 28,
    estimatedImpact: '72%'
  },
  {
    id: '3',
    title: 'Non-Timber Forest Produce',
    description: 'Establish collection and processing centers for NTFP.',
    priority: 'High',
    villages: 45,
    estimatedImpact: '91%'
  },
  {
    id: '4',
    title: 'Digital Documentation',
    description: 'Implement digital record keeping for better tracking.',
    priority: 'Low',
    villages: 67,
    estimatedImpact: '68%'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'New Forest Rights Scheme Launch',
    message: 'A new forest rights scheme has been launched for the region. All eligible communities can apply for additional land rights and conservation benefits. Contact your local forest department for more information.',
    type: 'scheme',
    priority: 'high',
    coordinates: [22.5957, 80.3689],
    village: 'Kumhargaon',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    createdBy: 'Forest Department MP',
    createdAt: '2024-01-20T10:00:00Z',
    expiresAt: '2024-03-20T10:00:00Z',
    isActive: true,
    targetAudience: 'local',
    attachments: ['scheme-guidelines.pdf', 'application-form.pdf']
  },
  {
    id: '2',
    title: 'Important Update: Document Verification',
    message: 'All pending forest rights applications in Kalahandi district will undergo verification next week. Please ensure all required documents are submitted by January 25th, 2024.',
    type: 'update',
    priority: 'high',
    coordinates: [20.0484, 83.1648],
    village: 'Kendupali',
    state: 'Odisha',
    district: 'Kalahandi',
    createdBy: 'District Forest Officer',
    createdAt: '2024-01-18T14:30:00Z',
    expiresAt: '2024-01-25T18:00:00Z',
    isActive: true,
    targetAudience: 'local'
  },
  {
    id: '4',
    title: 'Weather Warning: Heavy Rains Expected',
    message: 'Heavy rainfall is expected in the region for the next 3 days. Please take necessary precautions and avoid forest areas during this period.',
    type: 'warning',
    priority: 'high',
    coordinates: [19.1663, 83.4156],
    village: 'Jhirnia',
    state: 'Odisha',
    district: 'Rayagada',
    createdBy: 'Meteorological Department',
    createdAt: '2024-01-22T08:00:00Z',
    expiresAt: '2024-01-25T20:00:00Z',
    isActive: true,
    targetAudience: 'all'
  }
];