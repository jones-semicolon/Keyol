import Lottie from "lottie-react"
import { Component } from 'react'
import camera from "../assets/camera.json"
import { ErrorPage } from "../styles/styled"
import { useRouteError } from "react-router-dom"
export default function Error() {
  const error = useRouteError()
  return (
    <ErrorPage>
      <Lottie animationData={camera} loop={false} />
      <h2>Oops~</h2>
      <p>Sorry, an unexpected error has occured</p>
      <p><i>{error.statusText || error.message}</i></p>

    </ErrorPage>
  )
}
