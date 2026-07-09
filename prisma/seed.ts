import { PrismaClient } from '@prisma/client'
import { hashSecret } from '../server/utils/password'

const prisma = new PrismaClient()

async function main() {
  // Admin credentials come from env (.env, gitignored) — never hardcoded in source.
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me'

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashSecret(adminPassword), name: 'Admin', role: 'admin' },
    create: {
      email: adminEmail,
      passwordHash: hashSecret(adminPassword),
      name: 'Admin',
      role: 'admin',
    },
  })

  const blog = [
    { title: 'How we price a website', slug: 'how-we-price', shortDescription: 'Transparent pricing, no surprises.', tags: ['Process', 'Pricing'], isPublished: true },
    { title: 'Landing vs corporate site', slug: 'landing-vs-corporate', shortDescription: 'Which one fits your goal.', tags: ['Strategy'], isPublished: true },
    { title: 'How to choose a studio', slug: 'choose-a-studio', shortDescription: 'Red flags and green lights.', tags: ['Guide'], isPublished: false },
  ]

  const faq = [
    { question: 'How long does a project take?', answer: 'Typically 3–6 weeks depending on scope.', position: 1 },
    { question: 'How is pricing structured?', answer: 'Fixed price per milestone, agreed upfront.', position: 2 },
    { question: 'Do you support after launch?', answer: 'Yes — 30 days of free support, then a retainer.', position: 3 },
  ]

  const projects = [
    { title: 'Zimenko', slug: 'zimenko', client: 'Zimenko', type: 'Corporate website', year: 2025, description: 'Brand site for a construction company.', position: 1 },
    { title: 'InkHeart', slug: 'inkheart', client: 'InkHeart Studio', type: 'Landing page', year: 2025, description: 'Tattoo studio landing with booking.', position: 2 },
    { title: 'King Gym', slug: 'king-gym', client: 'King Gym', type: 'Web app', year: 2024, description: 'Membership and schedule platform.', position: 3 },
  ]

  const services = [
    { title: 'Strategy & Brand', slug: 'strategy-brand', description: 'Positioning, identity and messaging that set direction.', icon: 'pi pi-compass', position: 1 },
    { title: 'Design & Code', slug: 'design-code', description: 'Design systems and production-ready front-end.', icon: 'pi pi-palette', position: 2 },
    { title: 'Launch & Grow', slug: 'launch-grow', description: 'Deployment, analytics and iterative growth.', icon: 'pi pi-chart-line', position: 3 },
  ]

  const team = [
    { name: 'Andrii Overchenko', slug: 'andrii', role: 'Founder / Lead', bio: 'Full-cycle web, 10+ years.', position: 1 },
    { name: 'Maria K.', slug: 'maria', role: 'Designer', bio: 'Brand & UI design.', position: 2 },
    { name: 'Ivan P.', slug: 'ivan', role: 'Developer', bio: 'Front-end & Nuxt.', position: 3 },
  ]

  const pages = [
    { title: 'About', slug: 'about-page', content: '<p>We are a full-cycle web studio.</p>', isPublished: true },
    { title: 'Privacy Policy', slug: 'privacy-page', content: '<p>Privacy policy…</p>', isPublished: true },
  ]

  for (const item of blog) await prisma.blog.upsert({ where: { slug: item.slug }, update: {}, create: item })
  for (const item of projects) await prisma.project.upsert({ where: { slug: item.slug }, update: {}, create: item })
  for (const item of services) await prisma.service.upsert({ where: { slug: item.slug }, update: {}, create: item })
  for (const item of team) await prisma.teamMember.upsert({ where: { slug: item.slug }, update: {}, create: item })
  for (const item of pages) await prisma.staticPage.upsert({ where: { slug: item.slug }, update: {}, create: item })
  await prisma.faq.deleteMany()
  await prisma.faq.createMany({ data: faq })

  console.log('Seed done: %d blog, %d faq, %d projects, %d services, %d team, %d pages',
    blog.length, faq.length, projects.length, services.length, team.length, pages.length)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
