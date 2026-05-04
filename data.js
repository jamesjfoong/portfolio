const data = {
  name: 'James Jeremy Foong',
  title: 'Senior Software Development Engineer',
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
      url: 'https://www.github.com/jamesjf7',
    },
    {
      name: 'Dev.to',
      url: 'https://dev.to/jamesjf7',
    },
    {
      name: 'npm',
      url: 'https://www.npmjs.com/~jamesjfoong',
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
        'Build and maintain critical components for CATAPA, an HR-tech platform. Led initiatives across frontend architecture, payment integrations, data migrations, and compliance features.',
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
        'Developed high-quality internal applications, landing pages, and digital experiences for CATAPA. Revamped UI systems and implemented analytics tracking.',
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
        'Built responsive interfaces and full-stack features for client projects. Translated design concepts into performant, user-friendly web applications.',
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
        'Developed an internal employee time tracker and streamlined the payroll process.',
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
      link: 'http://www.buanamegah.com/',
      image: '/projects/buana-megah.png',
    },
  ],
  quote: 'Ship fast, measure obsessively, write about the struggle honestly.',
}

export default data
