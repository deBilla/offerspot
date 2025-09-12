// app/offer/[id]/page.js
import offers from "@/app/api/data.json";

export default function OfferPage({ params }) {
  const { id } = params;

  let offer;
  try {
    offer = offers.find((item) => item.id === id);
  } catch (error) {
    console.error("Error reading offers data:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold text-red-500">Error loading offer data</h1>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold text-red-500">Offer not found</h1>
      </div>
    );
  }

  // Use safe defaults
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 transition hover:shadow-2xl">
        {/* Bank and Card Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">{bank}</span>
          {card_types.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {card_types.join(", ")}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mt-2">{title}</h1>

        {/* Merchant */}
        {merchant?.name && (
          <p className="text-gray-600 mt-1 text-sm">Merchant: {merchant.name}</p>
        )}

        {/* Description */}
        <p className="text-gray-700 mt-4">{description}</p>

        {/* Offer Details */}
        {offer_details && (
          <p className="mt-3 text-green-700 font-semibold">
            {offer_details.type === "percentage"
              ? `${offer_details.value}% OFF`
              : offer_details.type === "amount"
              ? `Save ${offer_details.value}`
              : ""}
          </p>
        )}

        {/* Validity */}
        {validity ? (
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-semibold">Valid from:</span> {validity.start_date} <br />
            <span className="font-semibold">Until:</span> {validity.end_date}
          </p>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Validity: Not specified</p>
        )}

        {/* Terms */}
        <p className="text-sm text-gray-400 mt-2 border-t pt-2">{terms}</p>

        {/* Source Link */}
        <a
          href={source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Offer
        </a>
      </div>
    </div>
  );
}
