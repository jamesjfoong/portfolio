import data from '../../data.js'
import { ExperienceListItem } from '../components/pages/home/ExperienceListItem'
import { HomeSection } from '../components/pages/home/HomeSection'
import { NavItem } from '../components/pages/home/NavItem'
import { ProjectListItem } from '../components/pages/home/ProjectListItem'
import { RawHTML } from '../components/RawHTML'

export default function Home() {
  const navItems: Array<{ name: string; href: string }> = [
    { name: 'About', href: '#about' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blogs', href: '#blogs' },
  ]
  const { name, title, bio, experiences, projects, socials, quote } = data

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"></div>
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
                {name}
              </h1>
              <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
                {title}
              </h2>
              <p className="mt-4 max-w-xs leading-normal">{quote}</p>

              <nav
                className="nav hidden lg:block"
                aria-label="In-page jump links"
              >
                <ul className="mt-16 w-max">
                  {navItems.map((navItem: { name: string; href: string }) => (
                    <NavItem
                      key={navItem.name}
                      name={navItem.name}
                      href={navItem.href}
                    />
                  ))}
                </ul>
              </nav>
            </div>

            <div>
              <ul className="ml-1 mt-8 flex items-center">
                {socials.map((social: any) => (
                  <li key={social.name} className="mr-5 text-xs shrink-0">
                    <a
                      href={social.url}
                      target="_blank"
                      className="block hover:text-slate-200"
                      aria-label={social.name}
                      title={social.name}
                    >
                      {/* <span className="sr-only">{social.name}</span> */}
                      {social.name}
                      {/* add icon */}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </header>

          <main className="pt-24 lg:w-1/2 lg:py-24">
            <HomeSection name="About">
              <RawHTML content={bio} />
            </HomeSection>
            <HomeSection name="Experiences">
              <ol className="group/list">
                {experiences.map((experience: any, index) => (
                  <ExperienceListItem key={index} {...experience} />
                ))}
              </ol>
            </HomeSection>
            <HomeSection name="Projects">
              <ul className="group/list">
                {projects.map((project: any, index) => (
                  <ProjectListItem key={index} {...project} />
                ))}
              </ul>
            </HomeSection>
            <HomeSection name="Blogs">
              <p>
                I also write about software development, web development, and
                software engineering.
              </p>
              <br />
              <p>Under construction</p>
            </HomeSection>

            <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0">
              <p>
                Coded in{' '}
                <a
                  href="https://code.visualstudio.com/"
                  className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Visual Studio Code (opens in a new tab)"
                >
                  Visual Studio Code
                </a>{' '}
                by yours truly. Built with{' '}
                <a
                  href="https://nextjs.org/"
                  className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Next.js (opens in a new tab)"
                >
                  Next.js
                </a>{' '}
                and{' '}
                <a
                  href="https://tailwindcss.com/"
                  className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Tailwind CSS (opens in a new tab)"
                >
                  Tailwind CSS
                </a>
                , deployed with{' '}
                <a
                  href="https://vercel.com/"
                  className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Vercel (opens in a new tab)"
                >
                  Vercel
                </a>
                . All text is set in the{' '}
                <a
                  href="https://rsms.me/inter/"
                  className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Inter (opens in a new tab)"
                >
                  Inter
                </a>{' '}
                typeface.
              </p>
            </footer>
          </main>
        </div>
      </div>
    </>
  )
}
