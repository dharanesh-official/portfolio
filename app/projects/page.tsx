import { getPortfolioData } from "../lib/data";
import ProjectsClient from "../components/ProjectsClient";

export default async function Projects() {
    const data = await getPortfolioData();
    return <ProjectsClient data={data} />;
}
