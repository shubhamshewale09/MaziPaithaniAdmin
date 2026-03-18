import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className='bg-gradient-to-b from-yellow-50 to-red-50 min-h-screen'>
      {/* Language Switch */}
      <div className='flex justify-end p-4 gap-2'>
        <button className='px-3 py-1 border rounded hover:bg-red-600 hover:text-white transition'>
          English
        </button>
        <button className='px-3 py-1 border rounded hover:bg-red-600 hover:text-white transition'>
          मराठी
        </button>
      </div>

      {/* FIXED HEADER */}
      <div className='sticky top-0 bg-gradient-to-b from-yellow-50 to-red-50 z-50 py-6'>
        <div className='flex flex-col items-center text-center px-6'>
          <h1 className='text-3xl md:text-5xl font-bold text-[#C9A227] drop-shadow-md'>
            माझी पैठणी
          </h1>

          <div className='flex gap-4 mt-6 flex-wrap justify-center'>
            <button
              onClick={() => navigate('/explore')}
              className='px-6 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition shadow'
            >
              Explore
            </button>

            <button
              onClick={() => navigate('/login')}
              className='px-6 py-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition shadow'
            >
              Login
            </button>

            <button
              onClick={() => navigate('/register')}
              className='px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow'
            >
              Register
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className='px-6'>
        <h2 className='mt-16 text-2xl md:text-3xl font-semibold text-gray-800 text-center'>
          Authentic Paithani Sarees Direct From Artists
        </h2>

        <p className='mt-4 max-w-xl mx-auto text-gray-600 text-center'>
          Connecting traditional Paithani artists with customers without
          middlemen
        </p>

        {/* Buttons */}
        <div className='flex gap-4 mt-8 flex-wrap justify-center'>
          <button className='px-6 py-3 bg-red-700 text-white rounded-lg shadow hover:scale-105 transition'>
            Become a Seller
          </button>

          <button className='px-6 py-3 bg-yellow-600 text-white rounded-lg shadow hover:scale-105 transition'>
            Explore Sarees
          </button>
        </div>

        <div className='mt-16 text-center animate-bounce text-gray-500'>
          Scroll ↓
        </div>

        {/* Problems Section */}
        <div className='mt-32'>
          <p className='text-center text-yellow-600 font-semibold tracking-widest text-sm mb-2'>
            THE CHALLENGE
          </p>
          <h2 className='text-3xl font-bold text-center text-red-800'>
            Problems with the Traditional Market
          </h2>
          <p className='mt-4 max-w-3xl mx-auto text-center text-gray-600 italic'>
            In traditional Paithani saree sales, artisans rarely meet customers
            directly. Multiple middlemen increase the price while artisans
            receive less profit.
          </p>
          <div className='grid md:grid-cols-3 gap-8 mt-12'>
            {/* ... your existing problem cards remain unchanged ... */}
            <div className='p-6 bg-white rounded-xl shadow hover:shadow-xl transition'>
              <h3 className='text-xl font-semibold text-red-700'>
                Middlemen Control Pricing
              </h3>
              <p className='mt-3 text-gray-600'>
                Paithani artists rely on middlemen who increase prices while
                artisans receive less profit.
              </p>
            </div>
            <div className='p-6 bg-white rounded-xl shadow hover:shadow-xl transition'>
              <h3 className='text-xl font-semibold text-red-700'>
                Limited Market Reach
              </h3>
              <p className='mt-3 text-gray-600'>
                Artisans struggle to reach customers across India due to lack of
                digital platforms.
              </p>
            </div>
            <div className='p-6 bg-white rounded-xl shadow hover:shadow-xl transition'>
              <h3 className='text-xl font-semibold text-red-700'>
                Authenticity Issues
              </h3>
              <p className='mt-3 text-gray-600'>
                Customers cannot easily identify authentic Paithani sarees.
              </p>
            </div>
            <div className='p-6 bg-white rounded-xl shadow hover:shadow-xl transition'>
              <h3 className='text-xl font-semibold text-red-700'>
                No Direct Communication
              </h3>
              <p className='mt-3 text-gray-600'>
                Customers often cannot speak with artisans for customization,
                story, or trust.
              </p>
            </div>
            <div className='p-6 bg-white rounded-xl shadow hover:shadow-xl transition'>
              <h3 className='text-xl font-semibold text-red-700'>
                Artisans Get Less Profit
              </h3>
              <p className='mt-3 text-gray-600'>
                The real creators of Paithani — whose hands weave every thread —
                receive only a fraction of the final selling price.
              </p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className='mt-32 px-6 pb-24'>
          <p className='text-center text-yellow-600 font-semibold tracking-widest text-sm md:text-base mb-2'>
            OUR SOLUTION
          </p>
          <h2 className='text-3xl font-bold text-center text-red-800'>
            Direct Bridge Between Artist and Customer
          </h2>
          <p className='mt-4 max-w-3xl mx-auto text-center text-gray-600 italic text-sm md:text-base leading-relaxed px-4'>
            Our platform connects Paithani artisans directly with customers. By
            removing middlemen we ensure fair prices for artists and authentic
            handcrafted Paithani sarees for buyers.
          </p>
          <div className='grid md:grid-cols-3 gap-8 mt-12'>
            {/* ... your existing solution cards remain unchanged ... */}
            <div className='p-6 bg-white rounded-xl shadow hover:shadow-xl transition'>
              <h3 className='text-xl font-semibold text-red-700'>
                Direct Artisan Connection
              </h3>
              <p className='mt-3 text-gray-600'>
                Browse verified artisans, explore their craft, and build a
                relationship rooted in authenticity.
              </p>
            </div>
            <div className='p-6 bg-white rounded-xl shadow hover:shadow-xl transition'>
              <h3 className='text-xl font-semibold text-red-700'>
                Transparent Pricing
              </h3>
              <p className='mt-3 text-gray-600'>
                Know exactly what you pay for — every rupee goes to the hands
                that weave.
              </p>
            </div>
            <div className='p-6 bg-white rounded-xl shadow hover:shadow-xl transition'>
              <h3 className='text-xl font-semibold text-red-700'>
                Custom Creations
              </h3>
              <p className='mt-3 text-gray-600'>
                Request bespoke Paithani designs — from motif to colour to
                border — crafted only for you.
              </p>
            </div>
          </div>
        </div>

        {/* Who Benefits Section - with hover & better right alignment */}
        <div className='mt-26 px-6 pb-26'>
          <p className='text-center text-yellow-600 font-semibold tracking-widest text-sm md:text-base mb-2'>
            WHO BENEFITS
          </p>

          <h2 className='text-3xl md:text-4xl font-bold text-center text-red-800'>
            For Every Part of the Story
          </h2>

          <div className='mt-12 grid md:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto justify-items-stretch'>
            {/* Left - Customers */}
            <div className='md:pr-6 md:pl-10'>
              <h3 className='text-2xl md:text-3xl font-bold text-red-700 mb-8 text-center md:text-left flex items-center gap-3'>
                <svg
                  className='w-8 h-8 text-black'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <circle cx='12' cy='8' r='3' />
                  <path d='M12 12c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                  <circle cx='18' cy='8' r='2' opacity='0.6' />
                  <path
                    d='M18 11c-1.78 0-5.33.89-5.33 2.67V16h10.67v-2.33c0-1.78-3.56-2.67-5.34-2.67z'
                    opacity='0.6'
                  />
                </svg>
                For Customers
              </h3>
              <ul className='space-y-6 text-lg'>
                <li className='flex items-start group hover:bg-white p-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-lg hover:scale-105'>
                  <span className='text-yellow-600 text-2xl mr-4 font-bold group-hover:text-yellow-700'>
                    →
                  </span>
                  <span className='text-gray-800 group-hover:text-gray-900'>
                    Buy authentic Paithani directly from artisans
                  </span>
                </li>
                <li className='flex items-start group hover:bg-white p-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-lg hover:scale-105'>
                  <span className='text-yellow-600 text-2xl mr-4 font-bold group-hover:text-yellow-700'>
                    →
                  </span>
                  <span className='text-gray-800 group-hover:text-gray-900'>
                    No middleman commission
                  </span>
                </li>
                <li className='flex items-start group hover:bg-white p-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-lg hover:scale-105'>
                  <span className='text-yellow-600 text-2xl mr-4 font-bold group-hover:text-yellow-700'>
                    →
                  </span>
                  <span className='text-gray-800 group-hover:text-gray-900'>
                    Transparent pricing
                  </span>
                </li>
                <li className='flex items-start group hover:bg-white p-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-lg hover:scale-105'>
                  <span className='text-yellow-600 text-2xl mr-4 font-bold group-hover:text-yellow-700'>
                    →
                  </span>
                  <span className='text-gray-800 group-hover:text-gray-900'>
                    Customization options available
                  </span>
                </li>
              </ul>
            </div>

            {/* Right - Sellers (pushed more right) */}
            <div className='md:pl-40 lg:pl-58'>
              <h3 className='text-2xl md:text-3xl font-bold text-red-700 mb-8 text-center md:text-left flex items-center gap-3'>
                <svg
                  className='w-8 h-8 text-black'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M19 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V11c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 9V5h14v4H5zm2 4h10v9H7v-9z' />
                  <rect x='9' y='13' width='2' height='2' />
                  <rect x='13' y='13' width='2' height='2' />
                  <rect x='9' y='17' width='2' height='2' />
                  <rect x='13' y='17' width='2' height='2' />
                </svg>
                For Sellers
              </h3>
              <ul className='space-y-6 text-lg'>
                <li className='flex items-start group hover:bg-white p-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-lg hover:scale-105'>
                  <span className='text-yellow-600 text-2xl mr-4 font-bold group-hover:text-yellow-700'>
                    →
                  </span>
                  <span className='text-gray-800 group-hover:text-gray-900'>
                    Reach customers across India
                  </span>
                </li>
                <li className='flex items-start group hover:bg-white p-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-lg hover:scale-105'>
                  <span className='text-yellow-600 text-2xl mr-4 font-bold group-hover:text-yellow-700'>
                    →
                  </span>
                  <span className='text-gray-800 group-hover:text-gray-900'>
                    Sell directly without middlemen
                  </span>
                </li>
                <li className='flex items-start group hover:bg-white p-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-lg hover:scale-105'>
                  <span className='text-yellow-600 text-2xl mr-4 font-bold group-hover:text-yellow-700'>
                    →
                  </span>
                  <span className='text-gray-800 group-hover:text-gray-900'>
                    Showcase your craftsmanship
                  </span>
                </li>
                <li className='flex items-start group hover:bg-white p-3 rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-lg hover:scale-105'>
                  <span className='text-yellow-600 text-2xl mr-4 font-bold group-hover:text-yellow-700'>
                    →
                  </span>
                  <span className='text-gray-800 group-hover:text-gray-900'>
                    Get better profit margins
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Process Section - New Design */}
        <div className='mt-28 px-6 pb-28'>
          <p className='text-center text-yellow-600 font-semibold tracking-widest text-sm md:text-base mb-2'>
            HOW IT WORKS
          </p>

          <h2 className='text-3xl md:text-4xl font-bold text-center text-red-800'>
            Simple and Transparent Process
          </h2>

          <div className='mt-12 max-w-6xl mx-auto'>
            {/* Horizontal Process Flow */}
            <div className='flex flex-col md:flex-row justify-between items-start gap-8'>
              {/* Step 1 - Dark Orange Theme */}
              <div className='flex-1 text-center p-6 rounded-lg transition-all duration-300 hover:bg-orange-100 hover:shadow-xl hover:scale-105 cursor-pointer'>
                <div className='w-16 h-16 bg-orange-800 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 transition-all duration-300 hover:bg-orange-900'>
                  1
                </div>
                <h3 className='text-lg font-semibold text-orange-800 mb-2 transition-all duration-300 hover:text-orange-900'>
                  Browse & Discover
                </h3>
                <p className='text-gray-600 text-sm transition-all duration-300 hover:text-gray-700'>
                  Explore authentic Paithani collections from verified artisans
                  across Maharashtra
                </p>
              </div>

              {/* Step 2 - Red Theme */}
              <div className='flex-1 text-center p-6 rounded-lg transition-all duration-300 hover:bg-red-50 hover:shadow-xl hover:scale-105 cursor-pointer'>
                <div className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 transition-all duration-300 hover:bg-red-700'>
                  2
                </div>
                <h3 className='text-lg font-semibold text-red-600 mb-2 transition-all duration-300 hover:text-red-700'>
                  Connect Directly
                </h3>
                <p className='text-gray-600 text-sm transition-all duration-300 hover:text-gray-700'>
                  Speak with artisans, understand their craft, and discuss your
                  requirements
                </p>
              </div>

              {/* Step 3 - Chocolate Theme */}
              <div className='flex-1 text-center p-6 rounded-lg transition-all duration-300 hover:bg-amber-100 hover:shadow-xl hover:scale-105 cursor-pointer'>
                <div className='w-16 h-16 bg-amber-800 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 transition-all duration-300 hover:bg-amber-900'>
                  3
                </div>
                <h3 className='text-lg font-semibold text-amber-800 mb-2 transition-all duration-300 hover:text-amber-900'>
                  Customize & Order
                </h3>
                <p className='text-gray-600 text-sm transition-all duration-300 hover:text-gray-700'>
                  Request custom designs, select colors, and place your order
                  with transparent pricing
                </p>
              </div>

              {/* Step 4 - Dark Green Theme */}
              <div className='flex-1 text-center p-6 rounded-lg transition-all duration-300 hover:bg-green-100 hover:shadow-xl hover:scale-105 cursor-pointer'>
                <div className='w-16 h-16 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 transition-all duration-300 hover:bg-green-900'>
                  4
                </div>
                <h3 className='text-lg font-semibold text-green-800 mb-2 transition-all duration-300 hover:text-green-900'>
                  Receive & Enjoy
                </h3>
                <p className='text-gray-600 text-sm transition-all duration-300 hover:text-gray-700'>
                  Get your handcrafted Paithani delivered to your doorstep with
                  authenticity guarantee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className='mt-26 px-8 pb-26'>
          <p className='text-center text-yellow-600 font-semibold tracking-widest text-sm md:text-base mb-2'>
            JOIN US
          </p>

          <h2 className='text-3xl md:text-4xl font-bold text-center text-red-800'>
            Become Part of the Paithani Legacy
          </h2>

          <div className='mt-12 max-w-4xl mx-auto text-center'>
            <p className='text-gray-600 text-lg leading-relaxed mb-8'>
              Whether you're a customer seeking authentic Paithani sarees or an
              artisan looking to showcase your craft, our platform connects you
              directly. Join thousands who have already discovered the joy of
              authentic handcrafted Paithani.
            </p>

            <div className='flex flex-col md:flex-row gap-6 justify-center items-center'>
              <button className='bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors w-full md:w-auto'>
                Join as Customer
              </button>
              <button className='bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors w-full md:w-auto'>
                Register as Artisan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
