import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Statistics from '@/components/Statistics'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Workflow from '@/components/Workflow'
import Education from '@/components/Education'
import Experience from '@/components/Experience'
import Certifications from '@/components/Certifications'
import Learning from '@/components/Learning'
import Insights from '@/components/Insights'
import GitHubSection from '@/components/GitHubSection'
import ResumeSection from '@/components/ResumeSection'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Statistics />
        <Skills />
        <Workflow />
        <Projects />
        <Education />
        <Experience />
        <Certifications />
        <Contact />
        <Learning />
        <Insights />
        <GitHubSection />
        <ResumeSection />
      </main>
      <Footer />
    </>
  )
}
