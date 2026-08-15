export interface OfferDetails {
  type: 'percentage' | 'bogo' | 'fixed' | string;
  value?: number | null;
  currency?: string | null;
  max_discount_lkr?: number | null;
}

export interface Validity {
  start_date?: string | null;
  end_date?: string | null;
  /** Weekday names the offer applies to, e.g. ["Monday"]. */
  days?: string[] | null;
}

export interface Location {
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Merchant {
  name?: string | null;
  logo_url?: string | null;
}

export interface Offer {
  id: string;
  bank: string;
  card_types: string[];
  /**
   * The bank's own product name for the card ("Platinum Mastercard"), when its
   * promotion page stated one. Present on offers crawled from August 2026 and
   * null on everything imported before that, so treat it as optional.
   */
  card_name?: string | null;
  merchant: Merchant;
  title: string;
  description: string;
  offer_details: OfferDetails | null;
  validity: Validity | null;
  terms: string | null;
  source_url: string;
  category: string;
  location: Location;
}
