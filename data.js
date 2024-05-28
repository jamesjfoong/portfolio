const data = {
  name: 'James Jeremy Foong',
  title: 'Senior Software Development Engineer',
  bio: `
    <p>A <span class="font-medium text-slate-200">Senior Software Development Engineer</span> based in Surabaya, Indonesia. I hold a Bachelor's degree in <span class="font-medium text-slate-200">Computer Science</span> from <span class="font-medium text-slate-200">Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)</span>, where I graduated with a GPA of 3.99. My final project focused on <span class="font-medium text-slate-200">Facial Expression Recognition using Deep Temporal Appearance Geometry Network</span>, highlighting my expertise in artificial intelligence and advanced computational techniques.</p><br />

    <p>At <span class="font-medium text-slate-200">GDP Labs</span>, I've developed high-impact internal applications, revamped landing pages, and mentored interns, leveraging my skills in <span class="font-medium text-slate-200">web development</span>, <span class="font-medium text-slate-200">AI</span>, and <span class="font-medium text-slate-200">various modern frameworks</span>. My stint at <span class="font-medium text-slate-200">Jojobug</span> in Singapore enhanced my fullstack development capabilities, with hands-on experience in <span class="font-medium text-slate-200">Next.js</span>, <span class="font-medium text-slate-200">Node.js</span>, and <span class="font-medium text-slate-200">Firebase</span>, among other technologies.</p><br />

    <p>I am passionate about <span class="font-medium text-slate-200">creating user-friendly</span>, <span class="font-medium text-slate-200">responsive interfaces</span> and <span class="font-medium text-slate-200">believe in the power of technology to solve complex problems</span>. I strive to make a meaningful impact through my work and am always <span class="font-medium text-slate-200">eager to learn</span> and <span class="font-medium text-slate-200">take on new challenges</span>.</p><br />
  `,
  socials: [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/james-j-foong/',
    },
    {
      name: 'GitHub',
      url: 'https://www.github.com/jamesjf7',
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
        "Build and maintain critical components for Klaviyo's frontend, focusing on web accessibility.",
      technologies: [
        'Angular',
        'NgRx',
        'Typescript',
        'Jest',
        'Cypress',
        'Nest.js',
        'Python',
        'React Native',
        'Artificial Intelligence',
      ],
    },
    {
      role: 'Software Development Engineer',
      company: 'GDP Labs, Jakarta',
      duration: '2022 — 2023',
      description:
        'Develop high-quality websites, design systems, and digital experiences for various clients.',
      technologies: [
        'Webflow',
        'SEO',
        'Responsive UI Design',
        'Usability',
        'Angular',
        'Typescript',
        'Google Analytics',
        'Google Tag Manager',
      ],
    },
    {
      role: 'Full Stack Software Engineer',
      company: 'Jojobug, Singapore',
      duration: 'Apr 2022 — Oct 2022',
      description:
        'Served as a Frontend Software Engineer, contributing my skills to enhance the overall user experience and functionality of web applications. Engaging in collaborative development, I played a crucial role in translating design concepts into responsive and user-friendly interfaces.',
      technologies: [
        'React',
        'Next.js',
        'Firebase',
        'Node.js',
        'Typescript',
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
      year: '2023',
      name: 'CATAPA Landing Page',
      technologies: ['Webflow', 'HTML', 'CSS', 'JavaScript', 'Jquery'],
      description:
        'A web-based payroll platform that can be accessed online anywhere and anytime, without the need to install additional applications. Build using webflow, with basic HTML, CSS, Javascript and Jquery',
      link: 'https://catapa.com',
      image: '/projects/catapa-landing-page.png',
    },
    {
      year: '2023',
      name: 'Safemoon clone',
      technologies: [
        'Next.js',
        'Typescript',
        'Tailwind CSS',
        'Metamask',
        'Uniswap',
      ],
      description:
        'Safemoon clone is a clone of the original safemoon webpage, build using next.js, tailwind and firebase',
      link: 'https://safemoon-clone.vercel.app',
      image: '/projects/safemoon-clone.png',
    },
    {
      year: '2022',
      name: 'Jojobug New Landing Page',
      technologies: [
        'React',
        'Next.js',
        'Firebase',
        'Node.js',
        'Typescript',
        'Tailwind CSS',
        'GSAP',
      ],
      description:
        'Landing page for Jojobug a web development agency, build using next.js, tailwind and GSAP',
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
        'Typescript',
        'Tailwind CSS',
        'GSAP',
      ],
      description:
        'Designed and developed a new landing page that increased conversion rates by 20%.',
      link: 'https://jojobug.com',
      image: '/projects/jojobug-blog.png',
    },
    {
      year: '2022',
      name: 'Vinobuah',
      technologies: ['Next.js', 'Tailwind CSS', 'Firebase'],
      description:
        'Landing page for vinobuah, a website that sells all kinds of fruits, build using next.js and tailwind',
      link: 'https://vinobuah.com',
      image: '/projects/vinobuah.png',
    },
    {
      year: '2021',
      name: 'Advocacy LA',
      technologies: ['Next.js', 'Tailwind CSS', 'GSAP'],
      description:
        'Developed a new website for a non-profit organization that increased donations by 50%.',
      link: 'https://advocacy.la/',
      image: '/projects/la-advocacy.png',
    },
    {
      year: '2022',
      name: 'Facial Expression Recognition System',
      technologies: ['Python', 'Flash', 'Deep Learning', 'OpenCV'],
      description:
        'Developed an internal employee time tracker and streamlined the payroll process.',
      link: '',
      image: '/projects/fer.jpeg',
    },
    {
      year: '2021',
      name: 'Buana Megah',
      technologies: ['Laravel Lumen', 'PHP', 'MySQL'],
      description:
        'Developed an internal employee time tracker and streamlined the payroll process.',
      link: 'http://www.buanamegah.com/',
      image: '/projects/buana-megah.png',
    },
    {
      year: '2020',
      name: 'ISTTS Book Management System',
      technologies: ['React', 'Node.js', 'MySQL', 'Express', 'Bootstrap'],
      description:
        'Maintain the website and adding some features of a book management system for practicum activity using react as frontend, node js as backend and MySQL as database',
      link: '',
      image: '/projects/bukupraktikum.png',
    },
    {
      year: '2020',
      name: 'fit4u',
      technologies: ['Node.js', 'EJS', 'Express', 'MySQL'],
      description:
        'fit4u offer endpoint that we hope that users can find out information about the food they eat every day using node.js, ejs, express, etc.',
      link: 'https://github.com/jamesjf7/soa',
      image: '/projects/fit4u.png',
    },
    {
      year: '2020',
      name: 'lifeatio clone',
      technologies: ['React', 'Node.js', 'MySQL'],
      description:
        'Lifeatio clone with a not yet implemented login feature using react as frontend, node.js as backend, and MySQL as database.',
      link: 'https://lifeatio.vercel.app',
      image: '/projects/lifeatio-clone.png',
    },
    {
      year: '2020',
      name: 'N Queen Symbiotic Organisms Search Algorithm',
      technologies: ['HTML', 'CSS', 'Javascript', 'Evolutionary Algorithm'],
      description:
        'Visualization of the N Queens Problem using Symbiotic Organisms Search Algorithm using javascript.',
      link: 'https://jamesjf7.github.io/N-Queens-using-Symbiotic-Organisms-Search-Algorithm',
      image: '/projects/n-queens-sos-algorithm.png',
    },
    {
      year: '2020',
      name: 'Connect 4 AI',
      technologies: [
        'HTML',
        'CSS',
        'Javascript',
        'Bootstrap',
        'Artificial Intelligence',
      ],
      description:
        'Connect 4 AI is a game where you play against an AI. The AI is using minimax alpha beta pruning to play the best possible move. This project made using javascript and bootstrap',
      link: 'https://jamesjf7.github.io/connect-4-ai/',
      image: '/projects/connect4ai.png',
    },
    {
      year: '2018 - 2022',
      name: 'Other Projects',
      technologies: ['Various'],
      description:
        'Various projects from my time at ISTTS, including a kost management system, event management system, safari chess AI, and more.',
      link: 'https://drive.google.com/file/d/19SsBkSgDshBSC6nwIlBSYrqj_hscMg9w/view',
      image: '/projects/otherprojects.png',
    },
  ],
  quote: 'The only way to do great work is to love what you do.',
}

export default data
