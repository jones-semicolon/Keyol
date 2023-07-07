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
        path: "events",
        element: <Events />
      },
      {
        path: "events/wowowin",
        element: <Portfolio title="wowowin" />
      },
      {
        path: "events/showtime",
        element: <Portfolio title="showtime" />
      },
      {
        path: "events/jakul",
        element: <Portfolio title="jakul" />
      },
      {
        path: "events/rakrakan-festival",
        element: <Portfolio title="rakrakan-festival" />
      },
      {
        path: "nature",
        element: <Portfolio title="nature" />
      },
      {
        path: "portraits",
        element: <Portfolio title="portraits" />
      },
      {
        path: "still-life",
        element: <Portfolio title="still-life" />
      },
      {
        path: "sports",
        element: <Portfolio title="sports" />
      },
    ],
    errorElement: <Error />
  }
])
export default App
