import OfferBrowser from './components/OfferBrowser';
import data from './api/data.json';
import type { Offer } from '@/types/offer';

export default async function Home() {
  const allOffers = data as unknown as Offer[];
  return <OfferBrowser initialOffers={allOffers} />;
}