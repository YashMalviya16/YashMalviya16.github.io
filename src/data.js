// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Yash Malviya',
  role: 'Data & AI Product Analyst',
  org: 'Commonwealth of Massachusetts (EOTSS)',
  orgShort: 'Mass. EOTSS',
  tagline: 'I build production AI systems on real government data: LLM pipelines, agentic workflows, and the MLOps that keeps them running.',
  location: 'Boston, MA',
  email: 'ymalviya@wpi.edu', // TODO: switch to a personal email if the WPI address is no longer active
  phone: '(774) 232-5158',
  showPhone: true,
  resume: '/Yash-Malviya-Resume.pdf', // TODO: replace public/Yash-Malviya-Resume.pdf with your current résumé
  // Free key from https://web3forms.com (enter the email that should receive messages).
  // While empty, the contact form opens the visitor's email app instead of sending directly.
  web3formsKey: '',
  portrait: '/images/portrait.webp',
  // Optional background video for the hero (e.g. '/videos/hero.mp4' in public/videos).
  // Keep it short, muted-friendly and under ~4 MB. When empty, the animated network canvas is used.
  heroVideo: '',
  // Words that rotate in the hero headline.
  focus: ['LLM pipelines', 'agentic workflows', 'MLOps', 'geospatial analytics', 'synthetic data'],
  status: 'Currently at Mass. EOTSS',
  links: {
    linkedin: 'https://www.linkedin.com/in/yash-malviya-3a9a4b192/',
    github: 'https://github.com/YashMalviya16',
  },
};

export const about = {
  statement: 'I take AI from idea to production on data that is regulated, audited and consequential. I like problems where getting it right actually matters.',
  bio: [
    "I'm a Data & AI Product Analyst on the Advanced Analytics pod at Massachusetts EOTSS. My work spans Snowflake-based data infrastructure, geospatial analytics, applied LLM and agentic systems, and operations-research optimization for public-sector decisions.",
    'Before this I researched privacy-preserving synthetic data as a first author, built ML for healthcare under HIPAA, and forecast demand for a retail giant. I hold an M.S. in Data Science from Worcester Polytechnic Institute.',
  ],
  stats: [
    { value: '5+', label: 'years in data and AI' },
    { value: '2M+', label: 'synthetic health records generated' },
    { value: '4.0', label: 'GPA, M.S. Data Science (WPI)' },
  ],
  skills: [
    { group: 'Applied & agentic AI', items: ['LLMs', 'RAG', 'Agentic workflows', 'Semantic Kernel', 'Snowflake Cortex', 'NLP', 'Embeddings', 'GANs', 'Diffusion models'] },
    { group: 'MLOps & cloud', items: ['Docker', 'AWS (EC2, SageMaker, Lambda)', 'GitHub Actions', 'Snowflake Container Runtime', 'Azure ML', 'MLflow'] },
    { group: 'Data engineering', items: ['Snowflake', 'Medallion architecture', 'ETL', 'Spark', 'Airflow', 'Geospatial pipelines', 'RBAC governance'] },
    { group: 'Operations research', items: ['Linear programming', 'Mixed-integer programming', 'HiGHS solver', 'Sensitivity analysis'] },
    { group: 'Languages & ML', items: ['Python', 'SQL', 'R', 'PyTorch', 'TensorFlow', 'scikit-learn'] },
    { group: 'Design', items: ['Icon sets', 'Logo & brand concepts (SVG)', 'Presentation design'] },
  ],
};

