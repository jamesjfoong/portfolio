import { faCoffee } from '@fortawesome/free-solid-svg-icons'

import Icon from '@/components/common/Icon'
import RawHTML from '@/components/common/RawHTML'
import ExperienceItem from '@/components/pages/home/ExperienceItem'
import HomeSection from '@/components/pages/home/HomeSection'
import NavItem from '@/components/pages/home/NavItem'
import NavList from '@/components/pages/home/NavList'
import ProjectItem from '@/components/pages/home/ProjectItem'

import data from '../../data.js'

export default function Home() {
  const navItems: Array<{ name: string; href: string }> = [
    { name: 'about', href: '#about' },
    { name: 'experiences', href: '#experiences' },
    { name: 'projects', href: '#projects' },
    { name: 'blogs', href: '#blogs' },
  ]
  const { name, title, bio, experiences, projects, socials, quote } = data

  return (
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

            <NavList>
              <ul className="mt-16 w-max">
                {navItems.map((navItem: { name: string; href: string }) => (
                  <NavItem key={navItem.name} {...navItem} />
                ))}
              </ul>
            </NavList>
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
          <HomeSection name="about">
            <RawHTML content={bio} />
          </HomeSection>
          <HomeSection name="experiences">
            <ol className="group/list">
              {experiences.map((experience: any, index) => (
                <ExperienceItem key={index} {...experience} />
              ))}
            </ol>
          </HomeSection>
          <HomeSection name="projects">
            <ul className="group/list">
              {projects.slice(0, 5).map((project: any, index) => (
                <ProjectItem key={index} {...project} />
              ))}
            </ul>

            <div className="mt-12">
              <a
                className="inline-flex items-center font-medium leading-tight text-slate-200 font-semibold text-slate-200 group"
                aria-label="View Full Projects"
                href="/projects"
              >
                <span className="border-b border-transparent text-slate-300 font-medium pb-px transition group-hover:border-teal-300 motion-reduce:transition-none">
                  View Full Project{' '}
                </span>
                <Icon
                  icon={faCoffee}
                  className="ml-1 group-hover:text-teal-300 group-hover:transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:translate-x-0 transition-transform"
                />
              </a>
            </div>
          </HomeSection>
          <HomeSection name="blogs">
            <ul className="group/list">
              <li className="mb-12">
                <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
                  <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                  <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
                    2026
                  </header>
                  <div className="z-10 sm:col-span-6">
                    <h3>
                      <a
                        href="https://dev.to/jamesjf7/i-was-about-to-quit-ollama-then-i-deleted-one-file-and-never-looked-back-27a9"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 group/link text-base"
                      >
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50"></span>
                        <span className="relative">
                          I Was About to Quit Ollama — Then I Deleted One File and Never Looked Back
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1 inline-block h-4 w-4 shrink-0 -translate-y-px transition-transform group-hover/link:translate-x-1 group-hover/link:translate-y-1 group-focus-visible/link:translate-x-1 group-focus-visible/link:translate-y-1 motion-reduce:transition-none" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd"></path>
                          </svg>
                        </span>
                      </a>
                    </h3>
                    <p className="mt-2 text-sm leading-normal">
                      Built pi-ollama, a zero-dependency extension that auto-discovers Ollama models. The story of how deleting one config file led to a tool that removes manual model registration.
                    </p>
                    <ul className="mt-2 flex flex-wrap" aria-label="Tags">
                      <li className="mr-1.5 mt-2">
                        <span className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">dev.to</span>
                      </li>
                      <li className="mr-1.5 mt-2">
                        <span className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Node.js</span>
                      </li>
                      <li className="mr-1.5 mt-2">
                        <span className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">Open Source</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
            <div className="mt-12">
              <a
                href="https://dev.to/jamesjf7"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center font-medium leading-tight text-slate-200 font-semibold text-slate-200 group"
              >
                <span className="border-b border-transparent text-slate-300 font-medium pb-px transition group-hover:border-teal-300 motion-reduce:transition-none">
                  Read more on dev.to{' '}
                </span>
                <Icon
                  icon={faCoffee}
                  className="ml-1 group-hover:text-teal-300 group-hover:transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:translate-x-0 transition-transform"
                />
              </a>
            </div>
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
  )
}
