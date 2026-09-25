// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Yash Malviya',
  role: 'Data Scientist',
  tagline: 'Generative AI and machine learning for healthcare and business analytics.',
  location: 'Worcester, MA, USA',
  email: 'ymalviya@wpi.edu',
  phone: '(774) 232-5158',
  showPhone: true,
  resume: '/Yash-Malviya-Resume.pdf',
  // Free key from https://web3forms.com (enter the email that should receive messages).
  // While empty, the contact form opens the visitor's email app instead of sending directly.
  web3formsKey: '',
  portrait: '/images/portrait.webp',
  // Optional background video for the hero (e.g. '/videos/hero.mp4' in public/videos).
  // Keep it short, muted-friendly and under ~4 MB. When empty, the animated network canvas is used.
  heroVideo: '',
  // Words that rotate in the hero headline.
  focus: ['machine learning', 'generative AI', 'healthcare data', 'business intelligence'],
  links: {
    linkedin: 'https://www.linkedin.com/in/yash-malviya-3a9a4b192/',
    github: 'https://github.com/YashMalviya16',
  },
};

export const about = {
  statement: 'I turn messy real-world data into models people can trust, from synthetic patient records generated with GANs to dashboards that executive boards act on.',
  bio: [
    'I am a data scientist working across machine learning, deep learning and business intelligence. I hold an MS in Data Science from Worcester Polytechnic Institute and a B.Tech in Computer Science and Engineering.',
    'As an AI Research Assistant at WPI I worked on confidential industry research, building generative models that produce realistic synthetic healthcare records. Before that I spent two years at TCS applying machine learning to retail operations for Landmark Group.',
  ],
  stats: [
    { value: '3+', label: 'years in industry and research' },
    { value: '4.0', label: 'GPA, MS Data Science (WPI)' },
    { value: '7', label: 'featured projects' },
  ],
  skills: [
    { group: 'Machine learning', items: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'Time series', 'NLP'] },
    { group: 'Generative AI', items: ['GANs', 'Diffusion models', 'Synthetic data', 'LSTM / RNN'] },
    { group: 'Data & BI', items: ['SQL', 'Pandas', 'Tableau', 'Tableau Prep', 'Excel', 'ELK / Kibana'] },
    { group: 'Cloud & MLOps', items: ['AWS', 'Azure', 'Hadoop', 'MLOps'] },
  ],
};

export const experience = [
  {
    role: 'AI Research Assistant',
    org: 'Worcester Polytechnic Institute Â· Availity Fusion',
    period: 'Aug 2023 â€“ Present', // TODO: update end date if this role has ended
    points: [
      'Built healthcare research analytics with Availity Clinical Solutions (formerly Diameter Health).',
      'Designed and implemented generative adversarial networks that replicate real-world healthcare data.',
      'Led a team streamlining electronic health record (EHR) exchange across healthcare agencies.',
    ],
  },
  {
    role: 'Data Scientist',
    org: 'Tata Consultancy Services Â· Landmark Group',
    period: 'Jun 2021 â€“ Jul 2023',
    points: [
      'Applied machine learning models to improve retail business performance.',
      'Introduced AI-based optimisation strategies and accelerated purchase-order workflows.',
      'Built data visualisations that supported data-driven decisions across the business.',
    ],
  },
  {
    role: 'Associate Software Engineer (Intern)',
    org: 'Xoriant',
    period: 'Feb 2021 â€“ Jun 2021',
    points: [
      'Deployed ELK Stack dashboards and built data visualisations.',
      'Designed Kibana alerts that improved anomaly-detection accuracy.',
    ],
  },
];

export const education = [
  {
    degree: 'MS in Data Science',
    school: 'Worcester Polytechnic Institute (WPI)',
    period: 'Aug 2023 â€“ May 2025',
    detail: 'GPA 4.0 / 4.0. Statistics for Data Science, Big Data Management, Machine Learning, Natural Language Processing, Directed Research.',
  },
  {
    degree: 'B.Tech in Computer Science and Engineering',
    school: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    period: 'Aug 2017 â€“ May 2021',
    detail: 'GPA 9.0 / 10. Computer science fundamentals, software engineering and applied AI.',
  },
];