// photo: your own photo of the organisation (office, campus, team, event), e.g. '/images/orgs/eotss.webp'.
// While null, the editorial site shows an orange tile with `short` instead.
export const experience = [
  {
    role: 'Data & AI Product Analyst',
    org: 'Commonwealth of Massachusetts · EOTSS',
    short: 'EOTSS',
    photo: '/images/orgs/eotss.webp',
    period: 'Aug 2025 – Present',
    points: [
      'Hired full-time after my WPI capstone on privacy-preserving synthetic data for EOTSS (featured in WPI News).',
      'Advanced Analytics pod: taking AI from idea to production on regulated, audited government data.',
      'Built Snowflake-based data infrastructure, geospatial analytics and operations-research optimization for public-sector decisions.',
      'Designed applied LLM and agentic systems on Snowflake Cortex, including a conversational data agent.',
    ],
  },
  {
    role: 'Research Assistant',
    org: 'Worcester Polytechnic Institute',
    short: 'WPI',
    photo: '/images/orgs/wpi.webp',
    period: 'Dec 2023 – May 2025',
    points: [
      'First-author published research on privacy-preserving synthetic data using GANs and diffusion models.',
    ],
  },
  {
    role: 'ML Researcher',
    org: 'Availity Clinical Solutions',
    short: 'Availity',
    photo: '/images/orgs/availity.webp',
    period: 'Dec 2023 – Jan 2025',
    points: [
      'Built machine learning for healthcare under HIPAA.',
      'Generated 2M+ realistic synthetic electronic health records with under 2% statistical drift.',
    ],
  },
  {
    role: 'Data Scientist',
    org: 'Tata Consultancy Services',
    short: 'TCS',
    photo: '/images/orgs/tcs.webp',
    period: 'Jun 2021 – Aug 2023',
    points: [
      'Forecast demand for a large retail client (Landmark Group).',
      'Built data visualisations and analytics that supported business decisions.',
    ],
  },
];

export const education = [
  {
    degree: 'M.S. in Data Science',
    school: 'Worcester Polytechnic Institute (WPI)',
    short: 'WPI',
    photo: '/images/orgs/wpi.webp',
    period: 'Aug 2023 – May 2025',
    detail: 'GPA 4.0 / 4.0. First-author publication in privacy-preserving generative AI.',
  },
];

