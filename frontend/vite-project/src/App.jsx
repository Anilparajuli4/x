import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import { useQuery } from "@tanstack/react-query";
import ProfilePage from "./pages/ProfilePage";
import NotificationPage from "./pages/Notification";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPannel";


function App() {
  const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error); 
			}
		},
		retry: false,
	});

	// if (isLoading) {
	// 	return (
	// 		<div className='h-screen flex justify-center items-center'>
	// 			<LoadingSpinner size='lg' />
	// 		</div>
	// 	);
	// }
const authUsers = authUser?.data
  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUsers && <Sidebar/>}
    <Routes>
    <Route path='/' element={authUsers ? <Home /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUsers ? <Login /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUsers ? <SignUp /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUsers ? <NotificationPage/> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUsers ? <ProfilePage /> : <Navigate to='/login' />} />
    </Routes>
    {authUsers && <RightPanel/>}
    </div>
  )
}

export default App