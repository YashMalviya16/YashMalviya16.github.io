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

export const experience = [
  {
    role: 'Data & AI Product Analyst',
    org: 'Commonwealth of Massachusetts · EOTSS',
    period: 'Aug 2025 – Present',
    points: [
      'Advanced Analytics pod: taking AI from idea to production on regulated, audited government data.',
      'Built Snowflake-based data infrastructure, geospatial analytics and operations-research optimization for public-sector decisions.',
      'Designed applied LLM and agentic systems on Snowflake Cortex, including a census data agent.',
    ],
  },
  {
    role: 'Research Assistant',
    org: 'Worcester Polytechnic Institute',
    period: 'Dec 2023 – May 2025',
    points: [
      'First-author published research on privacy-preserving synthetic data using GANs and diffusion models.',
    ],
  },
  {
    role: 'ML Researcher',
    org: 'Availity Clinical Solutions',
    period: 'Dec 2023 – Jan 2025',
    points: [
      'Built machine learning for healthcare under HIPAA.',
      'Generated 2M+ realistic synthetic electronic health records with under 2% statistical drift.',
    ],
  },
  {
    role: 'Data Scientist',
    org: 'Tata Consultancy Services',
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
    period: 'Aug 2023 – May 2025',
    detail: 'GPA 4.0 / 4.0. First-author publication in privacy-preserving generative AI.',
  },
  {
    degree: 'B.Tech in Computer Science and Engineering',
    school: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    period: 'Aug 2017 – May 2021',
    detail: 'GPA 9.0 / 10.',
  },
];

// category: 'ai' (Agentic & LLM), 'data' (Data & geospatial), 'research'
// art: which generated cover to draw when there is no image (see components/ProjectCover.jsx)
export const projects = [
  {
    id: 'census-agent',
    title: 'Census Data Agent',
    kicker: 'Snowflake Cortex AI · Agentic AI',
    category: 'ai',
    art: 'agent',
    summary: 'An AI agent built on Snowflake Cortex (Claude Sonnet) for querying and reasoning over census data.',
    details: [
      'Designed the architecture end to end.',
      'Produced technical documentation and architecture diagrams.',
      'Presented a code review to stakeholders.',
    ],
    tags: ['Snowflake Cortex', 'Claude Sonnet', 'Agentic orchestration'],
    link: null,
    linkLabel: 'Internal Commonwealth project',
  },
  {
    id: 'service-atlas',
    title: 'Service Atlas',
    kicker: 'Geospatial analytics & optimization',
    category: 'data',
    art: 'map',
    summary: 'A statewide dataset of service locations across Massachusetts, with optimization models for allocating childcare slots and grants.',
    details: [
      'Consolidated community action agencies, behavioral health, DMH, Head Start, schools and EEC childcare sources into Snowflake for Tableau dashboards.',
      'Built a linear program for childcare-slot allocation and a mixed-integer linear program for grant-to-town assignment.',
      'Debugged coordinate-system mismatches (WGS84, NAD83 / State Plane) and built fuzzy matching to link organizations to towns.',
    ],
    tags: ['Snowflake', 'SQL', 'Optimization', 'Tableau', 'Geospatial'],
    link: null,
    linkLabel: 'Internal Commonwealth project',
  },
  {
    id: 'itsm-analytics',
    title: 'ITSM Analytics',
    kicker: 'AI incident intelligence',
    category: 'ai',
    art: 'clusters',
    summary: 'NLP pipelines on ServiceNow incident data that surface systemic cost patterns invisible in native reporting.',
    details: [
      'Root-cause extraction, classification, sentiment and clustering on incident records in Snowflake.',
      'Powered by Snowflake Cortex and embeddings.',
    ],
    tags: ['Snowflake Cortex', 'NLP', 'Embeddings', 'Clustering'],
    link: null,
    linkLabel: 'Internal Commonwealth project',
  },
  {
    id: 'dula-manager',
    title: 'DULA Manager',
    kicker: 'Data governance tool',
    category: 'ai',
    art: 'document',
    summary: 'A local app for data-use agreement governance: PDF ingestion, automated extraction, risk scoring and network visualization.',
    details: [
      'Ingests data-use agreements as PDFs and extracts governance elements automatically.',
      'Scores risk and maps relationships in a network-visualization module.',
    ],
    tags: ['Streamlit', 'SQLite', 'PDF parsing', 'NLP'],
    link: null,
    linkLabel: 'Internal Commonwealth project',
  },
  {
    id: 'schools-maps',
    title: 'Massachusetts Schools Interactive Maps',
    kicker: 'Streamlit · Geospatial',
    category: 'data',
    art: 'pins',
    summary: 'Interactive map apps combining census demographics with school staffing data, with click-to-filter navigation.',
    details: [
      'Built with Streamlit and Plotly, using plotly-events for click-to-filter.',
      'Solved Snowflake network-access restrictions to render map tiles.',
    ],
    tags: ['Streamlit', 'Plotly', 'Geospatial', 'Snowflake'],
    link: null,
    linkLabel: 'Internal Commonwealth project',
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

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'beyond', label: 'Beyond' },
  { id: 'contact', label: 'Contact' },
];
