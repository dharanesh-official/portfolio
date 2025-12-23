import { getPortfolioData } from "../lib/data";
import AboutClient from "../components/AboutClient";

export default async function About() {
    const data = await getPortfolioData();
    return <AboutClient data={data} />;
}
