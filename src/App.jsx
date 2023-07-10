import { createBrowserRouter } from "react-router-dom"
import Navbar from "./components/Navbar"
import { lazy } from "react"

const Portfolio = lazy(() => import("./routes/Portfolio"))
const Home = lazy(() => import("./routes/Home"))
const Events = lazy(() => import("./routes/Events"))
const Error = lazy(() => import("./routes/Error"))

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
      {
        path: "debug",
        element: <Portfolio title="debug" />
      },
    ],
    errorElement: <Error />
  }
])
export default App
