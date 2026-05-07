export interface Social {
  name: string
  url: string
}

export interface Experience {
  role: string
  company: string
  duration: string
  description: string
  technologies: string[]
}

export interface Project {
  year: string
  name: string
  technologies: string[]
  description: string
  link: string
  image: string
}

export interface Education {
  university: string
  degree: string
  concentration: string
  minor: string
  graduation: string
}

export interface Data {
  name: string
  title: string
  email: string
  bio: string
  socials: Social[]
  education: Education
  experiences: Experience[]
  projects: Project[]
  quote: string
}

const data: Data = {
  name: 'James Jeremy Foong',
  title: 'Senior Software Development Engineer',
  email: 'jamesjfoong2000@gmail.com',
  bio: `
    <p>A <span class="font-medium text-slate-200">Senior Software Development Engineer</span> based in Surabaya, Indonesia. I specialize in <span class="font-medium text-slate-200">frontend architecture</span>, <span class="font-medium text-slate-200">API contract design</span>, and <span class="font-medium text-slate-200">developer tooling</span>. I ship enterprise tools that scale — from 2.3M-row migrations to zero-dependency extensions.</p><br />

    <p>At <span class="font-medium text-slate-200">GDP Labs</span>, I build and maintain critical components for <span class="font-medium text-slate-200">CATAPA</span>, an HR-tech platform serving 15,000+ employees. I've led initiatives across frontend architecture (Angular/NgRx), payment systems (BCA VA/Midtrans), data migration tooling, and compliance features (UU PDP, PMK 168/2023). I also maintain <span class="font-medium text-slate-200">pi-ollama</span>, an open-source extension for the pi coding agent.</p><br />

    <p>Previously at <span class="font-medium text-slate-200">Jojobug</span> in Singapore, I worked across the full stack with Next.js, Node.js, and Firebase. I write about the systems I build on <span class="font-medium text-slate-200">dev.to</span> and ship tools developers actually use.</p><br />
  `,
  socials: [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jamesjeremyfoong/',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/jamesjfoong',
    },
    {
      name: 'Dev.to',
      url: 'https://dev.to/jamesjf7',
    },
    {
      name: 'npm',
      url: 'https://www.npmjs.com/~jamesjfoong',
    },
    {
      name: 'Email',
      url: 'mailto:jamesjfoong2000@gmail.com',
    },
  ],
  education: {
    university: 'Institut Sains dan Teknologi Terpadu Surabaya',
    degree: 'Bachelor of Informatics',
    concentration: 'Computer Science',
    minor: 'Interaction Design',
    graduation: 'August 2022',
  },
  experiences: [
    {
      role: 'Senior Software Development Engineer',
      company: 'GDP Labs, Jakarta',
      duration: '2024 — Present',
      description:
        'Lead frontend architecture for CATAPA, an HR-tech platform serving 15,000+ employees. Shipped OAuth + Data Trustee security (passed audit), virtualized org chart for 15K+ nodes (60% faster), refactored 50+ resolvers to Factory Pattern (~60% boilerplate cut), removed ~6,000 lines via BaseCrudEffects, and built a 2.3M-row enterprise migration tool. Maintained 100% test coverage on all refactors.',
      technologies: [
        'Angular',
        'NgRx',
        'TypeScript',
        'RxJS',
        'Node.js',
        'NestJS',
        'Jest',
        'Cypress',
        'GraphQL',
      ],
    },
    {
      role: 'Software Development Engineer',
      company: 'GDP Labs, Jakarta',
      duration: '2022 — 2023',
      description:
        'Developed internal applications for CATAPA including tax calculation system (PMK 168/2023 compliance), BCA VA payment integration, and the Angular 17 upgrade. Built marketing landing pages with Webflow, implemented analytics tracking, and optimized SEO across the platform.',
      technologies: [
        'Angular',
        'TypeScript',
        'Webflow',
        'SEO',
        'Responsive UI',
        'Google Analytics',
        'Google Tag Manager',
      ],
    },
    {
      role: 'Full Stack Software Engineer',
      company: 'Jojobug, Singapore',
      duration: 'Apr 2022 — Oct 2022',
      description:
        'Built responsive landing pages and full-stack features using Next.js, Firebase, and GSAP animations. Translated design concepts into performant, user-friendly web applications for a Singapore-based web development agency.',
      technologies: [
        'React',
        'Next.js',
        'Firebase',
        'Node.js',
        'TypeScript',
        'Tailwind CSS',
        'GSAP',
      ],
    },
    {
      role: 'Web Developer',
      company: 'PT. Buana Megah, Surabaya',
      duration: 'July 2021 — Dec 2021',
      description:
        'Developed an internal employee time tracker with Laravel Lumen and MySQL, streamlining the payroll process for the company.',
      technologies: ['Laravel Lumen', 'PHP', 'MySQL'],
    },
    {
      role: 'Laboratory Assistant',
      company: 'Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)',
      duration: '2020 - 2022',
      description:
        'Taught, conducted, graded, and created educational materials for practicum sessions. Subjects include Data Structures, Algorithms, and Object-Oriented Programming.',
      technologies: [
        'C++',
        'Java',
        'OOP',
        'HTML',
        'CSS',
        'Javascript',
        'PHP',
        'MySQL',
        'Laravel',
      ],
    },
  ],
  projects: [
    {
      year: '2026',
      name: 'pi-ollama',
      technologies: ['Node.js', 'TypeScript', 'Ollama', 'Zero Dependencies'],
      description:
        'Auto-discover and register Ollama models for the pi coding agent. Eliminates manual config file editing. Published on npm.',
      link: 'https://github.com/jamesjfoong/pi-ollama',
      image: '/projects/pi-ollama.png',
    },
    {
      year: '2025',
      name: 'open-hsk',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PWA'],
      description:
        'Offline-first flashcard application for learning Chinese vocabulary (HSK 3.0). High-performance with local storage and PWA support.',
      link: 'https://github.com/jamesjfoong/open-hsk',
      image: '/projects/open-hsk.png',
    },
    {
      year: '2026',
      name: 'build-sha-sync-ui',
      technologies: ['React', 'TypeScript', 'BYO-token'],
      description:
        'Web UI to sync BUILD_SHA across CATAPA environment files. Simplifies deployment verification for dev and staging environments.',
      link: 'https://github.com/jamesjfoong/build-sha-sync-ui',
      image: '/projects/build-sha-sync-ui.png',
    },
    {
      year: '2025',
      name: 'splitsies',
      technologies: ['Next.js', 'TypeScript', 'Google Gemini', 'PWA'],
      description:
        'AI-powered bill splitting app using Google Gemini. Snap a receipt, let AI parse items, split with friends. PWA-enabled.',
      link: 'https://github.com/jamesjfoong/splitsies',
      image: '/projects/splitsies.png',
    },
    {
      year: '2023',
      name: 'CATAPA Landing Page',
      technologies: ['Webflow', 'HTML', 'CSS', 'JavaScript', 'jQuery'],
      description:
        'Marketing landing page for CATAPA, a web-based payroll platform. Built with Webflow for rapid iteration and SEO optimization.',
      link: 'https://catapa.com',
      image: '/projects/catapa-landing-page.png',
    },
    {
      year: '2022',
      name: 'Jojobug New Landing Page',
      technologies: [
        'React',
        'Next.js',
        'Firebase',
        'Node.js',
        'TypeScript',
        'Tailwind CSS',
        'GSAP',
      ],
      description:
        'Landing page for Jojobug, a web development agency in Singapore. Responsive design with animated elements using GSAP.',
      link: 'https://jojobug.com',
      image: '/projects/jojobug-new-landing-page.png',
    },
    {
      year: '2022',
      name: 'Jojobug Blog',
      technologies: [
        'React',
        'Next.js',
        'Firebase',
        'Node.js',
        'TypeScript',
        'Tailwind CSS',
        'GSAP',
      ],
      description:
        'Blog platform for Jojobug with content management and improved navigation. Contributed to content strategy and frontend implementation.',
      link: 'https://jojobug.com',
      image: '/projects/jojobug-blog.png',
    },
    {
      year: '2021',
      name: 'Advocacy LA',
      technologies: ['Next.js', 'Tailwind CSS', 'GSAP'],
      description:
        'Website for a non-profit organization focused on community advocacy. Modern design with accessibility considerations.',
      link: 'https://advocacy.la/',
      image: '/projects/la-advocacy.png',
    },
    {
      year: '2022',
      name: 'Facial Expression Recognition',
      technologies: ['Python', 'Flask', 'Deep Learning', 'OpenCV'],
      description:
        'Final thesis project — real-time facial expression recognition using Deep Temporal Appearance Geometry Network. Built with Flask and deployed for live webcam inference.',
      link: '',
      image: '/projects/fer.jpeg',
    },
    {
      year: '2021',
      name: 'Buana Megah',
      technologies: ['Laravel Lumen', 'PHP', 'MySQL'],
      description:
        'Internal employee time tracker and payroll streamlining system. API-first architecture with MySQL backend.',
      link: 'https://www.buanamegah.com/',
      image: '/projects/buana-megah.png',
    },
  ],
  quote: 'Ship fast, measure obsessively, write about the struggle honestly.',
}

export default data
