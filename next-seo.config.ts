const title: string = 'jamesjfoong.dev'
const description: string = 'Developer, Javascript'
const url: string = ''

const config = {
  title,
  description,
  canonical: url,
  openGraph: {
    type: 'website',
    locale: 'en_EN',
    url,
    site_name: 'jamesjfoong',
    title,
    description,
    images: [
      {
        url: 'https://jamesjfoong/favicon.svg',
        alt: title,
        width: 1280,
        height: 720,
      },
    ],
  },
}

export default config
