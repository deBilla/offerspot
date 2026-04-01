'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdSenseProvider from './AdsenseProvider';
import type { Offer } from '@/types/offer';
import { useFilterContext } from '@/app/context/FilterContext';

const topBanks = [
    { name: "Commercial Bank", url: "https://www.combank.lk/rewards-promotions" },
    { name: "DFCC Bank", url: "https://www.dfcc.lk/promotions-categories/card-promotions/" },
    { name: "People's Bank", url: "https://www.peoplesbank.lk/special-offers/" },
    { name: "Bank of Ceylon", url: "https://www.boc.lk/personal-banking/card-offers" },
    { name: "Seylan Bank", url: "https://www.seylan.lk/promotions/cards?type[]=credit_card" },
];

const useIsMobile = (breakpoint = 768): boolean => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [breakpoint]);
    return isMobile;
};

const MapPinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5 inline-block"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
const TagIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5 inline-block"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5 inline-block"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>);
const CreditCardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>);
const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>);
const ExternalLinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-4 h-4 ml-1 opacity-70 group-hover:opacity-100"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>);
const SparkleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>);
const LoadingSpinnerIcon = () => (<svg className="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

const bankDetails: Record<string, { color: string; textColor: string; accent: string }> = {
    "People's Bank": { color: 'from-blue-600 via-blue-700 to-indigo-800', textColor: 'text-white', accent: 'bg-blue-50 border-blue-200 text-blue-800' },
    "Commercial Bank": { color: 'from-red-600 via-rose-600 to-pink-700', textColor: 'text-white', accent: 'bg-red-50 border-red-200 text-red-800' },
    "HNB": { color: 'from-amber-500 via-yellow-500 to-orange-600', textColor: 'text-gray-900', accent: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    "Bank of Ceylon": { color: 'from-yellow-400 via-amber-400 to-yellow-500', textColor: 'text-gray-900', accent: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    "Sampath Bank": { color: 'from-emerald-600 via-green-600 to-teal-700', textColor: 'text-white', accent: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    "DFCC Bank": { color: 'from-purple-600 via-violet-600 to-indigo-700', textColor: 'text-white', accent: 'bg-purple-50 border-purple-200 text-purple-800' }
};

const getBankBadgeColor = (bank: string): string => bankDetails[bank]?.accent || 'bg-gray-100 border-gray-200 text-gray-800';
const formatDate = (dateString?: string | null): string => {
    if (!dateString || dateString === 'Not specified in the text') return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return 'N/A'; }
};
const getDaysUntilExpiry = (endDate?: string | null): number | null => {
    if (!endDate || endDate === 'Not specified in the text') return null;
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(endDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? diffDays : 0;
    } catch { return null; }
};
const toSafeISOString = (dateString?: string | null): string | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toISOString();
    }
    return undefined;
};
const generateOfferStructuredData = (offer: Offer) => {
    const baseUrl = 'https://www.cardpromotions.org';
    return {
        "@context": "https://schema.org", "@type": "Offer", "@id": `${baseUrl}/offer/${offer?.id}`,
        "name": offer?.title, "description": offer?.description, "url": offer?.source_url !== '#' ? offer?.source_url : `${baseUrl}/offer/${offer?.id}`,
        "image": `${baseUrl}/api/og?title=${encodeURIComponent(offer?.title)}&bank=${encodeURIComponent(offer?.bank)}`, "category": offer?.category,
        "offeredBy": { "@type": "Organization", "name": offer?.bank, "url": `${baseUrl}/bank/${encodeURIComponent(offer?.bank?.toLowerCase().replace(/\s+/g, '-'))}` },
        "seller": { "@type": "Organization", "name": offer?.merchant?.name || offer?.bank, "address": offer?.location?.address && offer?.location?.address !== 'Online Booking' && offer?.location?.address !== 'Not specified in the text' ? { "@type": "PostalAddress", "addressLocality": offer?.location?.address, "addressCountry": "LK" } : undefined },
        "validFrom": toSafeISOString(offer?.validity?.start_date), "validThrough": toSafeISOString(offer?.validity?.end_date), "availability": "https://schema.org/InStock",
        "itemOffered": { "@type": "Service", "name": `${offer?.category} Service`, "category": offer?.category }
    };
};

interface BankInfo {
    name: string;
    count: number;
}

interface OfferCardProps {
    offer: Offer;
    isExpanded: boolean;
    onExpand: (id: string) => void;
}

interface BankCardProps {
    bank: BankInfo;
    isSelected: boolean;
    onSelect: (name: string) => void;
}

interface BankSelectionModalProps {
    banks: BankInfo[];
    selectedBanks: string[];
    onSelect: (name: string) => void;
    onClose: () => void;
    onClear: () => void;
}


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const OfferCard = ({ offer, isExpanded, onExpand }: OfferCardProps) => {
    const [structuredData, setStructuredData] = useState<string | null>(null);
    useEffect(() => {
        if (offer) {
            setStructuredData(JSON.stringify(generateOfferStructuredData(offer)));
        }
    }, [offer]);

    if (!offer || !offer.id) return null;

    const { id, bank, category, title, description, terms, source_url } = offer;
    const merchantName = offer.merchant?.name || 'N/A';
    const endDate = offer.validity?.end_date;
    const locationAddress = offer.location?.address;
    const locationLat = offer.location?.latitude;
    const locationLng = offer.location?.longitude;
    const offerDetails = offer.offer_details;
    const daysLeft = getDaysUntilExpiry(endDate);
    const renderDiscount = () => {
        if (!offerDetails) return null;
        const { type, value, currency } = offerDetails;
        if (type === 'percentage') return (<div className="text-right"><div className="text-3xl font-bold text-green-600">{value || 0}%</div><div className="text-sm text-green-700 font-medium">OFF</div></div>);
        if (type === 'bogo') return (<div className="text-right"><div className="text-2xl font-bold text-green-600">BOGO</div><div className="text-xs text-green-700">Buy One Get One</div></div>);
        if (type === 'fixed') return (<div className="text-right"><div className="text-lg font-bold text-green-600">Save {currency || 'LKR'} {(value || 0).toLocaleString()}</div></div>);
        return null;
    };
    const googleMapsUrl = locationLat && locationLng ? `https://www.google.com/maps/search/?api=1&query=${locationLat},${locationLng}` : null;

    return (
        <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 overflow-hidden group border border-gray-100 flex flex-col">
            {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />}
            <div className="relative p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border ${getBankBadgeColor(bank)} transition-colors`}><SparkleIcon />{bank || 'Unknown Bank'}</span>
                        {daysLeft !== null && daysLeft <= 30 && (<span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${daysLeft <= 7 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>{daysLeft === 0 ? 'Expires today!' : `${daysLeft} days left`}</span>)}
                    </div>
                    <div className="text-center">{renderDiscount()}</div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{merchantName}</p>
                    <Link href={`/offer/${id}`} className="block mt-2 group/link">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover/link:text-teal-700 transition-colors">{title || 'Untitled Offer'}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{description || 'No description available.'}</p>
                </div>
            </div>
            <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
                <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-700"><TagIcon /><span className="font-medium">{category || 'Uncategorized'}</span></div>
                    <div className="flex items-center text-gray-700"><CalendarIcon /><span>Valid until: <span className="font-medium">{formatDate(endDate)}</span></span></div>
                    {locationAddress && locationAddress !== 'Online Booking' && locationAddress !== 'Not specified in the text' ? (googleMapsUrl ? (<a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"><MapPinIcon /><span className="line-clamp-1">{locationAddress}</span><ExternalLinkIcon /></a>) : (<div className="flex items-center text-gray-700"><MapPinIcon /><span className="line-clamp-1">{locationAddress}</span></div>)) : (<div className="flex items-center text-gray-700"><MapPinIcon /><span>Online / Multiple Locations</span></div>)}
                </div>
                {(terms || (source_url && source_url !== '#')) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button onClick={() => onExpand(id)} className="text-teal-600 hover:text-teal-800 font-medium text-sm flex items-center transition-colors">
                            {isExpanded ? 'Hide Details' : 'Show Terms & Details'}
                            <svg className={`ml-1 w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isExpanded && (
                            <div className="mt-3 space-y-3 text-sm animate-in slide-in-from-top duration-200">
                                {terms && (<div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="font-medium text-gray-900 mb-2">Terms & Conditions:</p>
                                    <p className="text-gray-700">{terms}</p>
                                </div>)}
                                {source_url && source_url !== '#' && (<a href={source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors">Visit Offer Page<ExternalLinkIcon /></a>)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

const BankCard = ({ bank, isSelected, onSelect }: BankCardProps) => {
    const details = bankDetails[bank.name] || { color: 'from-gray-500 to-gray-700', textColor: 'text-white' };
    return (
        <button onClick={() => onSelect(bank.name)} className={`w-full p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isSelected ? 'ring-4 ring-offset-2 ring-teal-500 scale-105' : 'hover:scale-102'} bg-gradient-to-br ${details.color} ${details.textColor} relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative flex justify-between items-center"><div className="text-left"><h3 className="text-lg font-bold mb-1">{bank.name}</h3><p className="text-sm opacity-90">{bank.count} {bank.count === 1 ? 'offer' : 'offers'}</p></div><CreditCardIcon /></div>
            {isSelected && (<div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>)}
        </button>
    );
};

const BankSelectionModal = ({ banks, selectedBanks, onSelect, onClose, onClear }: BankSelectionModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredBanks = useMemo(() => banks.filter(bank => bank.name.toLowerCase().includes(searchTerm.toLowerCase())), [banks, searchTerm]);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all animate-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-green-50 rounded-t-2xl">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Select Your Banks</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"><XIcon /></button></div>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><SearchIcon /></span><input type="text" placeholder="Search banks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900" /></div>
                    {selectedBanks.length > 0 && (<div className="mt-4 text-sm text-gray-600"><span className="font-medium">{selectedBanks.length}</span> bank{selectedBanks.length !== 1 ? 's' : ''} selected</div>)}
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBanks.map(bank => (<BankCard key={bank.name} bank={bank} isSelected={selectedBanks.includes(bank.name)} onSelect={onSelect} />))}
                    </div>
                    {filteredBanks.length === 0 && (<div className="text-center py-12"><div className="text-gray-400 mb-2 flex justify-center"><SearchIcon /></div><h3 className="text-lg font-medium text-gray-900 mb-1">No banks found</h3><p className="text-gray-500">Try adjusting your search terms</p></div>)}
                </div>
                <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4"><button onClick={onClear} className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50" disabled={selectedBanks.length === 0}>Clear All</button><button onClick={onClose} className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105">Show {selectedBanks.length > 0 ? `${selectedBanks.length} Bank's` : 'All'} Offers</button></div>
            </div>
        </div>
    );
};


const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const handlePrevious = () => onPageChange(Math.max(1, currentPage - 1));
    const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

    const getPageNumbers = (): (number | string)[] => {
        const pages = new Set<number>();
        pages.add(1);
        pages.add(totalPages);
        pages.add(currentPage);
        if (currentPage > 1) pages.add(currentPage - 1);
        if (currentPage < totalPages) pages.add(currentPage + 1);

        const pageList = Array.from(pages).sort((a, b) => a - b);
        const finalPages: (number | string)[] = [];
        let lastPage = 0;

        for (const page of pageList) {
            if (lastPage < page - 1) {
                finalPages.push('...');
            }
            finalPages.push(page);
            lastPage = page;
        }
        return finalPages;
    };

    return (
        <nav aria-label="Pagination" className="flex justify-center my-8 sm:my-12">
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button onClick={handlePrevious} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Previous
                    </button>
                </li>
                {getPageNumbers().map((page, index) => (
                    <li key={index}>
                        {page === '...' ? (
                            <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">...</span>
                        ) : (
                            <button onClick={() => onPageChange(page as number)} className={`flex items-center justify-center px-4 h-10 leading-tight border transition-colors ${currentPage === page ? 'text-white bg-teal-600 border-teal-600 hover:bg-teal-700' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`}>
                                {page}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button onClick={handleNext} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default function OfferBrowser({ initialOffers }: { initialOffers: Offer[] }) {
    const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedBanks, setSelectedBanks, isBankModalOpen, setIsBankModalOpen, setMeta } = useFilterContext();
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [offersPerPage] = useState(9);
    const mockOffers = initialOffers || [];
    const isMobile = useIsMobile();
    const loaderRef = useRef<HTMLDivElement>(null);

    const { banks, categories, filteredOffers, sortedOffers, totalPages, displayedOffers } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeOffers = mockOffers.filter(offer => {
            if (!offer) return false;
            const endDateString = offer.validity?.end_date;
            if (!endDateString || endDateString === 'Not specified in the text') {
                return true;
            }
            try {
                const offerEndDate = new Date(endDateString);
                return offerEndDate >= today;
            } catch {
                return true;
            }
        });

        const bankCounts = activeOffers.reduce<Record<string, number>>((acc, offer) => {
            if (offer.bank) {
                acc[offer.bank] = (acc[offer.bank] || 0) + 1;
            }
            return acc;
        }, {});
        const banks: BankInfo[] = Object.entries(bankCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

        const allCategories = activeOffers.map(o => o.category).filter((c): c is string => Boolean(c));
        const categories = ['All', ...Array.from(new Set(allCategories)).sort()];

        const filteredOffers = activeOffers.filter(offer => {
            const bankMatch = selectedBanks.length === 0 || selectedBanks.includes(offer.bank);
            const categoryMatch = selectedCategory === 'All' || offer.category === selectedCategory;
            const term = searchTerm.toLowerCase();
            const searchMatch = !term ||
                Object.values(offer).some(val => typeof val === 'string' && val.toLowerCase().includes(term)) ||
                offer.merchant?.name?.toLowerCase().includes(term) ||
                offer.location?.address?.toLowerCase().includes(term);
            return bankMatch && categoryMatch && searchMatch;
        });

        const getDiscountWeight = (offer: Offer): number => {
            const details = offer?.offer_details;
            if (!details) return 0;
            if (details.type === 'percentage') return details.value || 0;
            if (details.type === 'bogo') return 50;
            if (details.type === 'fixed') return (details.value || 0) / 1000;
            return 0;
        };
        const sortedOffers = [...filteredOffers].sort((a, b) => {
            const daysLeftA = getDaysUntilExpiry(a?.validity?.end_date);
            const daysLeftB = getDaysUntilExpiry(b?.validity?.end_date);
            if (daysLeftA !== null && daysLeftB !== null) {
                if (daysLeftA < daysLeftB) return -1;
                if (daysLeftA > daysLeftB) return 1;
            }
            if (daysLeftA !== null && daysLeftB === null) return -1;
            if (daysLeftA === null && daysLeftB !== null) return 1;
            return getDiscountWeight(b) - getDiscountWeight(a);
        });

        const totalPages = Math.ceil(sortedOffers.length / offersPerPage);

        const indexOfLastOffer = currentPage * offersPerPage;
        const displayedOffers = isMobile
            ? sortedOffers.slice(0, indexOfLastOffer)
            : sortedOffers.slice(indexOfLastOffer - offersPerPage, indexOfLastOffer);

        return { banks, categories, filteredOffers, sortedOffers, totalPages, displayedOffers };
    }, [mockOffers, selectedBanks, selectedCategory, searchTerm, currentPage, offersPerPage, isMobile]);

    const handleBankSelect = (bankName: string) => {
        setSelectedBanks(prev => prev.includes(bankName) ? prev.filter(b => b !== bankName) : [...prev, bankName]);
    };

    const handleCardExpand = (offerId: string) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            newSet.has(offerId) ? newSet.delete(offerId) : newSet.add(offerId);
            return newSet;
        });
    };

    useEffect(() => {
        setMeta({ categories, banks, resultsCount: sortedOffers.length });
    }, [categories, banks, sortedOffers.length, setMeta]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedBanks, selectedCategory, searchTerm, isMobile]);

    useEffect(() => {
        if (!isMobile) return;
        const observer = new IntersectionObserver(
            entries => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting && currentPage < totalPages) {
                    setCurrentPage(prevPage => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );
        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }
        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [isMobile, currentPage, totalPages]);

    return (
        <>
            <AdSenseProvider />
            <main className="min-h-screen bg-slate-50">
                <div className="bg-gradient-to-r from-teal-700 to-blue-800 py-2.5">
                    <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-white">
                        <div className="flex items-center gap-1.5">
                            <SparkleIcon />
                            <span className="font-semibold">{sortedOffers.length}</span>
                            <span className="text-blue-200">Offers</span>
                        </div>
                        <div className="w-px h-4 bg-white/30"></div>
                        <div className="flex items-center gap-1.5">
                            <CreditCardIcon />
                            <span className="font-semibold">{banks.length}</span>
                            <span className="text-blue-200">Banks</span>
                        </div>
                        <div className="w-px h-4 bg-white/30"></div>
                        <div className="flex items-center gap-1.5">
                            <TagIcon />
                            <span className="font-semibold">{categories.length - 1}</span>
                            <span className="text-blue-200">Categories</span>
                        </div>
                        {(searchTerm || selectedCategory !== 'All' || selectedBanks.length > 0) && (
                            <>
                                <div className="w-px h-4 bg-white/30"></div>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedBanks([]); }}
                                    className="text-blue-200 hover:text-white transition-colors text-xs flex items-center gap-1"
                                >
                                    <XIcon /> Clear filters
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="container mx-auto px-4 py-6 sm:py-8">
                    {isBankModalOpen && (<BankSelectionModal banks={banks} selectedBanks={selectedBanks} onSelect={handleBankSelect} onClose={() => setIsBankModalOpen(false)} onClear={() => setSelectedBanks([])} />)}

                    {displayedOffers.length > 0 ? (
                        <section aria-labelledby="offers-heading">
                            <h2 id="offers-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-7">
                                {selectedCategory === 'All' ? 'Latest Offers' : `${selectedCategory} Offers`}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {displayedOffers.map(offer => (<OfferCard key={offer?.id} offer={offer} isExpanded={expandedCards.has(offer?.id)} onExpand={handleCardExpand} />))}
                            </div>
                            {isMobile ? (currentPage < totalPages && <div ref={loaderRef} className="flex justify-center items-center p-8"><LoadingSpinnerIcon /></div>) : (<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />)}
                        </section>
                    ) : (
                        <section className="text-center py-16 sm:py-24" aria-label="No offers found">
                            <div className="max-w-sm mx-auto">
                                <div className="w-16 h-16 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <SearchIcon />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">No offers found</h2>
                                <p className="text-gray-500 text-sm mb-6">
                                    Try adjusting your filters or search terms.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedBanks([]); }}
                                    className="inline-flex items-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors text-sm"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </section>
                    )}

                    <footer className="text-center mt-16 py-12 border-t border-gray-200">
                        <div className="max-w-5xl mx-auto px-4">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Unlock Savings in Sri Lanka</h2>
                                <p className="max-w-2xl mx-auto text-gray-600 mb-6 leading-relaxed">
                                    Your go-to platform for discovering the latest credit and debit card promotions from all major banks in Sri Lanka.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                                <div className="text-center md:text-left">
                                    <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li><a href="/offers" className="hover:text-teal-600 hover:underline">All Offers</a></li>
                                        <li><a href="/categories/dining" className="hover:text-teal-600 hover:underline">Dining Deals</a></li>
                                        <li><a href="/categories/shopping" className="hover:text-teal-600 hover:underline">Shopping Discounts</a></li>
                                    </ul>
                                </div>

                                <div className="text-center md:text-left">
                                    <h3 className="font-semibold text-gray-800 mb-3">Top Bank Promotions</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        {topBanks.map(bank => (
                                            <li key={bank.name}>
                                                <a href={bank.url} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 hover:underline inline-flex items-center group">
                                                    {bank.name}
                                                    <ExternalLinkIcon />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-center md:text-left">
                                    <h3 className="font-semibold text-gray-800 mb-3">Our Platform</h3>
                                    <div className="flex flex-col items-center md:items-start gap-2 text-gray-600">
                                        <span className="flex items-center">🏦 {banks.length}+ Banks Covered</span>
                                        <span className="flex items-center">🎯 {mockOffers.length}+ Offers Live</span>
                                        <span className="flex items-center">🏪 {new Set(mockOffers.map(o => o?.merchant?.name).filter(Boolean)).size}+ Merchants</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4">Happy saving! 💰</p>
                                </div>
                            </div>

                            <div className="text-center text-xs text-gray-400 mt-12 border-t border-gray-200 pt-6">
                                <p>© {new Date().getFullYear()} cardpromotions.org. All Rights Reserved.</p>
                                <p className="mt-1">
                                    <a href="/privacy-policy" className="hover:underline">Privacy Policy</a> · <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
                <style>{`
                .animation-delay-2000 { animation-delay: 2s; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes slideInFromTop { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-in { animation-fill-mode: both; }
                .slide-in-from-top { animation-name: slideInFromTop; animation-duration: 200ms; }
                .zoom-in { animation-name: zoomIn; animation-duration: 200ms; }
            `}</style>
            </main>
        </>
    );
}