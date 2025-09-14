import offers from "@/app/api/data.json";
import { redirect } from "next/navigation";

// --- Helper Functions & Icons ---

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return 'N/A';
    }
};

const BankIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 text-gray-400"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 text-gray-400"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>;
const TermsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 text-gray-400"><path d="m12 14 4-4"/><path d="M12 14 8 10"/><path d="M12 20a8 8 0 0 0 8-8V7a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v5a8 8 0 0 0 8 8Z"/></svg>;
const ExternalLinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5 ml-2"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>);


// --- Page Component ---

export default async function OfferPage({ params }) {
  const { id } = await params;

  let offer;
  try {
    offer = offers.find((item) => item.id === id);
  } catch (error) {
    console.error("Error reading offers data:", error);
    redirect("/");
  }

  if (!offer) {
    redirect("/");
  }

  const {
    bank = "Unknown Bank",
    card_types = [],
    merchant = { name: "Unknown Merchant" },
    title = "Untitled Offer",
    description = "No description available.",
    offer_details = null,
    validity = null,
    terms = "No terms provided.",
    source_url = "#",
  } = offer;

  const renderDiscount = () => {
      if (!offer_details) return null;
      const { type, value, currency } = offer_details;
      if (type === 'percentage') return <span className="text-4xl font-extrabold text-green-600">{value || 0}% OFF</span>
      if (type === 'bogo') return <span className="text-3xl font-extrabold text-green-600">Buy One Get One</span>
      if (type === 'fixed') return <span className="text-3xl font-extrabold text-green-600">Save {currency || 'LKR'} {(value || 0).toLocaleString()}</span>
      return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl overflow-hidden transition hover:shadow-2xl duration-300 border border-gray-100">
        <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-6 border-b">
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{merchant.name}</p>
                    <h1 className="text-3xl font-bold text-gray-900 mt-1">{title}</h1>
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                    {renderDiscount()}
                </div>
            </div>

            {/* Main Details */}
            <div className="space-y-5">
                <div className="flex items-start">
                    <BankIcon />
                    <div>
                        <h2 className="font-semibold text-gray-800">Bank & Card Details</h2>
                        <p className="text-gray-600">{bank}</p>
                        {card_types.length > 0 && (
                            <span className="mt-1 inline-block px-2 py-1 bg-teal-50 text-teal-800 text-xs font-medium rounded-full border border-teal-200">
                                {card_types.join(", ")}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-start">
                    <CalendarIcon />
                    <div>
                        <h2 className="font-semibold text-gray-800">Validity Period</h2>
                        {validity ? (
                            <p className="text-gray-600">
                                From <span className="font-medium text-gray-700">{formatDate(validity.start_date)}</span> to <span className="font-medium text-gray-700">{formatDate(validity.end_date)}</span>
                            </p>
                        ) : (
                            <p className="text-gray-500">Validity not specified</p>
                        )}
                    </div>
                </div>

                 <div className="flex items-start">
                    <TagIcon />
                    <div>
                        <h2 className="font-semibold text-gray-800">Offer Description</h2>
                        <p className="text-gray-600 leading-relaxed">{description}</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <TermsIcon />
                    <div>
                        <h2 className="font-semibold text-gray-800">Terms & Conditions</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">{terms}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Action */}
        {source_url && source_url !== '#' && (
            <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-slate-50 border-t">
                <a
                  href={source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  View Original Offer
                  <ExternalLinkIcon />
                </a>
            </div>
        )}
      </div>
    </div>
  );
}
