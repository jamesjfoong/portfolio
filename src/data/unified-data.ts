import type { PersonalData } from '@/types'
import {
  ExperienceType,
  MediaType,
  ProjectCategory,
  ProjectStatus,
  SkillLevel,
  SocialPlatform,
  TechCategory,
} from '@/types/enums'

const personalData: PersonalData = {
  name: 'James Jeremy Foong',
  title: 'Senior Software Development Engineer',
  location: 'Surabaya, Indonesia',
  email: 'jamesjfoong2000@gmail.com',
  bio: `
    <p>A <span class="font-medium text-slate-200">Senior Software Development Engineer</span> based in Surabaya, Indonesia. I hold a Bachelor's degree in <span class="font-medium text-slate-200">Computer Science</span> from <span class="font-medium text-slate-200">Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)</span>, where I graduated with a GPA of 3.99. My final project focused on <span class="font-medium text-slate-200">Facial Expression Recognition using Deep Temporal Appearance Geometry Network</span>, highlighting my expertise in artificial intelligence and advanced computational techniques.</p><br />

    <p>At <span class="font-medium text-slate-200">GDP Labs</span>, I've developed high-impact internal applications, revamped landing pages, and mentored interns, leveraging my skills in <span class="font-medium text-slate-200">web development</span>, <span class="font-medium text-slate-200">AI</span>, and <span class="font-medium text-slate-200">various modern frameworks</span>. My stint at <span class="font-medium text-slate-200">Jojobug</span> in Singapore enhanced my fullstack development capabilities, with hands-on experience in <span class="font-medium text-slate-200">Next.js</span>, <span class="font-medium text-slate-200">Node.js</span>, and <span class="font-medium text-slate-200">Firebase</span>, among other technologies.</p><br />

    <p>I am passionate about <span class="font-medium text-slate-200">creating user-friendly</span>, <span class="font-medium text-slate-200">responsive interfaces</span> and <span class="font-medium text-slate-200">believe in the power of technology to solve complex problems</span>. I strive to make a meaningful impact through my work and am always <span class="font-medium text-slate-200">eager to learn</span> and <span class="font-medium text-slate-200">take on new challenges</span>.</p><br />
  `,
  socials: [
    {
      platform: SocialPlatform.LINKEDIN,
      username: 'james-j-foong',
      url: 'https://www.linkedin.com/in/james-j-foong/',
    },
    {
      platform: SocialPlatform.GITHUB,
      username: 'jamesjfoong',
      url: 'https://www.github.com/jamesjfoong',
    },
  ],
  education: {
    university: 'Institut Sains dan Teknologi Terpadu Surabaya',
    degree: 'Bachelor of Informatics',
    concentration: 'Computer Science',
    minor: 'Interaction Design',
    graduation: 'August 2022',
    gpa: 3.99,
  },
  experiences: [
    {
      id: 'gdp-labs-senior',
      role: 'Senior Software Development Engineer',
      company: 'GDP Labs',
      location: 'Jakarta, Indonesia',
      type: ExperienceType.FULL_TIME,
      startDate: '2024-01',
      current: true,
      description:
        'Build and maintain critical components for internal applications, focusing on web accessibility and performance optimization.',
      achievements: [
        'Developed an automated Google Chat extraction tool that generates weekly discussion reports - received Employee Special Recognition in May 2025',
        'Created HelpGPT, an AI-powered tool that automated responses for Help Center, reducing questions directed to customer service by 30%',
        'Led the front-end development of CATAPA, implementing multi-company and login/register functionality with comprehensive style guide',
        'Implemented end-to-end tests for CATAPA front end, significantly reducing reported bugs',
        'Developed a data migration tool using Nest.js, RabbitMQ, and PostgreSQL for large-scale enterprise data migration',
      ],
      technologies: [
        {
          name: 'Angular',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'NgRx',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Jest',
          category: TechCategory.TESTING,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Cypress',
          category: TechCategory.TESTING,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Nest.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Python',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'React Native',
          category: TechCategory.MOBILE,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
    },
    {
      id: 'gdp-labs-sde',
      role: 'Software Development Engineer',
      company: 'GDP Labs',
      location: 'Jakarta, Indonesia',
      type: ExperienceType.FULL_TIME,
      startDate: '2022-10',
      endDate: '2024-01',
      current: false,
      description:
        'Develop high-quality websites, design systems, and digital experiences for various clients.',
      achievements: [
        'Built responsive web applications using modern frameworks',
        'Implemented comprehensive design systems',
        'Optimized application performance and SEO',
      ],
      technologies: [
        {
          name: 'Angular',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Webflow',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
    },
    {
      id: 'jojobug-intern',
      role: 'Full Stack Software Engineer Intern',
      company: 'Jojobug Tech Pte. Ltd.',
      location: 'Singapore',
      type: ExperienceType.INTERNSHIP,
      startDate: '2022-04',
      endDate: '2022-10',
      current: false,
      description:
        'Served as a Frontend Software Engineer, contributing my skills to enhance the overall user experience and functionality of web applications. Engaging in collaborative development, I played a crucial role in translating design concepts into responsive and user-friendly interfaces.',
      achievements: [
        'Helped accelerate the development of client landing pages using Next.js, resulting in a 30% increase in client acquisition',
        'Developed responsive web applications with modern frameworks',
        'Collaborated with design team to implement pixel-perfect interfaces',
      ],
      technologies: [
        {
          name: 'React',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Next.js',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Firebase',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Node.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Tailwind CSS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'GSAP',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
    },
    {
      id: 'buana-megah-dev',
      role: 'Web Developer',
      company: 'PT. Buana Megah',
      location: 'Surabaya, Indonesia',
      type: ExperienceType.CONTRACT,
      startDate: '2021-07',
      endDate: '2021-12',
      current: false,
      description:
        'Developed an internal employee time tracker and streamlined the payroll process.',
      achievements: [
        'Built internal employee time tracking system',
        'Streamlined payroll process automation',
        'Improved operational efficiency',
      ],
      technologies: [
        {
          name: 'Laravel Lumen',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'PHP',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'MySQL',
          category: TechCategory.DATABASE,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
    },
    {
      id: 'istts-lab-assistant',
      role: 'Laboratory Assistant',
      company: 'Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)',
      location: 'Surabaya, Indonesia',
      type: ExperienceType.PART_TIME,
      startDate: '2020-01',
      endDate: '2022-08',
      current: false,
      description:
        'Taught, conducted, graded, and created educational materials for practicum sessions. Subjects include Data Structures, Algorithms, and Object-Oriented Programming.',
      achievements: [
        'Mentored 100+ students in programming fundamentals',
        'Created comprehensive educational materials',
        'Improved student understanding of complex algorithms',
      ],
      technologies: [
        {
          name: 'C++',
          category: TechCategory.BACKEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Java',
          category: TechCategory.BACKEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'JavaScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'PHP',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'MySQL',
          category: TechCategory.DATABASE,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Laravel',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
    },
  ],
  projects: [
    {
      id: 'github-pr-review-mcp',
      slug: 'github-pr-review-mcp',
      title: 'GitHub PR Review MCP',
      shortDescription:
        'An AI-powered GitHub automation tool with 8 specialized tools for PR review workflows.',
      fullDescription:
        'An AI-powered GitHub automation tool with 8 specialized tools for PR review workflows. Streamlines code review processes and improves development efficiency through intelligent automation and analysis.',
      category: ProjectCategory.AI_ML,
      status: ProjectStatus.COMPLETED,
      year: '2025',
      startDate: '2025-08',
      endDate: '2025-09',
      technologies: [
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Node.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'GitHub API',
          category: TechCategory.BACKEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'AI/ML',
          category: TechCategory.AI_ML,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Automated PR analysis and review',
        '8 specialized review tools',
        'Integration with GitHub workflows',
        'AI-powered code suggestions',
        'Performance optimization recommendations',
      ],
      challenges: [
        'Integrating with GitHub API efficiently',
        'Building reliable AI analysis tools',
        'Handling various code patterns and languages',
      ],
      solutions: [
        'Implemented robust API handling with rate limiting',
        'Used advanced AI models for code analysis',
        'Created flexible pattern matching system',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/coding.svg',
        gallery: ['/projects/coding.svg'],
      },
      links: {
        live: 'https://github.com/jamesjfoong/github-pr-review-mcp',
        github: 'https://github.com/jamesjfoong/github-pr-review-mcp',
      },
      metrics: {
        impact: 'Improved code review efficiency by 60%',
        github_stars: 25,
      },
    },
    {
      id: 'groq-commit',
      slug: 'groq-commit',
      title: 'groq-commit',
      shortDescription:
        'An NPM package with AI-powered CLI tools that automate Git workflows and generate intelligent commit messages.',
      fullDescription:
        'An NPM package with AI-powered CLI tools that automate Git workflows and generate intelligent commit messages. Enhances developer productivity by providing smart commit message generation and workflow automation.',
      category: ProjectCategory.DEVELOPER_TOOLS,
      status: ProjectStatus.COMPLETED,
      year: '2025',
      startDate: '2025-01',
      endDate: '2025-02',
      technologies: [
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Node.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'CLI',
          category: TechCategory.DEVELOPER_TOOLS,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'AI/ML',
          category: TechCategory.AI_ML,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'AI-powered commit message generation',
        'Git workflow automation',
        'CLI interface for easy usage',
        'Customizable commit templates',
        'Integration with popular Git workflows',
      ],
      challenges: [
        'Creating intelligent commit message analysis',
        'Building user-friendly CLI interface',
        'Ensuring compatibility across different Git workflows',
      ],
      solutions: [
        'Implemented advanced NLP for commit analysis',
        'Used modern CLI frameworks for better UX',
        'Created flexible configuration system',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/coding.svg',
        gallery: ['/projects/coding.svg'],
      },
      links: {
        live: 'https://www.npmjs.com/package/groq-commit',
        github: 'https://github.com/jamesjfoong/groq-commit',
      },
      metrics: {
        impact: 'Reduced commit message writing time by 70%',
        users: 500,
      },
    },
    {
      id: 'catapa-landing-page',
      slug: 'catapa-landing-page',
      title: 'CATAPA Landing Page',
      shortDescription:
        'A comprehensive landing page with features like user registration, payment processing, and a blog CMS.',
      fullDescription:
        'A comprehensive landing page with features like user registration, payment processing, and a blog CMS. Built with modern web technologies for optimal performance and user experience.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2024',
      startDate: '2023-10',
      endDate: '2024-02',
      technologies: [
        {
          name: 'Angular',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Webflow',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'CMS',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'User registration and authentication',
        'Payment processing integration',
        'Blog CMS functionality',
        'Responsive design',
        'SEO optimization',
      ],
      challenges: [
        'Integrating multiple complex systems',
        'Ensuring secure payment processing',
        'Building scalable CMS architecture',
      ],
      solutions: [
        'Used modular architecture for better maintainability',
        'Implemented industry-standard security practices',
        'Created flexible content management system',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/catapa-landing-page.png',
        gallery: ['/projects/catapa-landing-page.png'],
      },
      links: {
        live: 'https://catapa.com',
      },
      metrics: {
        impact: 'Streamlined payroll process for 500+ companies',
        users: 2500,
      },
    },
    {
      id: 'safemoon-clone',
      slug: 'safemoon-clone',
      title: 'Safemoon Clone',
      shortDescription:
        'A modern cryptocurrency landing page clone built with Next.js and Web3 integration.',
      fullDescription:
        'A complete clone of the Safemoon cryptocurrency website, featuring modern design, Web3 wallet integration, and real-time cryptocurrency data. Built with Next.js and Tailwind CSS for optimal performance.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2023',
      startDate: '2023-03',
      endDate: '2023-04',
      technologies: [
        {
          name: 'Next.js',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Tailwind CSS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Web3',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Metamask',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Uniswap',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Web3 wallet integration',
        'Real-time cryptocurrency prices',
        'Responsive design',
        'Interactive animations',
        'Token swap functionality',
      ],
      challenges: [
        'Integrating Web3 wallet connections',
        'Handling real-time price updates',
        'Creating smooth animations',
      ],
      solutions: [
        'Used Web3Modal for seamless wallet integration',
        'Implemented WebSocket connections for live data',
        'Utilized Framer Motion for performance-optimized animations',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/safemoon-clone.png',
        gallery: ['/projects/safemoon-clone.png'],
      },
      links: {
        live: 'https://safemoon-clone.vercel.app',
        github: 'https://github.com/jamesjfoong/safemoon-clone',
      },
      metrics: {
        github_stars: 15,
        users: 1200,
      },
    },
    {
      id: 'jojobug-new-landing-page',
      slug: 'jojobug-landing-page',
      title: 'Jojobug New Landing Page',
      shortDescription:
        'Modern landing page for a web development agency with smooth animations and interactive elements.',
      fullDescription:
        "A complete redesign of Jojobug web development agency landing page, featuring modern design principles, smooth GSAP animations, and interactive elements that showcase the company's capabilities.",
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2022',
      startDate: '2022-04',
      endDate: '2022-10',
      technologies: [
        {
          name: 'React',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Next.js',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Firebase',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Node.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Tailwind CSS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'GSAP',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
      ],
      features: [
        'Smooth scroll animations',
        'Interactive portfolio showcase',
        'Contact form integration',
        'SEO optimized',
        'Mobile responsive design',
      ],
      challenges: [
        'Creating smooth animations without performance impact',
        'Implementing complex scroll-triggered animations',
        'Optimizing for various screen sizes',
      ],
      solutions: [
        'Used GSAP ScrollTrigger for performance-optimized animations',
        'Implemented intersection observer for better performance',
        'Created responsive animation system',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/jojobug-new-landing-page.png',
        gallery: ['/projects/jojobug-new-landing-page.png'],
      },
      links: {
        live: 'https://jojobug.com',
      },
      metrics: {
        impact: 'Increased conversion rates by 20%',
        users: 5000,
      },
    },
    {
      id: 'jojobug-blog',
      slug: 'jojobug-blog',
      title: 'Jojobug Blog',
      shortDescription:
        'A modern blog platform with CMS integration and responsive design.',
      fullDescription:
        'Designed and developed a new blog platform that increased engagement rates by 20%. Built with modern web technologies and integrated content management system.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2022',
      startDate: '2022-06',
      endDate: '2022-09',
      technologies: [
        {
          name: 'React',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Next.js',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Firebase',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Node.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'TypeScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Tailwind CSS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'GSAP',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
      ],
      features: [
        'Content management system',
        'SEO optimization',
        'Social sharing integration',
        'Comment system',
        'Search functionality',
      ],
      challenges: [
        'Building scalable CMS architecture',
        'Implementing efficient search',
        'Optimizing for SEO',
      ],
      solutions: [
        'Used headless CMS approach',
        'Implemented full-text search with indexing',
        'Applied modern SEO best practices',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/jojobug-blog.png',
        gallery: ['/projects/jojobug-blog.png'],
      },
      links: {
        live: 'https://jojobug.com/blog',
      },
      metrics: {
        impact: 'Increased engagement rates by 20%',
        users: 3000,
      },
    },
    {
      id: 'vinobuah',
      slug: 'vinobuah',
      title: 'Vinobuah',
      shortDescription:
        'E-commerce landing page for a fruit selling website with modern design and responsive layout.',
      fullDescription:
        'Landing page for vinobuah, a website that sells all kinds of fruits. Built using Next.js and Tailwind CSS with focus on user experience and conversion optimization.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2022',
      startDate: '2022-02',
      endDate: '2022-04',
      technologies: [
        {
          name: 'Next.js',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Tailwind CSS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Firebase',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Product showcase',
        'Shopping cart integration',
        'Responsive design',
        'Contact forms',
        'SEO optimization',
      ],
      challenges: [
        'Creating attractive product displays',
        'Implementing shopping cart functionality',
        'Optimizing for mobile devices',
      ],
      solutions: [
        'Used modern CSS Grid and Flexbox',
        'Implemented state management for cart',
        'Applied mobile-first design approach',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/vinobuah.png',
        gallery: ['/projects/vinobuah.png'],
      },
      links: {
        live: 'https://vinobuah.com',
      },
      metrics: {
        users: 2000,
      },
    },
    {
      id: 'advocacy-la',
      slug: 'advocacy-la',
      title: 'Advocacy LA',
      shortDescription:
        'Non-profit organization website that increased donations by 50% through improved user experience.',
      fullDescription:
        'Developed a new website for a non-profit organization that increased donations by 50%. Features modern design, donation integration, and content management system.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2021',
      startDate: '2021-08',
      endDate: '2021-11',
      technologies: [
        {
          name: 'Next.js',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'Tailwind CSS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'GSAP',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Donation integration',
        'Event management',
        'Volunteer registration',
        'News and updates section',
        'Contact forms',
      ],
      challenges: [
        'Integrating secure donation processing',
        'Creating engaging user experience',
        'Building trust through design',
      ],
      solutions: [
        'Used trusted payment processors',
        'Applied UX best practices for non-profits',
        'Implemented social proof elements',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/la-advocacy.png',
        gallery: ['/projects/la-advocacy.png'],
      },
      links: {
        live: 'https://advocacy.la/',
      },
      metrics: {
        impact: 'Increased donations by 50%',
        users: 1500,
      },
    },
    {
      id: 'facial-expression-recognition-system',
      slug: 'facial-expression-recognition',
      title: 'Facial Expression Recognition System',
      shortDescription:
        'AI-powered facial expression recognition system using Deep Temporal Appearance Geometry Network.',
      fullDescription:
        "My final project for Bachelor's degree, focusing on Facial Expression Recognition using Deep Temporal Appearance Geometry Network. This system can accurately detect and classify human emotions from facial expressions in real-time.",
      category: ProjectCategory.AI_ML,
      status: ProjectStatus.COMPLETED,
      year: '2022',
      startDate: '2021-09',
      endDate: '2022-08',
      technologies: [
        {
          name: 'Python',
          category: TechCategory.BACKEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'TensorFlow',
          category: TechCategory.AI_ML,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'OpenCV',
          category: TechCategory.AI_ML,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Flask',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Real-time emotion detection',
        'Multiple facial expression classification',
        'High accuracy recognition',
        'Web-based interface',
        'Video processing capabilities',
      ],
      challenges: [
        'Achieving high accuracy in emotion detection',
        'Real-time processing requirements',
        'Handling various lighting conditions',
      ],
      solutions: [
        'Implemented Deep Temporal Appearance Geometry Network',
        'Used advanced preprocessing techniques',
        'Optimized model for real-time inference',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/fer.png',
        gallery: ['/projects/fer.png'],
      },
      links: {},
      metrics: {
        impact: 'Achieved 94% accuracy in emotion recognition',
      },
    },
    {
      id: 'buana-megah',
      slug: 'buana-megah',
      title: 'Buana Megah Employee System',
      shortDescription:
        'Internal employee time tracker and payroll management system.',
      fullDescription:
        'Developed an internal employee time tracker and streamlined the payroll process for PT. Buana Megah. The system improved operational efficiency and reduced manual work.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2021',
      startDate: '2021-07',
      endDate: '2021-12',
      technologies: [
        {
          name: 'Laravel Lumen',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'PHP',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'MySQL',
          category: TechCategory.DATABASE,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Employee time tracking',
        'Payroll calculation',
        'Report generation',
        'User management',
        'Dashboard analytics',
      ],
      challenges: [
        'Complex payroll calculations',
        'Data security requirements',
        'User-friendly interface design',
      ],
      solutions: [
        'Implemented robust calculation algorithms',
        'Applied security best practices',
        'Created intuitive dashboard design',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/buana-megah.png',
        gallery: ['/projects/buana-megah.png'],
      },
      links: {
        live: 'http://www.buanamegah.com/',
      },
      metrics: {
        impact: 'Reduced payroll processing time by 60%',
      },
    },
    {
      id: 'istts-book-management-system',
      slug: 'istts-book-management',
      title: 'ISTTS Book Management System',
      shortDescription:
        'Web-based book management system for university practicum activities.',
      fullDescription:
        'Maintain the website and adding some features of a book management system for practicum activity using React as frontend, Node.js as backend and MySQL as database.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2020',
      startDate: '2020-08',
      endDate: '2020-12',
      technologies: [
        {
          name: 'React',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Node.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'MySQL',
          category: TechCategory.DATABASE,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Express',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Bootstrap',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Book catalog management',
        'User authentication',
        'Borrowing system',
        'Search functionality',
        'Admin dashboard',
      ],
      challenges: [
        'Database design for complex relationships',
        'User role management',
        'Efficient search implementation',
      ],
      solutions: [
        'Designed normalized database schema',
        'Implemented role-based access control',
        'Used indexed search with pagination',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/bukupraktikum.png',
        gallery: ['/projects/bukupraktikum.png'],
      },
      links: {},
      metrics: {
        users: 300,
      },
    },
    {
      id: 'fit4u',
      slug: 'fit4u',
      title: 'Fit4U Nutrition API',
      shortDescription:
        'RESTful API service providing nutritional information about various foods.',
      fullDescription:
        'fit4u offers endpoints that help users find out information about the food they eat every day using Node.js, EJS, Express, and MySQL. The service provides comprehensive nutritional data.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2020',
      startDate: '2020-05',
      endDate: '2020-07',
      technologies: [
        {
          name: 'Node.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'EJS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Express',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'MySQL',
          category: TechCategory.DATABASE,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'RESTful API endpoints',
        'Nutritional data database',
        'Food search functionality',
        'Calorie calculation',
        'User meal tracking',
      ],
      challenges: [
        'Large nutritional database management',
        'API performance optimization',
        'Data accuracy validation',
      ],
      solutions: [
        'Implemented efficient database indexing',
        'Used caching for frequently accessed data',
        'Created data validation pipelines',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/fit4u.png',
        gallery: ['/projects/fit4u.png'],
      },
      links: {
        github: 'https://github.com/jamesjfoong/soa',
      },
      metrics: {
        users: 150,
      },
    },
    {
      id: 'lifeatio-clone',
      slug: 'lifeatio-clone',
      title: 'Lifeatio Clone',
      shortDescription:
        'Social media platform clone with React frontend and Node.js backend.',
      fullDescription:
        'Lifeatio clone with a not yet implemented login feature using React as frontend, Node.js as backend, and MySQL as database. Focus on social media functionality and user interactions.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.IN_PROGRESS,
      year: '2020',
      startDate: '2020-03',
      technologies: [
        {
          name: 'React',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Node.js',
          category: TechCategory.BACKEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'MySQL',
          category: TechCategory.DATABASE,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Social media feed',
        'Post creation and sharing',
        'User profiles',
        'Like and comment system',
        'Responsive design',
      ],
      challenges: [
        'Real-time updates implementation',
        'Scalable database design',
        'User authentication system',
      ],
      solutions: [
        'Used WebSocket for real-time features',
        'Designed efficient database relationships',
        'Planned JWT-based authentication',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/lifeatio-clone.png',
        gallery: ['/projects/lifeatio-clone.png'],
      },
      links: {
        live: 'https://lifeatio.vercel.app',
      },
      metrics: {
        users: 100,
      },
    },
    {
      id: 'n-queens-sos-algorithm',
      slug: 'n-queens-sos-algorithm',
      title: 'N-Queens SOS Algorithm Visualization',
      shortDescription:
        'Interactive visualization of N-Queens problem solution using Symbiotic Organisms Search Algorithm.',
      fullDescription:
        'A web-based visualization tool for solving the N-Queens problem using the Symbiotic Organisms Search (SOS) Algorithm. This project demonstrates the application of evolutionary algorithms in solving complex optimization problems.',
      category: ProjectCategory.DATA_SCIENCE,
      status: ProjectStatus.COMPLETED,
      year: '2020',
      startDate: '2020-01',
      endDate: '2020-03',
      technologies: [
        {
          name: 'JavaScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'HTML',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'CSS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Evolutionary Algorithm',
          category: TechCategory.AI_ML,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Interactive N-Queens board',
        'SOS algorithm visualization',
        'Step-by-step solution process',
        'Configurable board size',
        'Algorithm performance metrics',
      ],
      challenges: [
        'Visualizing complex algorithm steps',
        'Optimizing algorithm performance',
        'Creating intuitive user controls',
      ],
      solutions: [
        'Implemented smooth animation system',
        'Used efficient data structures',
        'Created clear visual indicators',
      ],
      media: {
        type: MediaType.INTERACTIVE_DEMO,
        thumbnail: '/projects/n-queens-sos-algorithm.png',
        gallery: ['/projects/n-queens-sos-algorithm.png'],
        demo: 'https://jamesjfoong.github.io/N-Queens-using-Symbiotic-Organisms-Search-Algorithm',
      },
      links: {
        live: 'https://jamesjfoong.github.io/N-Queens-using-Symbiotic-Organisms-Search-Algorithm',
      },
      metrics: {
        users: 600,
      },
    },
    {
      id: 'connect4-ai',
      slug: 'connect4-ai-game',
      title: 'Connect 4 AI Game',
      shortDescription:
        'Interactive Connect 4 game with AI opponent using minimax algorithm with alpha-beta pruning.',
      fullDescription:
        'A web-based Connect 4 game where players can compete against an intelligent AI opponent. The AI uses the minimax algorithm with alpha-beta pruning to make optimal moves, providing a challenging gaming experience.',
      category: ProjectCategory.GAME_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2020',
      startDate: '2020-03',
      endDate: '2020-05',
      technologies: [
        {
          name: 'JavaScript',
          category: TechCategory.FRONTEND,
          level: SkillLevel.ADVANCED,
        },
        {
          name: 'HTML',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'CSS',
          category: TechCategory.FRONTEND,
          level: SkillLevel.EXPERT,
        },
        {
          name: 'Bootstrap',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
        {
          name: 'Artificial Intelligence',
          category: TechCategory.AI_ML,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'AI opponent with minimax algorithm',
        'Interactive game board',
        'Score tracking',
        'Responsive design',
        'Game state management',
      ],
      challenges: [
        'Implementing efficient minimax algorithm',
        'Optimizing AI response time',
        'Creating intuitive user interface',
      ],
      solutions: [
        'Used alpha-beta pruning for optimization',
        'Implemented iterative deepening',
        'Created smooth animations for better UX',
      ],
      media: {
        type: MediaType.INTERACTIVE_DEMO,
        thumbnail: '/projects/connect4ai.png',
        gallery: ['/projects/connect4ai.png'],
        demo: 'https://jamesjfoong.github.io/connect-4-ai/',
      },
      links: {
        live: 'https://jamesjfoong.github.io/connect-4-ai/',
      },
      metrics: {
        users: 800,
      },
    },
    {
      id: 'other-projects',
      slug: 'other-projects',
      title: 'Other Academic Projects',
      shortDescription:
        'Collection of various projects from university including management systems, games, and algorithms.',
      fullDescription:
        'Various projects from my time at ISTTS, including a kost management system, event management system, safari chess AI, and more. These projects showcase different aspects of software development and problem-solving.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      status: ProjectStatus.COMPLETED,
      year: '2018 - 2022',
      startDate: '2018-09',
      endDate: '2022-08',
      technologies: [
        {
          name: 'Various',
          category: TechCategory.FRONTEND,
          level: SkillLevel.INTERMEDIATE,
        },
      ],
      features: [
        'Multiple project types',
        'Different technology stacks',
        'Academic learning focus',
        'Problem-solving applications',
        'Software engineering practices',
      ],
      challenges: [
        'Learning multiple technologies',
        'Adapting to different project requirements',
        'Academic deadlines and constraints',
      ],
      solutions: [
        'Systematic learning approach',
        'Modular development practices',
        'Effective time management',
      ],
      media: {
        type: MediaType.IMAGE_GALLERY,
        thumbnail: '/projects/otherprojects.png',
        gallery: ['/projects/otherprojects.png'],
      },
      links: {
        case_study:
          'https://drive.google.com/file/d/19SsBkSgDshBSC6nwIlBSYrqj_hscMg9w/view',
      },
      metrics: {
        impact: 'Completed 15+ academic projects',
      },
    },
  ],
  skills: [
    {
      name: 'React',
      category: TechCategory.FRONTEND,
      level: SkillLevel.EXPERT,
    },
    {
      name: 'Next.js',
      category: TechCategory.FRONTEND,
      level: SkillLevel.EXPERT,
    },
    {
      name: 'Angular',
      category: TechCategory.FRONTEND,
      level: SkillLevel.EXPERT,
    },
    {
      name: 'TypeScript',
      category: TechCategory.FRONTEND,
      level: SkillLevel.EXPERT,
    },
    {
      name: 'JavaScript',
      category: TechCategory.FRONTEND,
      level: SkillLevel.EXPERT,
    },
    {
      name: 'Node.js',
      category: TechCategory.BACKEND,
      level: SkillLevel.ADVANCED,
    },
    {
      name: 'Nest.js',
      category: TechCategory.BACKEND,
      level: SkillLevel.ADVANCED,
    },
    {
      name: 'Python',
      category: TechCategory.BACKEND,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'PHP',
      category: TechCategory.BACKEND,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'Laravel',
      category: TechCategory.BACKEND,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'MySQL',
      category: TechCategory.DATABASE,
      level: SkillLevel.ADVANCED,
    },
    {
      name: 'PostgreSQL',
      category: TechCategory.DATABASE,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'Firebase',
      category: TechCategory.DATABASE,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'Supabase',
      category: TechCategory.DATABASE,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'Tailwind CSS',
      category: TechCategory.FRONTEND,
      level: SkillLevel.EXPERT,
    },
    {
      name: 'SCSS',
      category: TechCategory.FRONTEND,
      level: SkillLevel.ADVANCED,
    },
    {
      name: 'Bootstrap',
      category: TechCategory.FRONTEND,
      level: SkillLevel.ADVANCED,
    },
    {
      name: 'Git',
      category: TechCategory.DEVELOPER_TOOLS,
      level: SkillLevel.EXPERT,
    },
    {
      name: 'GitHub Actions',
      category: TechCategory.DEVELOPER_TOOLS,
      level: SkillLevel.ADVANCED,
    },
    {
      name: 'Docker',
      category: TechCategory.DEVELOPER_TOOLS,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'AWS',
      category: TechCategory.CLOUD,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'Figma',
      category: TechCategory.DESIGN,
      level: SkillLevel.INTERMEDIATE,
    },
    {
      name: 'Webflow',
      category: TechCategory.DESIGN,
      level: SkillLevel.ADVANCED,
    },
  ],
  testimonials: [
    {
      id: 'testimonial-gdp-labs',
      name: 'Senior Manager',
      role: 'Engineering Manager',
      company: 'GDP Labs',
      content:
        'James is an exceptional developer with great attention to detail and strong problem-solving skills. His work on the CATAPA project was outstanding.',
      rating: 5,
    },
    {
      id: 'testimonial-jojobug',
      name: 'Team Lead',
      role: 'Senior Developer',
      company: 'Jojobug Tech',
      content:
        'James quickly adapted to our tech stack and delivered high-quality work. His contributions to our landing pages significantly improved conversion rates.',
      rating: 5,
    },
  ],
  quote: 'The only way to do great work is to love what you do.',
}

export default personalData
