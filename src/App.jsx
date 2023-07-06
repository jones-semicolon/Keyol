import { createBrowserRouter, Outlet } from "react-router-dom"
import Portfolio from "./routes/Portfolio"
import Navbar from "./components/Navbar"
import Home from './routes/Home'
import Error from './routes/Error'
import Events from "./routes/Events"

const App = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: ":src",
        element: <Portfolio />
      },
      {
        path: "events",
        element: <Events />
      },
      {
        path: ":src/:events",
        element: <Portfolio />
      },
    ],
    errorElement: <Error />
  }
])
export default App
