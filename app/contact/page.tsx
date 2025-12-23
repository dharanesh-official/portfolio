import { getPortfolioData } from "../lib/data";
import ContactClient from "../components/ContactClient";

export default async function Contact() {
    const data = await getPortfolioData();
    return <ContactClient data={data} />;
}
