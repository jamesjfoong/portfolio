'use client'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import data from 'data'
import Image from 'next/image'
import Link from 'next/link'

import Icon from '@/components/common/Icon'

export default function Page() {
  const { name, projects } = data

  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="lg:flex lg:justify-between lg:gap-4">
        <main className="pt-24 lg:py-24">
          <nav>
            <Link
              href={'/'}
              className="group mb-2 inline-flex items-center font-semibold leading-tight text-teal-300"
            >
              <Icon
                icon={faArrowLeft}
                className="mr-2 group-hover:-translate-x-1 transition-transform duration-200 ease-in-out"
              />
              {name}
            </Link>
          </nav>
          <section>
            <h1 className="text-3xl font-bold tracking-tight text-slate-200 sm:text-4xl">
              All Projects
            </h1>
          </section>

          <section>
            <table className="mt-12 w-full border-collapse text-left">
              <thead className="sticky top-0 z-10 border-b border-slate-300/10 bg-slate-900/75 px-6 py-5 backdrop-blur">
                <tr>
                  <th className="py-4 pr-8 text-sm font-semibold text-slate-200">
                    Year
                  </th>
                  <th className="py-4 pr-8 text-sm font-semibold text-slate-200">
                    Project
                  </th>
                  <th className="py-4 pr-8 text-sm font-semibold text-slate-200">
                    Image
                  </th>
                  <th className="py-4 pr-8 text-sm font-semibold text-slate-200">
                    Tech Stacks
                  </th>
                  <th className="py-4 pr-8 text-sm font-semibold text-slate-200">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr
                    key={project.name}
                    className="border-b border-slate-300/10 last:border-none"
                  >
                    <td className="py-4 pr-4 align-top text-sm">
                      {project.year}
                    </td>
                    <td className="py-4 pr-4 align-top font-semibold leading-snug text-slate-200">
                      {project.name}
                    </td>
                    <td className="py-4 pr-4 align-top text-sm">
                      <Image
                        src={project.image}
                        alt={project.name}
                        width={100}
                        height={100}
                      />
                    </td>
                    <td className="py-4 pr-4 align-top text-sm">
                      <ul
                        className="flex flex-wrap"
                        aria-label="Technologies used"
                      >
                        {project.technologies.map((technology: string) => (
                          <li key={technology} className="mr-1.5 mb-2">
                            <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 ">
                              {technology}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 pr-4 align-top text-sm">
                      <Link
                        href={project.link}
                        target="_blank"
                        className="hover:text-teal-300 transition-colors"
                      >
                        {project.link}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  )
}
