import Header from '@/components/header/Header'
import Hero from '@/components/hero/Hero';

export const metadata = {
  title: "Abdinasir | Full Stack Developer & Web Engineer from Somalia",
  description: "Abdinasir is a passionate Full Stack Developer and Computer Science student from Somalia. Expert in HTML, CSS, TailwindCSS, JavaScript, TypeScript, React, Next.js, Node.js, Express.js, MongoDB, Mongoose, Prisma, PostgreSQL, Zustand, GSAP, and Framer Motion. This portfolio showcases clean, scalable, and performant web applications.",
  keywords: [
    "Abdinasir", "Portfolio", "Full Stack Developer", "Somali Developer",
    "Web Developer", "Frontend Developer", "Backend Developer",
    "Next.js Developer", "React Developer", "Tailwind CSS",
    "JavaScript", "TypeScript", "HTML", "CSS", "Node.js", "Express.js",
    "MongoDB", "Mongoose", "PostgreSQL", "Prisma", "Zustand", "GSAP",
    "Framer Motion", "Software Engineer", "UI/UX", "Responsive Design"
  ],
  authors: [{ name: "Abdinasir" }],
  openGraph: {
    title: "Abdinasir | Full Stack Developer & Web Engineer from Somalia",
    description: "A professional portfolio of Abdinasir, showcasing advanced projects built with React, Next.js, TailwindCSS, Node.js, Prisma, Mongoose, MongoDB, PostgreSQL, GSAP, and Framer Motion — representing Somali innovation in web development.",
    url: "https://abdinasir.dev",
    siteName: "Abdinasir Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abdinasir Portfolio Preview",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdinasir | Full Stack Developer & Web Engineer from Somalia",
    description: "Explore Abdinasir’s portfolio — modern, performant, and scalable projects built with React, Next.js, TailwindCSS, Node.js, Prisma, MongoDB, PostgreSQL, GSAP, and Framer Motion.",
    images: ["/og-image.png"],
    creator: "@abdinasir",
  },
  metadataBase: new URL("https://abdinasir.dev"),
  alternates: {
    canonical: "https://abdinasir.dev",
  },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
    </>
  )
}
