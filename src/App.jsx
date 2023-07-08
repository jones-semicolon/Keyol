import { createBrowserRouter } from "react-router-dom"
import Navbar from "./components/Navbar"
import Error from './routes/Error'
import { lazy, Suspense } from "react"
import Loader from "./components/Loader"

const Portfolio = lazy(() => import("./routes/Portfolio"))
const Home = lazy(() => import("./routes/Home"))
const Events = lazy(() => import("./routes/Events"))

const App = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <Suspense fallback={<Loader pos="unset" />}><Home /></Suspense>
      },
      {
        path: "events",
        element: <Suspense fallback={<Loader pos="unset" />}><Events /></Suspense>
      },
      {
        path: "events/wowowin",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="wowowin" /></Suspense>
      },
      {
        path: "events/showtime",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="showtime" /></Suspense>
      },
      {
        path: "events/jakul",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="jakul" /></Suspense>
      },
      {
        path: "events/rakrakan-festival",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="rakrakan-festival" /></Suspense>
      },
      {
        path: "nature",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="nature" /></Suspense>
      },
      {
        path: "portraits",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="portraits" /></Suspense>
      },
      {
        path: "still-life",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="still-life" /></Suspense>
      },
      {
        path: "sports",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="sports" /></Suspense>
      },
      {
        path: "debug",
        element: <Suspense fallback={<Loader pos="unset" />}><Portfolio title="debug" /></Suspense>
      },
    ],
    errorElement: <Error />
  }
])
export default App
