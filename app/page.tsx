import { getPortfolioData } from "./lib/data";
import HomeClient from "./components/HomeClient";
import AboutClient from "./components/AboutClient";
import ProjectsClient from "./components/ProjectsClient";
import ContactClient from "./components/ContactClient";

export default async function Home() {
  const data = await getPortfolioData();
  return (
    <main className="scroll-smooth">
      <section id="home">
        <HomeClient data={data} />
      </section>
      <section id="about">
        <AboutClient data={data} />
      </section>
      <section id="projects">
        <ProjectsClient data={data} />
      </section>
      <section id="contact">
        <ContactClient data={data} />
      </section>
    </main>
  );
}