// category: 'ai' (AI / ML) or 'bi' (BI / Analytics)
export const projects = [
  {
    id: 'synthetic-ehr',
    title: 'Synthetic EHR generation with GANs and diffusion models',
    category: 'ai',
    image: '/images/synthetic-ehr.webp',
    summary: 'Novel generative AI methods that produce realistic synthetic healthcare records for research without exposing patient data.',
    details: [
      'Confidential industry research at WPI with Availity Fusion.',
      'Developed GAN and diffusion-model approaches for generating synthetic patient records.',
      'The code is in a private repository. Access is available on request.',
    ],
    tags: ['PyTorch', 'Generative AI', 'Time series', 'MLOps'],
    link: null,
    linkLabel: 'Private repository',
  },
  {
    id: 'medical-imaging',
    title: 'Medical imaging: pneumonia classification and liver tumour segmentation',
    category: 'ai',
    image: '/images/medical-imaging.webp',
    summary: 'Imaging algorithms for pneumonia classification and liver tumour segmentation, aimed at more precise diagnostic evaluation.',
    details: [
      'Built classification and segmentation pipelines on U.S. National Institutes of Health imaging data.',
    ],
    tags: ['Image segmentation', 'PyTorch', 'TensorFlow'],
    link: 'https://github.com/YashMalviya16/Medical-Imaging-US-National-Institutes-of-Health-',
  },
  {
    id: 'nyt-titles',
    title: 'New York Times headline generation',
    category: 'ai',
    image: '/images/nyt-titles.webp',
    summary: 'A sequence model that turns New York Times article abstracts into concise headlines.',
    details: [
      'Preprocessing: cleaning, tokenisation, stop-word handling and word embeddings.',
      'Model: RNN with LSTM units trained on paired abstracts and headlines.',
      'Evaluation: accuracy, precision, recall and F1 score.',
    ],
    tags: ['NLP', 'RNN', 'LSTM', 'Python'],
    link: null,
  },
  {
    id: 'maang-risk',
    title: 'Risk analysis and ROI prediction for MAANG stocks',
    category: 'ai',
    image: '/images/maang-risk.webp',
    summary: 'Time-series risk analysis and return forecasting for Meta, Apple, Amazon, Netflix and Google stock.',
    details: [
      'Measured volatility and risk against expected return for each stock.',
      'Forecast performance with time-series models and a deep neural network.',
    ],
    tags: ['Time series', 'Pandas', 'NumPy', 'DNN'],
    link: 'https://github.com/YashMalviya16/MAANG-Tech-Stocks-Risk-Analysis',
  },
  {
    id: 'retail-dashboard',
    title: 'Retail performance dashboard',
    category: 'bi',
    image: '/images/retail-dashboard.webp',
    summary: 'An executive Tableau dashboard covering 2022 sales trends, customer performance and product insights for a retail company.',
    details: [
      'Data prepared in Tableau Prep and Excel.',
      'Interactive views let the executive board drill into the metrics behind each decision.',
    ],
    tags: ['Tableau', 'Tableau Prep', 'Excel'],
    link: 'https://github.com/YashMalviya16/Sales-Analysis-',
  },
  {
    id: 'inventory',
    title: 'Inventory analysis',
    category: 'bi',
    image: '/images/inventory.webp',
    summary: 'Tableau analytics for inventory management: stock levels, demand planning and cost optimisation.',
    details: [
      'Statistical analysis and forecasting to support demand planning.',
      'Built for supply-chain managers and business analysts.',
    ],
    tags: ['Tableau', 'Forecasting', 'Supply chain', 'Excel'],
    link: 'https://github.com/YashMalviya16/Inventory-analysis',
  },
  {
    id: 'funnel',
    title: 'Funnel analysis',
    category: 'bi',
    image: '/images/funnel.webp',
    // TODO: replace with a specific description (dataset, main finding, impact).
    summary: 'Conversion-funnel analysis tracking where users drop off between stages, with visual reporting of the results.',
    details: [
      'Analysis in SQL and Python (Pandas, Matplotlib, Seaborn).',
      'Results reported in Tableau and Excel.',
    ],
    tags: ['SQL', 'Python', 'Tableau', 'Product analytics'],
    link: 'https://github.com/YashMalviya16/Business-Intelligence-',
  },
];

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];
