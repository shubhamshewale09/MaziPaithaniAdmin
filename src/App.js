import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
// import "leaflet/dist/leaflet.css";

import { AuthProvider } from "./context/auth/AuthContext";
import Loader from "./components/custom/Loader";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout";

// Lazy load pages
const Login = lazy(() => import("./pages/Login/Login"));
const Logout = lazy(() => import("./pages/Logout/Logout"));
const ViewMedia = lazy(() => import("./pages/View Media"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
//user imports starts
const Users = lazy(() => import("./pages/User")); //works as admin master
const ParkingAdmin = lazy(() => import("./pages/Parking Admin"));
const ParkingStaff = lazy(() => import("./pages/Parking Admin/parking-staff"));
const PreviewStaff = lazy(() =>
  import("./pages/Parking Admin/parking-staff/previewStaff")
);
const ParkingSlot = lazy(() => import("./pages/Parking Admin/parking-slot"));
const PreviewAssignedParking = lazy(() =>
  import("./pages/Parking Admin/parking-slot/previewParking")
);
const AvailableParking = lazy(() =>
  import("./pages/Parking Admin/available-parking")
);
const AppUser = lazy(() => import("./pages/App User"));
const NmcUser = lazy(() => import("./pages/NMC User"));
//user imports ends

//service start
const Service = lazy(() => import("./pages/Service"));
const ServiceLanguagewise = lazy(() => import("./pages/Service/Languagewise"));
const ServiceType = lazy(() => import("./pages/Service Type"));
const ServiceTypeLanguagewise = lazy(() =>
  import("./pages/Service Type/Languagewise")
);
//service end

//service aggregator start
const ServiceAggregator = lazy(() => import("./pages/Service Aggregator"));
const ServiceAggregatorLanguagewise = lazy(() =>
  import("./pages/Service Aggregator/Langugagewise")
);
const ServiceAggregatorType = lazy(() =>
  import("./pages/Service Aggregator Type")
);
//service aggregator end

//Amenity start
const Amenity = lazy(() => import("./pages/Amenity"));
const AmenityLanguagewise = lazy(() => import("./pages/Amenity/Languagewise"));

//Amenity end

//master start
const VehichleType = lazy(() => import("./pages/Vehicle Type"));
const AlertType = lazy(() => import("./pages/Alert type"));
const AlertTypeLanguaugewise = lazy(() =>
  import("./pages/Alert type/Languagewise")
);
const Event = lazy(() => import("./pages/Event"));
const EventLanguaugewise = lazy(() => import("./pages/Event/Langugagewise"));
const State = lazy(() => import("./pages/State"));
const StateLanguaugewise = lazy(() => import("./pages/State/Languagewise"));
const District = lazy(() => import("./pages/District"));
const DistrictLanguaugewise = lazy(() =>
  import("./pages/District/Languagewise")
);
const Category = lazy(() => import("./pages/Category"));
const CategoryLanguaugewise = lazy(() =>
  import("./pages/Category/Languagewise")
);
const FAQ = lazy(() => import("./pages/Faq"));
const FAQLanguagewise = lazy(() => import("./pages/Faq/Languagewise"));
//master end

//area start
const Area = lazy(() => import("./pages/Area"));
const AreaLanguagewise = lazy(() => import("./pages/Area/Languagewise"));
//area end

//alert start
const Alert = lazy(() => import("./pages/Alert"));
const AlertLanguagewise = lazy(() => import("./pages/Alert/Langugagewise"));
//alert end

//notification master start
const Notification = lazy(() => import("./pages/Notification"));
//notification master end

//Temple start
const Temple = lazy(() => import("./pages/Temple"));
const TempleLanguagewise = lazy(() => import("./pages/Temple/Languagewise"));
//Temple end

//Parking Complaints start
const ParkingComplaints = lazy(() => import("./pages/Parking Complaints"));
const TicketComplaints = lazy(() => import("./pages/Ticket Complaint"));
const TicketComplaintsLanguageWise = lazy(() =>
  import("./pages/Ticket Complaint/Languagewise")
);
//Parking Complaints end

//family group start
const FamilyGroup = lazy(() => import("./pages/Family Group"));
const FamilyMembers = lazy(() => import("./pages/Family Group/Family Member"));
//family group end

//Lost and found start
const LostAndFound = lazy(() => import("./pages/Lost And Found"));
const LostAndFoundLanguagewise = lazy(() =>
  import("./pages/Lost And Found/Languagewise")
);
//Lost and found end
function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="/view-media" element={<ViewMedia />} />
                  {/* user modules  start*/}
                  <Route path="/users/admin" element={<Users />} />
                  <Route
                    path="users/parking-admin"
                    element={<ParkingAdmin />}
                  />
                  <Route
                    path="users/parking-staff"
                    element={<ParkingStaff />}
                  />
                  <Route
                    path="/users/nmc-parking-staff"
                    element={<ParkingStaff />}
                  />
                  <Route
                    path="users/preview-staff"
                    element={<PreviewStaff />}
                  />

                  <Route path="users/parking-slot" element={<ParkingSlot />} />
                  <Route
                    path="users/nmc-parking-slot"
                    element={<ParkingSlot />}
                  />
                  <Route
                    path="users/preview-parkings"
                    element={<PreviewAssignedParking />}
                  />
                  <Route
                    path="users/available-parking"
                    element={<AvailableParking />}
                  />

                  <Route path="/users/app-user" element={<AppUser />} />
                  <Route
                    path="/users/nmc-user"
                    element={<NmcUser />}
                    // element={<ParkingAdmin />} //display single component for nmc and parking
                  />
                  {/* user modules end  */}

                  {/* service modules  start*/}
                  <Route path="/service" element={<Service />} />
                  <Route
                    path="/service-languagewise"
                    element={<ServiceLanguagewise />}
                  />
                  <Route path="/service-type" element={<ServiceType />} />
                  <Route
                    path="/service-type/languagewise"
                    element={<ServiceTypeLanguagewise />}
                  />

                  {/* service modules  end*/}

                  {/* service aggregator  start*/}
                  <Route
                    path="/service-aggregator"
                    element={<ServiceAggregator />}
                  />

                  <Route
                    path="/service-aggregator/languagewise"
                    element={<ServiceAggregatorLanguagewise />}
                  />
                  <Route
                    path="/service-aggregator-type"
                    element={<ServiceAggregatorType />}
                  />

                  {/* service aggregator  end*/}

                  {/* master modules  start*/}
                  <Route
                    path="/master/vehicle-type"
                    element={<VehichleType />}
                  />
                  <Route path="/master/alert-type" element={<AlertType />} />
                  <Route
                    path="/alert-type-languagewise"
                    element={<AlertTypeLanguaugewise />}
                  />

                  <Route path="/master/event" element={<Event />} />
                  <Route
                    path="/master/event/languagewise"
                    element={<EventLanguaugewise />}
                  />

                  <Route path="/master/state" element={<State />} />
                  <Route
                    path="/master/state/languagewise"
                    element={<StateLanguaugewise />}
                  />

                  <Route path="/master/district" element={<District />} />
                  <Route
                    path="/district/district-languagewise"
                    element={<DistrictLanguaugewise />}
                  />

                  <Route path="/master/area" element={<Area />} />
                  <Route
                    path="/master/area/languagewise"
                    element={<AreaLanguagewise />}
                  />

                  <Route path="/category" element={<Category />} />
                  <Route
                    path="/category-languagewise"
                    element={<CategoryLanguaugewise />}
                  />
                  <Route path="/master/faq" element={<FAQ />} />
                  <Route
                    path="/master/faq/languagewise"
                    element={<FAQLanguagewise />}
                  />
                  {/* master modules  end*/}

                  {/* alert start */}
                  <Route path="/alert" element={<Alert />} />
                  <Route
                    path="/alert/alert-languagewise"
                    element={<AlertLanguagewise />}
                  />

                  {/* alert end */}

                  {/* notification start  */}
                  <Route path="/notification" element={<Notification />} />
                  {/* notification end  */}

                  {/* temple start */}
                  <Route path="/temple" element={<Temple />} />
                  <Route
                    path="/temple/temple-languagewise"
                    element={<TempleLanguagewise />}
                  />

                  {/* temple end */}
                  {/* Complaints start */}
                  <Route
                    path="/parking-complaints"
                    element={<ParkingComplaints />}
                  />
                  <Route
                    path="/police-complaints"
                    element={<TicketComplaints />}
                  />
                  <Route
                    path="/policeComplaints-languagewise"
                    element={<TicketComplaintsLanguageWise />}
                  />
                  {/* Complaints start */}

                  {/* family safety start */}
                  <Route
                    path="/family-safety/family-group"
                    element={<FamilyGroup />}
                  />
                  <Route
                    path="/family-safety/family-group/members"
                    element={<FamilyMembers />}
                  />

                  {/* family safety end */}

                  {/* lost and found start  */}
                  <Route path="/lost-and-found" element={<LostAndFound />} />
                  <Route
                    path="/lost-and-found-languagewise"
                    element={<LostAndFoundLanguagewise />}
                  />
                  {/* lost and found end  */}

                  {/* Amenity  start*/}
                  <Route path="/amenity" element={<Amenity />} />
                  <Route
                    path="/amenity/languagewise"
                    element={<AmenityLanguagewise />}
                  />
                  {/* Amenity  end*/}
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
