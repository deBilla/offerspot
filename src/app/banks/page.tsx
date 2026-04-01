import OfferBrowser from '../components/OfferBrowser';
import data from '../api/data.json';
import type { Offer } from '@/types/offer';

export default async function Banks() {
  return <OfferBrowser initialOffers={data as unknown as Offer[]} />;
}