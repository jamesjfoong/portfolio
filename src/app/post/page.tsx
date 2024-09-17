import {
  faArrowLeft,
  faSquareArrowUpRight,
} from '@fortawesome/free-solid-svg-icons'
import data from 'data'
import Image from 'next/image'
import Link from 'next/link'

import Icon from '@/components/common/Icon'
import { fetchPosts } from '@/lib/devto/fetch'

export default async function Page() {
  const { name } = data
  const posts = await fetchPosts()

  return (
    <section className="flex flex-col justify-center max-w-6xl min-h-screen px-4 py-10 mx-auto sm:px-6">
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
      <div className="flex flex-wrap -mx-4">
        <div className="w-full max-w-full mb-8 sm:w-1/2 px-4 lg:w-1/3 flex flex-col">
          {posts.map(post => (
            <Link href={`/post/${post.slug}`} key={post.id}>
              <article className="p-4 border border-gray-200 rounded-lg bg-white">
                <Image
                  src={post.cover_image || '/assets/image-placeholder.png'}
                  width={800}
                  height={400}
                  alt={post.title}
                  placeholder="blur"
                  blurDataURL="/assets/image-placeholder.png"
                  className="object-cover object-center w-full h-48"
                />
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p>{post.description}</p>
                <p className="text-sm text-gray-600">
                  {post.readable_publish_date}
                </p>
                <div>
                  <a
                    href="#"
                    className="inline-block pb-1 mt-2 text-base font-black text-blue-600 uppercase border-b border-transparent hover:border-blue-600"
                  >
                    Read More <Icon icon={faSquareArrowUpRight} />
                  </a>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
