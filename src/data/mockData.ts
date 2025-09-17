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
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
      'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
      'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda',
      'Hoshangabad (Narmadapuram)', 'Indore', 'Jabalpur', 'Jhabua', 'Katni',
      'Khandwa (East Nimar)', 'Khargone (West Nimar)', 'Mandla', 'Mandsaur',
      'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh',
      'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur',
      'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria',
      'Vidisha', 'Chachaura', 'Maihar', 'Nagda'
    ]
  },
  {
    name: 'Odisha',
    districts: [
      'Angul', 'Balangir', 'Balasore (Baleswar)', 'Bargarh', 'Bhadrak', 'Boudh',
      'Cuttack', 'Deogarh (Debagarh)', 'Dhenkanal', 'Gajapati', 'Ganjam',
      'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal',
      'Kendrapara', 'Keonjhar (Kendujhar)', 'Khordha', 'Koraput', 'Malkangiri',
      'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada',
      'Sambalpur', 'Subarnapur (Sonepur)', 'Sundargarh'
    ]
  },
  {
    name: 'Telangana',
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial',
      'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy',
      'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad',
      'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal–Malkajgiri', 'Mulugu',
      'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad',
      'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet',
      'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ]
  },
  {
    name: 'Tripura',
    districts: [
      'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala',
      'South Tripura', 'Unakoti', 'West Tripura'
    ]
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

export interface ForestArea {
  id: string;
  name: string;
  type: 'National Park' | 'Wildlife Sanctuary' | 'Reserve Forest' | 'Protected Forest' | 'Community Forest' | 'Forest Range';
  state: string;
  district: string;
  coordinates: [number, number];
  area: number; // in hectares
  forestCover: number; // percentage
  biodiversity: 'High' | 'Medium' | 'Low';
  protectionStatus: 'Protected' | 'Semi-Protected' | 'Community Managed';
  establishedYear: number;
  description: string;
  threats: string[];
  conservationMeasures: string[];
  lastSurvey: string;
  isActive: boolean;
}

export const mockForestAreas: ForestArea[] = [
  {
    id: '1',
    name: 'Similipal National Park',
    type: 'National Park',
    state: 'Odisha',
    district: 'Mayurbhanj',
    coordinates: [21.7500, 86.3333],
    area: 2750,
    forestCover: 85,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1980,
    description: 'Famous for its tiger reserve and diverse wildlife including elephants, leopards, and various bird species.',
    threats: ['Poaching', 'Habitat fragmentation', 'Human-wildlife conflict'],
    conservationMeasures: ['Anti-poaching patrols', 'Community awareness programs', 'Habitat restoration'],
    lastSurvey: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'Karlapat Wildlife Sanctuary',
    type: 'Wildlife Sanctuary',
    state: 'Odisha',
    district: 'Kalahandi',
    coordinates: [19.1663, 83.4156],
    area: 175,
    forestCover: 78,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1992,
    description: 'Home to various wildlife species including elephants, leopards, and numerous bird species.',
    threats: ['Mining activities', 'Deforestation', 'Illegal logging'],
    conservationMeasures: ['Regular patrolling', 'Community engagement', 'Eco-tourism development'],
    lastSurvey: '2024-01-10',
    isActive: true
  },
  {
    id: '3',
    name: 'Bamra-Gangpur Forest',
    type: 'Forest Range',
    state: 'Odisha',
    district: 'Sambalpur',
    coordinates: [21.4667, 83.9833],
    area: 1250,
    forestCover: 72,
    biodiversity: 'Medium',
    protectionStatus: 'Semi-Protected',
    establishedYear: 1950,
    description: 'Mixed deciduous forest with significant teak and sal plantations.',
    threats: ['Illegal logging', 'Encroachment', 'Fire incidents'],
    conservationMeasures: ['Fire prevention measures', 'Community forest management', 'Reforestation programs'],
    lastSurvey: '2024-01-08',
    isActive: true
  },
  {
    id: '4',
    name: 'Dhenkanal Forest Range',
    type: 'Forest Range',
    state: 'Odisha',
    district: 'Dhenkanal',
    coordinates: [20.6667, 85.6000],
    area: 890,
    forestCover: 68,
    biodiversity: 'Medium',
    protectionStatus: 'Semi-Protected',
    establishedYear: 1960,
    description: 'Tropical dry deciduous forest with mixed species composition.',
    threats: ['Agricultural expansion', 'Grazing pressure', 'Climate change'],
    conservationMeasures: ['Sustainable forest management', 'Water conservation', 'Biodiversity monitoring'],
    lastSurvey: '2024-01-12',
    isActive: true
  },
  {
    id: '5',
    name: 'Sitabinji Forest Range',
    type: 'Forest Range',
    state: 'Odisha',
    district: 'Keonjhar',
    coordinates: [21.6333, 85.5833],
    area: 650,
    forestCover: 75,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1975,
    description: 'Rich biodiversity hotspot with ancient rock paintings and diverse flora.',
    threats: ['Mining activities', 'Tourism pressure', 'Pollution'],
    conservationMeasures: ['Heritage site protection', 'Eco-tourism regulation', 'Pollution control'],
    lastSurvey: '2024-01-05',
    isActive: true
  },
  {
    id: '6',
    name: 'Kanha National Park',
    type: 'National Park',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    coordinates: [22.1667, 80.6167],
    area: 1945,
    forestCover: 90,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1955,
    description: 'Famous for its tiger population and diverse wildlife including barasingha, leopards, and various bird species.',
    threats: ['Tourism pressure', 'Habitat fragmentation', 'Climate change'],
    conservationMeasures: ['Tiger conservation programs', 'Eco-tourism management', 'Habitat restoration'],
    lastSurvey: '2024-01-18',
    isActive: true
  },
  {
    id: '7',
    name: 'Pench National Park',
    type: 'National Park',
    state: 'Madhya Pradesh',
    district: 'Chhindwara',
    coordinates: [21.7000, 79.3000],
    area: 758,
    forestCover: 88,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1975,
    description: 'Inspiration for Rudyard Kipling\'s "The Jungle Book", known for its tiger and leopard population.',
    threats: ['Human-wildlife conflict', 'Poaching', 'Habitat loss'],
    conservationMeasures: ['Anti-poaching units', 'Community awareness', 'Wildlife corridor protection'],
    lastSurvey: '2024-01-14',
    isActive: true
  },
  {
    id: '8',
    name: 'Kothagudem Forest Range',
    type: 'Forest Range',
    state: 'Telangana',
    district: 'Khammam',
    coordinates: [17.5512, 80.6177],
    area: 450,
    forestCover: 65,
    biodiversity: 'Medium',
    protectionStatus: 'Semi-Protected',
    establishedYear: 1985,
    description: 'Mixed forest with significant bamboo and teak plantations.',
    threats: ['Mining activities', 'Urban expansion', 'Water scarcity'],
    conservationMeasures: ['Water conservation', 'Sustainable mining practices', 'Urban planning integration'],
    lastSurvey: '2024-01-11',
    isActive: true
  },
  {
    id: '9',
    name: 'Gomati Wildlife Sanctuary',
    type: 'Wildlife Sanctuary',
    state: 'Tripura',
    district: 'Gomati',
    coordinates: [23.5000, 91.5000],
    area: 389,
    forestCover: 82,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1988,
    description: 'Tropical evergreen forest with rich biodiversity and various endangered species.',
    threats: ['Deforestation', 'Illegal logging', 'Climate change'],
    conservationMeasures: ['Strict protection', 'Community conservation', 'Research programs'],
    lastSurvey: '2024-01-09',
    isActive: true
  },
  {
    id: '10',
    name: 'Trishna Wildlife Sanctuary',
    type: 'Wildlife Sanctuary',
    state: 'Tripura',
    district: 'Dhalai',
    coordinates: [23.8315, 91.2862],
    area: 195,
    forestCover: 85,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1988,
    description: 'Known for its bison population and diverse bird species.',
    threats: ['Habitat fragmentation', 'Poaching', 'Invasive species'],
    conservationMeasures: ['Wildlife monitoring', 'Anti-poaching patrols', 'Invasive species control'],
    lastSurvey: '2024-01-07',
    isActive: true
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