import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import Icon from '@/components/common/Icon'
import RawHTML from '@/components/common/RawHTML'
import ExperienceItem from '@/components/pages/home/ExperienceItem'
import HomeSection from '@/components/pages/home/HomeSection'
import NavItem from '@/components/pages/home/NavItem'
import NavList from '@/components/pages/home/NavList'
import ProjectItem from '@/components/pages/home/ProjectItem'

import data from '../../data.js'

interface DevToArticle {
  title: string
  description: string
  url: string
  readable_publish_date: string
  tag_list: string[]
  reading_time_minutes: number
}

async function getArticles(): Promise<DevToArticle[]> {
  try {
    const res = await fetch(
      'https://dev.to/api/articles?username=jamesjf7&per_page=3',
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function Home() {
  const articles = await getArticles()

  const navItems: Array<{ name: string; href: string }> = [
    { name: 'about', href: '#about' },
    { name: 'experiences', href: '#experiences' },
    { name: 'projects', href: '#projects' },
    { name: 'blogs', href: '#blogs' },
  ]

  const { name, title, bio, experiences, projects, socials, quote, status, email } = data

  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="lg:flex lg:justify-between lg:gap-4">
        <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
              {name}
            </h1>
            <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
              {title}
            </h2>

            {/* Status badge */}
            {status && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-1.5 text-sm font-medium text-teal-300 status-shimmer animate-pulse-glow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400"></span>
                </span>
                {status}
              </div>
            )}

            <p className="mt-4 max-w-xs leading-normal animate-fade-in delay-200">{quote}</p>

            <NavList>
              <ul className="mt-16 w-max">
                {navItems.map((navItem, index) => (
                  <NavItem
                    key={navItem.name}
                    {...navItem}
                    className={`animate-slide-in-left delay-${(index + 1) * 100}`}
                  />
                ))}
              </ul>
            </NavList>
          </div>

          <div>
            <ul className="ml-1 mt-8 flex items-center flex-wrap gap-x-5 gap-y-2">
              {socials.map((social: any) => (
                <li key={social.name} className="text-xs shrink-0">
                  <a
                    href={social.url}
                    target="_blank"
                    className="block text-slate-400 hover:text-teal-300 transition-colors duration-200"
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
            {email && (
              <p className="mt-3 text-xs text-slate-500">
                <a href={`mailto:${email}`} className="hover:text-teal-300 transition-colors">
                  {email}
                </a>
              </p>
            )}
          </div>
        </header>

        <main className="pt-24 lg:w-1/2 lg:py-24">
          <HomeSection name="about">
            <div className="animate-fade-in-up">
              <RawHTML content={bio} />
            </div>
          </HomeSection>

          <HomeSection name="experiences">
            <ol className="group/list">
              {experiences.map((experience: any, index: number) => (
                <div
                  key={index}
                  className={`animate-fade-in-up delay-${(index + 1) * 100}`}
                >
                  <ExperienceItem {...experience} />
                </div>
              ))}
            </ol>
          </HomeSection>

          <HomeSection name="projects">
            <ul className="group/list">
              {projects.slice(0, 5).map((project: any, index: number) => (
                <div
                  key={index}
                  className={`hover-lift animate-fade-in-up delay-${(index + 1) * 100}`}
                >
                  <ProjectItem {...project} />
                </div>
              ))}
            </ul>

            <div className="mt-12 animate-fade-in delay-300">
              <a
                className="inline-flex items-center font-medium leading-tight text-slate-200 font-semibold text-slate-200 group"
                aria-label="View Full Projects"
                href="/projects"
              >
                <span className="border-b border-transparent text-slate-300 font-medium pb-px transition group-hover:border-teal-300 motion-reduce:transition-none">
                  View Full Project{' '}
                </span>
                <Icon
                  icon={faArrowRight}
                  className="ml-1 group-hover:text-teal-300 group-hover:transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:translate-x-0 transition-transform"
                />
              </a>
            </div>
          </HomeSection>

          <HomeSection name="blogs">
            {articles.length > 0 ? (
              <ul className="group/list">
                {articles.map((article, index) => (
                  <li
                    key={article.url}
                    className={`mb-12 animate-fade-in-up delay-${(index + 1) * 100}`}
                  >
                    <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
                      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                      <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
                        {article.readable_publish_date}
                      </header>
                      <div className="z-10 sm:col-span-6">
                        <h3>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 group/link text-base"
                          >
                            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50"></span>
                            <span className="relative">
                              {article.title}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="ml-1 inline-block h-4 w-4 shrink-0 -translate-y-px transition-transform group-hover/link:translate-x-1 group-hover/link:translate-y-1 group-focus-visible/link:translate-x-1 group-focus-visible/link:translate-y-1 motion-reduce:transition-none"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </a>
                        </h3>
                        <p className="mt-2 text-sm leading-normal">
                          {article.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                          <span>{article.reading_time_minutes} min read</span>
                          <span>·</span>
                          <ul className="flex flex-wrap gap-2" aria-label="Tags">
                            {article.tag_list.slice(0, 3).map((tag: string) => (
                              <li key={tag}>
                                <span className="rounded-full bg-teal-400/10 px-2 py-0.5 text-xs font-medium text-teal-300">
                                  {tag}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">
                I write about software development, web development, and software engineering on{' '}
                <a href="https://dev.to/jamesjf7" target="_blank" rel="noreferrer" className="text-teal-300 hover:underline">
                  dev.to
                </a>.
              </p>
            )}
            <div className="mt-12 animate-fade-in delay-300">
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
                  icon={faArrowRight}
                  className="ml-1 group-hover:text-teal-300 group-hover:transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:translate-x-0 transition-transform"
                />
              </a>
            </div>
          </HomeSection>

          <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0 animate-fade-in delay-500">
            <p>
              Built with intention. No templates were harmed in the making of this site.
            </p>
            <p className="mt-2">
              <a
                href={`mailto:${email}`}
                className="font-medium text-slate-400 hover:text-teal-300 transition-colors"
              >
                {email}
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
