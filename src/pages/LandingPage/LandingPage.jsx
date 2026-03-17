import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-yellow-50 to-red-50 min-h-screen">
      {/* Language Switch */}
      <div className="flex justify-end p-4 gap-2">
        <button className="px-3 py-1 border rounded hover:bg-red-600 hover:text-white transition">
          English
        </button>
        <button className="px-3 py-1 border rounded hover:bg-red-600 hover:text-white transition">
          मराठी
        </button>
      </div>

      {/* FIXED HEADER */}
      <div className="sticky top-0 bg-gradient-to-b from-yellow-50 to-red-50 z-50 py-6">
        <div className="flex flex-col items-center text-center px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-[#C9A227] drop-shadow-md">
            माझी पैठणी
          </h1>

          <div className="flex gap-4 mt-6 flex-wrap justify-center">
            <button
              onClick={() => navigate("/explore")}
              className="px-6 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition shadow"
            >
              Explore
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition shadow"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow"
            >
              Register
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="px-6">
        <h2 className="mt-16 text-2xl md:text-3xl font-semibold text-gray-800 text-center">
          Authentic Paithani Sarees Direct From Artists
        </h2>

        <p className="mt-4 max-w-xl mx-auto text-gray-600 text-center">
          Connecting traditional Paithani artists with customers without
          middlemen
        </p>

        <div className="flex gap-4 mt-8 flex-wrap justify-center">
          <button className="px-6 py-3 bg-red-700 text-white rounded-lg shadow hover:scale-105 transition">
            Become a Seller
          </button>

          <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow hover:scale-105 transition">
            Explore Sarees
          </button>
        </div>

        <div className="mt-16 text-center animate-bounce text-gray-500">
          Scroll ↓
        </div>

        <div className="mt-32">
          <p className="text-center text-yellow-600 font-semibold tracking-widest text-sm mb-2">
            THE CHALLENGE
          </p>

          <h2 className="text-3xl font-bold text-center text-red-800">
            Problems with the Traditional Market
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-center text-gray-600 italic">
            In traditional Paithani saree sales, artisans rarely meet customers
            directly. Multiple middlemen increase the price while artisans
            receive less profit.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-red-700">
                Middlemen Control Pricing
              </h3>
              <p className="mt-3 text-gray-600">
                Paithani artists rely on middlemen who increase prices while
                artisans receive less profit.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-red-700">
                Limited Market Reach
              </h3>
              <p className="mt-3 text-gray-600">
                Artisans struggle to reach customers across India due to lack of
                digital platforms.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-red-700">
                Authenticity Issues
              </h3>
              <p className="mt-3 text-gray-600">
                Customers cannot easily identify authentic Paithani sarees.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-red-700">
                No Direct Communication
              </h3>
              <p className="mt-3 text-gray-600">
                Customers often cannot speak with artisans for customization,
                story, or trust.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-red-700">
                Artisans Get Less Profit
              </h3>
              <p className="mt-3 text-gray-600">
                The real creators of Paithani — whose hands weave every thread —
                receive only a fraction of the final selling price.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-32 px-6 pb-24">
          <p className="text-center text-yellow-600 font-semibold tracking-widest text-sm md:text-base mb-2">
            OUR SOLUTION
          </p>

          <h2 className="text-3xl font-bold text-center text-red-800">
            Direct Bridge Between Artist and Customer
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-center text-gray-600 italic text-sm md:text-base leading-relaxed px-4">
            Our platform connects Paithani artisans directly with customers. By
            removing middlemen we ensure fair prices for artists and authentic
            handcrafted Paithani sarees for buyers.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-red-700">
                Direct Artisan Connection
              </h3>
              <p className="mt-3 text-gray-600">
                Browse verified artisans, explore their craft, and build a
                relationship rooted in authenticity.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-red-700">
                Transparent Pricing
              </h3>
              <p className="mt-3 text-gray-600">
                Know exactly what you pay for — every rupee goes to the hands
                that weave.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-red-700">
                Custom Creations
              </h3>
              <p className="mt-3 text-gray-600">
                Request bespoke Paithani designs — from motif to colour to
                border — crafted only for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
