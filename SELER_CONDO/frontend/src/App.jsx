// Remove 'React' from the import, just keep useState
import { useState } from 'react';
import { 
  Building, LogIn, UserPlus, LogOut, 
  Search, MapPin, BedDouble, Bath 
} from 'lucide-react';

export default function App() {
  // 'home', 'login', 'register', or 'dashboard'
  const [currentView, setCurrentView] = useState('home'); 
  const [user, setUser] = useState(null); // Holds the logged-in user's data
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: 'Connecting to server...', type: 'loading' });
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success) {
        setUser({ email: email, name: data.message.replace('Welcome back, ', '').replace('!', '') });
        setStatusMessage({ text: '', type: '' });
        setCurrentView('dashboard'); // Send them to the dashboard!
      } else {
        setStatusMessage({ text: '❌ ' + data.message, type: 'error' });
      }
    } catch (err) { // Change 'error' to 'err' and log it
      console.error("Login Error:", err);
      setStatusMessage({ text: '❌ Cannot connect to server.', type: 'error' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: 'Creating account...', type: 'loading' });

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value;

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();

      if (data.success) {
        setStatusMessage({ text: '✅ Account created! Please log in.', type: 'success' });
        setTimeout(() => setCurrentView('login'), 2000); // Send to login after 2 seconds
      } else {
        setStatusMessage({ text: '❌ ' + data.message, type: 'error' });
      }
    } catch (err) { // Change 'error' to 'err' and log it
      console.error("Register Error:", err);
      setStatusMessage({ text: '❌ Cannot connect to server.', type: 'error' });
    }
  };

  const renderNavbar = () => (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => setCurrentView('home')}
          >
            <Building className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="ml-2 text-xl font-bold text-slate-800 tracking-wider">SELER_CONDO</span>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <button 
                  onClick={() => setCurrentView('login')}
                  className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-2 flex items-center transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </button>
                <button 
                  onClick={() => setCurrentView('register')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-2 transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => { setUser(null); setCurrentView('home'); }}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHomeView = () => (
    <div className="flex-1 bg-slate-50">
      {/* Hero Section */}
      <div className="bg-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Find Your Perfect Condo Today
        </h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
          The easiest way to buy, sell, and discover premium real estate properties in your favorite city.
        </p>
        
        {/* Fake Search Bar */}
        <div className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-lg flex items-center">
          <MapPin className="h-6 w-6 text-slate-400 ml-4" />
          <input 
            type="text" 
            placeholder="Search by city, neighborhood, or address..." 
            className="flex-1 px-4 py-3 outline-none text-slate-700 bg-transparent"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center">
            <Search className="h-5 w-5 mr-2" /> Search
          </button>
        </div>
      </div>

      {/* Featured Condos Section (Static Preview) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sample Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-slate-200 relative">
               <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Condo" className="w-full h-full object-cover" />
               <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                 $350,000
               </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Modern Downtown Loft</h3>
              <p className="text-slate-500 flex items-center text-sm mb-4">
                <MapPin className="h-4 w-4 mr-1" /> 123 Main St, Metropolis
              </p>
              <div className="flex border-t pt-4 text-slate-600 space-x-4">
                <span className="flex items-center text-sm"><BedDouble className="h-4 w-4 mr-1"/> 2 Beds</span>
                <span className="flex items-center text-sm"><Bath className="h-4 w-4 mr-1"/> 2 Baths</span>
              </div>
            </div>
          </div>
          {/* Sample Card 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-slate-200 relative">
               <img src="https://images.unsplash.com/photo-1502672260266-1c1e5240980c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Condo" className="w-full h-full object-cover" />
               <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                 $420,000
               </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Luxury Penthouse</h3>
              <p className="text-slate-500 flex items-center text-sm mb-4">
                <MapPin className="h-4 w-4 mr-1" /> 88 Skyline Ave, Gotham
              </p>
              <div className="flex border-t pt-4 text-slate-600 space-x-4">
                <span className="flex items-center text-sm"><BedDouble className="h-4 w-4 mr-1"/> 3 Beds</span>
                <span className="flex items-center text-sm"><Bath className="h-4 w-4 mr-1"/> 2.5 Baths</span>
              </div>
            </div>
          </div>
           {/* Sample Card 3 */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-slate-200 relative">
               <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Condo" className="w-full h-full object-cover" />
               <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                 $275,000
               </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Cozy Studio Suite</h3>
              <p className="text-slate-500 flex items-center text-sm mb-4">
                <MapPin className="h-4 w-4 mr-1" /> 45 Quiet Lane, Star City
              </p>
              <div className="flex border-t pt-4 text-slate-600 space-x-4">
                <span className="flex items-center text-sm"><BedDouble className="h-4 w-4 mr-1"/> 1 Bed</span>
                <span className="flex items-center text-sm"><Bath className="h-4 w-4 mr-1"/> 1 Bath</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoginView = () => (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-6 text-center">
            <h2 className="text-2xl font-bold text-white tracking-wider">Welcome Back</h2>
            <p className="text-indigo-200 mt-1 text-sm">Login to your account</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
              <input type="email" name="email" required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
              <input type="password" name="password" required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
              Login
            </button>
          </form>

          {statusMessage.text && (
            <div className={`mt-6 p-4 rounded-lg text-sm text-center font-medium border ${
              statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account? <span onClick={() => setCurrentView('register')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );

  const renderRegisterView = () => (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-6 text-center">
            <h2 className="text-2xl font-bold text-white tracking-wider">Create Account</h2>
            <p className="text-emerald-200 mt-1 text-sm">Join SELER_CONDO today</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <input type="text" name="name" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                <input type="email" name="email" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                <input type="password" name="password" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Account Type</label>
                <select name="role" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="buyer">I want to buy condos</option>
                    <option value="seller">I want to sell condos</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-4">
              Sign Up
            </button>
          </form>

          {statusMessage.text && (
            <div className={`mt-6 p-4 rounded-lg text-sm text-center font-medium border ${
              statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {statusMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboardView = () => (
    <div className="flex-1 bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
             <UserPlus className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome, {user?.name}!</h2>
          <p className="text-slate-500 mb-8">This is your secure dashboard. Only logged-in users can see this page.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
             <div className="border border-slate-200 p-6 rounded-xl">
               <h3 className="font-bold text-lg mb-2 text-indigo-600">Your Profile</h3>
               <p className="text-slate-600">Email: {user?.email}</p>
               <p className="text-slate-600">Status: Verified User</p>
             </div>
             <div className="border border-slate-200 p-6 rounded-xl bg-slate-50 flex items-center justify-center">
               <p className="text-slate-500 italic text-center">
                 In the next step, we will load your specific condos from MySQL here!
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      {renderNavbar()}
      
      {/* Switch Case equivalent to handle navigation without a router */}
      {currentView === 'home' && renderHomeView()}
      {currentView === 'login' && renderLoginView()}
      {currentView === 'register' && renderRegisterView()}
      {currentView === 'dashboard' && renderDashboardView()}
      
      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
         <p>© 2026 SELER_CONDO. Designed as a Full-Stack Masterpiece.</p>
      </footer>
    </div>
  );
}