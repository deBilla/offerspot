import OfferBrowser from '../components/OfferBrowser';
import data from '../api/data.json';

// This is a Server Component. It runs on the server to fetch data.
export default async function Search() {
  const allOffers = data;
  return <OfferBrowser initialOffers={allOffers} />;
}