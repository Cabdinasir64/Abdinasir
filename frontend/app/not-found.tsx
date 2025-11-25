import NotFound from '@/components/notfound/notfound'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Abdinasir Dev',
  description: 'The page you are looking for could not be found. It might have been moved or does not exist.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: '404 - Page Not Found | Abdinasir Dev',
    description: 'The page you are looking for could not be found. It might have been moved or does not exist.',
    url: 'https://abdinasir.dev/not-found',
    siteName: 'Abdinasir Dev',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '404 - Page Not Found | Abdinasir Dev',
    description: 'The page you are looking for could not be found. It might have been moved or does not exist.',
  },
}

const NotFoundPage = () => {
  return <NotFound />
}

export default NotFoundPage