// category: 'ai' (Agentic & LLM), 'data' (Data & geospatial), 'research'
// art: cover for the classic site (components/ProjectCover.jsx); gen: cover for the editorial site (editorial/GenCover.jsx)
// Government work is named by its tech stack, not its internal project name.
export const projects = [
  {
    id: 'llm-data-agent',
    title: 'LLM Data Agent on Snowflake Cortex',
    kicker: 'Agentic AI · Claude Sonnet · Snowflake Cortex',
    category: 'ai',
    art: 'agent',
    gen: 'agent',
    summary: 'A conversational AI agent that queries and reasons over large public demographic datasets in plain English.',
    details: [
      'Designed the agent architecture end to end on Snowflake Cortex with Claude Sonnet.',
      'Produced technical documentation and architecture diagrams.',
      'Presented a code review to stakeholders.',
    ],
    tags: ['Snowflake Cortex', 'Claude Sonnet', 'Agentic orchestration'],
    link: null,
    linkLabel: 'Public-sector project (internal)',
  },
  {
    id: 'geo-optimization',
    title: 'Geospatial Optimization Engine (LP + MILP)',
    kicker: 'Operations research · Snowflake · Tableau',
    category: 'data',
    art: 'map',
    gen: 'isomap',
    summary: 'A statewide service-location dataset with optimization models that allocate capacity and funding across towns.',
    details: [
      'Consolidated six public service-location sources (behavioral health, early education and childcare, schools and more) into Snowflake for Tableau dashboards.',
      'Built a linear program for capacity allocation and a mixed-integer linear program for funding-to-town assignment.',
      'Resolved coordinate-system mismatches (WGS84, NAD83 / State Plane) and built fuzzy matching to link organizations to towns.',
    ],
    tags: ['Snowflake', 'SQL', 'LP / MILP', 'Tableau', 'Geospatial'],
    link: null,
    linkLabel: 'Public-sector project (internal)',
  },
  {
    id: 'nlp-incident',
    title: 'NLP Incident Intelligence Pipeline',
    kicker: 'Snowflake Cortex · Embeddings · Clustering',
    category: 'ai',
    art: 'clusters',
    gen: 'pipeline',
    summary: 'LLM and NLP pipelines over IT service-desk tickets that surface systemic cost patterns invisible in standard reporting.',
    details: [
      'Root-cause extraction, classification, sentiment and clustering on incident records in Snowflake.',
      'Powered by Snowflake Cortex and text embeddings.',
    ],
    tags: ['Snowflake Cortex', 'NLP', 'Embeddings', 'Clustering'],
    link: null,
    linkLabel: 'Public-sector project (internal)',
  },
  {
    id: 'document-ai',
    title: 'Document AI for Data Governance',
    kicker: 'PDF extraction · NLP · Streamlit',
    category: 'ai',
    art: 'document',
    gen: 'document',
    summary: 'An app that reads data-sharing agreements, extracts their key terms automatically, scores risk and maps relationships.',
    details: [
      'Ingests agreements as PDFs and extracts governance elements automatically.',
      'Scores risk and maps relationships in a network-visualization module.',
    ],
    tags: ['Streamlit', 'SQLite', 'PDF parsing', 'NLP'],
    link: null,
    linkLabel: 'Public-sector project (internal)',
  },
  {
    id: 'geo-dashboards',
    title: 'Interactive Geospatial Dashboards',
    kicker: 'Streamlit · Plotly · Snowflake',
    category: 'data',
    art: 'pins',
    gen: 'dashboard',
    summary: 'Click-to-filter map apps that combine demographic and staffing data for fast, visual exploration.',
    details: [
      'Built with Streamlit and Plotly, using plotly-events for click-to-filter navigation.',
      'Solved Snowflake network-access restrictions to render map tiles.',
    ],
    tags: ['Streamlit', 'Plotly', 'Geospatial', 'Snowflake'],
    link: null,
    linkLabel: 'Public-sector project (internal)',
  },
  {
    id: 'synthetic-ehr',
    title: 'Synthetic EHR Generation',
    kicker: 'Published research · GANs · Diffusion',
    category: 'research',
    image: '/images/synthetic-ehr.webp',
    summary: 'First-author research: 2M+ privacy-preserving synthetic health records with under 2% statistical drift.',
    details: [
      'GAN- and diffusion-based generation of realistic electronic health records.',
      'Validated with chi-square tests and Wasserstein distance.',
      'Privacy protected with differential privacy.',
    ],
    tags: ['PyTorch', 'GANs', 'Diffusion models', 'Differential privacy'],
    link: null, // TODO: add the paper link (DOI or arXiv)
    linkLabel: 'First-author publication',
  },
  {
    id: 'job-agent',
    title: 'Agentic AI Job Applier',
    kicker: 'Independent · Agentic AI',
    category: 'ai',
    art: 'loop',
    gen: 'loop',
    summary: 'An autonomous job-application agent that perceives, decides and acts, with privacy-first, GDPR-conscious logging.',
    details: [
      'Perceive → decide → act loop built with Selenium and spaCy.',
      'Streamlit control panel.',
    ],
    tags: ['Python', 'Selenium', 'spaCy', 'Streamlit'],
    link: null, // TODO: add the GitHub link if the repo is public
  },
];

