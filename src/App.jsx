import React, { useState, useMemo } from 'react';
import data from './api/data.json';

// --- SVG Icons (as components for easy use) ---
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5 inline-block">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5 inline-block">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5 inline-block">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const CreditCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);


// --- Mock Data (using the improved JSON structure) ---
console.log(data);
const mockOffers = data;

const bankDetails = {
    "People's Bank": { color: 'from-blue-500 to-blue-700', textColor: 'text-white' },
    "Commercial Bank": { color: 'from-red-500 to-red-700', textColor: 'text-white' },
    "HNB": { color: 'from-yellow-400 to-yellow-600', textColor: 'text-gray-900' },
};


// --- Helper Functions ---
const getBankBadgeColor = (bank) => {
    switch (bank) {
        case "People's Bank": return 'bg-blue-100 text-blue-800';
        case 'Commercial Bank': return 'bg-red-100 text-red-800';
        case 'HNB': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};


// --- Components ---
const OfferCard = ({ offer }) => {
    const { bank, category, merchant, title, description, offer_details, validity, location } = offer;

    const renderDiscount = () => {
        if (offer_details.type === 'percentage') {
            return <span className="text-3xl font-bold text-emerald-600">{offer_details.value}% OFF</span>;
        }
        if (offer_details.type === 'bogo') {
            return <span className="text-2xl font-bold text-emerald-600">BOGO</span>;
        }
        if (offer_details.type === 'fixed') {
            return <span className="text-2xl font-bold text-emerald-600">Save {offer_details.currency} {offer_details.value.toLocaleString()}</span>
        }
        return null;
    };

    const googleMapsUrl = location?.latitude ? `https://www.google.com/maps?q=${location?.latitude},${location?.longitude}` : null;
    
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getBankBadgeColor(bank)}`}>
                        {bank}
                    </span>
                    <div className="text-center">
                        {renderDiscount()}
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-500">{merchant.name}</p>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{title}</h3>
                    <p className="text-gray-600 mt-2 text-sm">{description}</p>
                </div>
            </div>
            <div className="px-6 pt-4 pb-4 bg-gray-50 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center">
                        <TagIcon /><span className="font-medium">{category}</span>
                    </div>
                     <div className="flex items-center">
                        <CalendarIcon /><span>Valid until: <span className="font-medium">{formatDate(validity?.end_date)}</span></span>
                    </div>
                    {location?.address !== 'Online Booking' && googleMapsUrl ? (
                         <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                            <MapPinIcon />
                            <span>{location?.address}</span>
                        </a>
                    ) : (
                         <div className="flex items-center">
                            <MapPinIcon /><span>Online Booking</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BankCard = ({ bank, isSelected, onSelect }) => {
    const details = bankDetails[bank.name] || { color: 'from-gray-400 to-gray-600', textColor: 'text-white' };
    return (
        <button
            onClick={() => onSelect(bank.name)}
            className={`w-full p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isSelected ? 'ring-4 ring-offset-2 ring-indigo-500' : ''} bg-gradient-to-br ${details.color} ${details.textColor}`}
        >
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{bank.name}</h3>
                <CreditCardIcon />
            </div>
        </button>
    )
};

const BankSelectionModal = ({ banks, selectedBanks, onSelect, onClose, onClear }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Select Your Banks</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banks.map(bank => (
                            <BankCard 
                                key={bank.name} 
                                bank={bank} 
                                isSelected={selectedBanks.includes(bank.name)}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-b-xl flex justify-between items-center">
                     <button 
                        onClick={onClear} 
                        className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
                        disabled={selectedBanks.length === 0}
                    >
                        Clear Selection
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    >
                        Show Offers
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function App() {
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [selectedBanks, setSelectedBanks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const banks = useMemo(() => [...new Set(mockOffers.map(o => o.bank))].map(b => ({ name: b })), []);
    const categories = useMemo(() => ['All', ...new Set(mockOffers.map(o => o.category))], []);

    const handleBankSelect = (bankName) => {
        setSelectedBanks(prev => 
            prev.includes(bankName) 
                ? prev.filter(b => b !== bankName) 
                : [...prev, bankName]
        );
    };

    const filteredOffers = useMemo(() => {
        return mockOffers.filter(offer => {
            const bankMatch = selectedBanks.length === 0 || selectedBanks.includes(offer.bank);
            const categoryMatch = selectedCategory === 'All' || offer.category === selectedCategory;
            return bankMatch && categoryMatch;
        });
    }, [selectedBanks, selectedCategory]);

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Card Promotions LK</h1>
                    <p className="text-lg text-gray-600 mt-2">Find the best credit & debit card offers in Sri Lanka</p>
                </header>

                <div className="bg-white p-4 rounded-lg shadow-sm mb-8 sticky top-4 z-10 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <button 
                            onClick={() => setIsBankModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            <WalletIcon />
                            <span>My Wallet ({selectedBanks.length})</span>
                        </button>
                        <div className="flex-grow text-center sm:text-left">
                           <p className="text-sm text-gray-600">
                                {selectedBanks.length > 0 ? `Showing offers for: ` : `Showing offers for all banks.`}
                                <span className="font-semibold">{selectedBanks.join(', ')}</span>
                            </p>
                        </div>
                    </div>
                     <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                         <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${selectedCategory === category ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {isBankModalOpen && (
                    <BankSelectionModal 
                        banks={banks}
                        selectedBanks={selectedBanks}
                        onSelect={handleBankSelect}
                        onClose={() => setIsBankModalOpen(false)}
                        onClear={() => setSelectedBanks([])}
                    />
                )}

                {filteredOffers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredOffers.map(offer => <OfferCard key={offer.id} offer={offer} />)}
                    </div>
                ) : (
                     <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-gray-700">No offers found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your card selection or filters to find more promotions.</p>
                    </div>
                )}
                 
                 <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Built for the Sri Lankan market. Happy saving!</p>
                </footer>
            </div>
        </div>
    );
}