// Older projects, shown as a compact list under the featured gallery.
export const archive = [
  {
    id: 'medical-imaging',
    title: 'Medical imaging: pneumonia classification and liver tumour segmentation',
    kicker: 'Computer vision',
    category: 'research',
    image: '/images/medical-imaging.webp',
    summary: 'Imaging algorithms for pneumonia classification and liver tumour segmentation, aimed at more precise diagnostic evaluation.',
    details: ['Built classification and segmentation pipelines on U.S. National Institutes of Health imaging data.'],
    tags: ['Image segmentation', 'PyTorch', 'TensorFlow'],
    link: 'https://github.com/YashMalviya16/Medical-Imaging-US-National-Institutes-of-Health-',
  },
  {
    id: 'nyt-titles',
    title: 'New York Times headline generation',
    kicker: 'NLP',
    category: 'ai',
    image: '/images/nyt-titles.webp',
    summary: 'A sequence model that turns New York Times article abstracts into concise headlines.',
    details: [
      'Preprocessing: cleaning, tokenisation, stop-word handling and word embeddings.',
      'Model: RNN with LSTM units trained on paired abstracts and headlines.',
    ],
    tags: ['NLP', 'RNN', 'LSTM', 'Python'],
    link: null,
  },
  {
    id: 'maang-risk',
    title: 'Risk analysis and ROI prediction for MAANG stocks',
    kicker: 'Time series',
    category: 'data',
    image: '/images/maang-risk.webp',
    summary: 'Time-series risk analysis and return forecasting for Meta, Apple, Amazon, Netflix and Google stock.',
    details: ['Forecast performance with time-series models and a deep neural network.'],
    tags: ['Time series', 'Pandas', 'NumPy', 'DNN'],
    link: 'https://github.com/YashMalviya16/MAANG-Tech-Stocks-Risk-Analysis',
  },
  {
    id: 'retail-dashboard',
    title: 'Retail performance dashboard',
    kicker: 'Tableau',
    category: 'data',
    image: '/images/retail-dashboard.webp',
    summary: 'An executive Tableau dashboard covering sales trends, customer performance and product insights for a retail company.',
    details: ['Data prepared in Tableau Prep and Excel.'],
    tags: ['Tableau', 'Tableau Prep', 'Excel'],
    link: 'https://github.com/YashMalviya16/Sales-Analysis-',
  },
  {
    id: 'inventory',
    title: 'Inventory analysis',
    kicker: 'Tableau',
    category: 'data',
    image: '/images/inventory.webp',
    summary: 'Tableau analytics for inventory management: stock levels, demand planning and cost optimisation.',
    details: ['Statistical analysis and forecasting to support demand planning.'],
    tags: ['Tableau', 'Forecasting', 'Supply chain'],
    link: 'https://github.com/YashMalviya16/Inventory-analysis',
  },
  {
    id: 'funnel',
    title: 'Funnel analysis',
    kicker: 'Product analytics',
    category: 'data',
    image: '/images/funnel.webp',
    summary: 'Conversion-funnel analysis tracking where users drop off between stages.',
    details: ['Analysis in SQL and Python, reported in Tableau and Excel.'],
    tags: ['SQL', 'Python', 'Tableau'],
    link: 'https://github.com/YashMalviya16/Business-Intelligence-',
  },
];

export const leadership = [
  { role: 'Co-Convenor, Student Programs', org: 'Legacy 250 Initiative', detail: 'Nationwide educational campaign commemorating 250 years of American independence and India–US shared history.', when: '' },
  { role: 'Judge', org: 'Hack for Human Impact (WPI × Commonwealth of MA)', detail: '', when: 'Aug 2025' },
  { role: 'Event Coordinator', org: 'MIT Bitcoin Hackathon & Expo', detail: '', when: 'Apr 2025' },
  { role: 'Speaker', org: 'Commonwealth of MA × WPI', detail: '', when: 'Mar 2025' },
  { role: 'Designer', org: 'Creative side practice', detail: 'Icon systems, logo concepts and presentation design.', when: '' },
];

// ---- Editorial version extras ----

// "Impact in numbers". Figures come from your résumé and project write-ups; keep them accurate.
// value: prefix + number + suffix, e.g. '$1.2M', '35K', '99.89%', '<2%'. featured: shown as the big orange card.
export const kpis = [
  { value: '$1.2M', label: 'revenue generated', context: 'GAN models deployed on AWS at Availity', featured: true },
  { value: '2M+', label: 'synthetic health records', context: 'generated with under 2% statistical drift' },
  { value: '22%', label: 'better forecast accuracy', context: 'retail demand models at TCS' },
  { value: '18%', label: 'synthetic data quality lift', context: 'GANs in production at Availity' },
  { value: '25+', label: 'healthcare databases analysed', context: 'data quality and trend analysis' },
  { value: '35K', label: 'annotated medical images', context: 'pneumonia and tumour models, NIH data' },
  { value: '40+', label: 'research papers reviewed', context: 'in 5 months of synthetic-data research' },
  { value: '99.89%', label: 'clean synthetic data', context: 'diffusion model with a binary-matrix step' },
  { value: '10+', label: 'engineers collaborated with', context: 'data science and DevOps teams' },
  { value: '5+', label: 'years in data and AI', context: 'government, healthcare and retail' },
  { value: '6', label: 'statewide data sources unified', context: 'geospatial optimization for the Commonwealth' },
  { value: '35+', label: 'tools and frameworks', context: 'LLMs to MLOps, Snowflake to Tableau' },
  { value: '4.0', label: 'GPA, M.S. Data Science', context: 'Worcester Polytechnic Institute' },
];

// Shown as a wordmark strip under the hero (plain text, not logos).
export const organizations = [
  'Commonwealth of Massachusetts',
  'Worcester Polytechnic Institute',
  'Availity',
  'Tata Consultancy Services',
  'Landmark Group',
];

// "How I work" cards. TODO: reword in your own voice.
export const process = [
  { title: 'Frame the decision', text: 'Start from the decision the data has to support, and the rules it has to respect.' },
  { title: 'Build the foundation', text: 'Governed Snowflake pipelines, medallion layers and RBAC, so the data can be trusted.' },
  { title: 'Model & automate', text: 'LLMs, agents, optimization or classic ML: whichever actually fits the problem.' },
  { title: 'Ship & sustain', text: 'MLOps, documentation and stakeholder reviews, so it keeps running after launch.' },
];

// Press coverage, shown as a featured card at the top of "Honors & community" and linked from the hero.
export const press = [
  {
    outlet: 'WPI News',
    date: 'August 5, 2025',
    title: 'From Classroom to the Commonwealth: WPI Graduate Students Land Roles at Mass. Tech Agency After Project Success',
    url: 'https://www.wpi.edu/news/announcements/classroom-commonwealth-wpi-graduate-students-land-roles-mass-tech-agency-after-project-success',
    summary: "WPI profiled our Graduate Qualifying Project: privacy-preserving synthetic data generation for the Massachusetts Executive Office of Technology Services and Security. The work led EOTSS to hire all three of us full-time as Data & AI Product Analysts.",
    quote: { text: 'Their success wasn’t just academic—it was transformative.', by: 'Fatemeh Emdad, Teaching Professor of Data Science, WPI' },
    image: '/images/orgs/wpi.webp',
  },
];

// photo: optional proof photo (see scripts/org-photos.mjs); focus: CSS object-position for the thumbnail crop.
export const achievements = [
  {
    title: 'Co-Convenor, Student Programs', meta: 'Legacy 250 Initiative', kind: 'Leadership', year: '',
    photo: '/images/highlights/legacy250.webp', focus: '50% 97%',
    caption: 'Shared Legacy USA–India 250 at the Minuteman statue, Lexington Battle Green',
  },
  {
    title: 'Judge, Hack for Human Impact', meta: 'WPI × Commonwealth of MA', kind: 'Hackathon', year: '2025',
    photo: '/images/highlights/hack-for-human-impact.webp', focus: '50% 45%',
    caption: 'Hack for Human Impact innovation sprint, with EOTSS, the MA AI Hub and WPI',
  },
  {
    title: 'Speaker', meta: 'Commonwealth of MA × WPI', kind: 'Talk', year: '2025',
    photo: '/images/highlights/speaker-commonwealth-wpi.webp', focus: '70% 50%',
    caption: 'Presenting project deliverables to Commonwealth stakeholders',
  },
  {
    title: 'Event Coordinator', meta: 'MIT Bitcoin Hackathon & Expo', kind: 'Community', year: '2025',
    photo: '/images/highlights/mit-bitcoin.webp', focus: '50% 40%',
    caption: 'With the organising team at the MIT Bitcoin Hackathon & Expo',
  },
  { title: 'First-author publication', meta: 'Privacy-preserving synthetic EHR', kind: 'Research', year: '' },
  { title: '4.0 GPA', meta: 'M.S. Data Science, WPI', kind: 'Academic', year: '2025' },
];

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'beyond', label: 'Beyond' },
  { id: 'contact', label: 'Contact' },
];
