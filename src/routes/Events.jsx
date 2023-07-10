import { Component } from 'react'
import { Content, Title, Gallery, Folder, TextOverlay } from "../styles/styled"
import Loader from '../components/Loader'
import PropTypes from 'prop-types'


function RenderImage({ files, folders }){
  const randomize = (length) => Math.floor(Math.random() * length)
  let src = "";
  if(files.length){
    src = files[randomize(files.length)].thumbnailLink
  } else {
    src = folders[randomize(folders.length)].files[files.length].thumbnailLink
  }
  return <img src={src} alt="" loading="lazy"/>
}

export default class Events extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folder: [],
      isLoaded: false
    }
  }
  initialize() {
    window.scrollTo(0, 0);
    this.setState({ isLoaded: false })
    if ('caches' in window) {
      caches.open('folders').then((cache) => {
        cache.match("events").then(resp => {
          if (resp) {
            resp.json().then(data => {
              if (Date.now() - data.timestamp < 5 * 60 * 1000) {
                fetch(`https://keyol.vercel.app/images?folderId=${import.meta.env.VITE_FOLDER_ID}&folderPath=events&range=3`)
                  .then(response => response.json())
                  .then((res) => {
                  const data = new Response(JSON.stringify({ folder: res.folders, timestamp: Date.now() }));
                  cache.put("events", data);
                  this.setState({ folder: res.folders, isLoaded: true })
                }).catch((err) => {
                  throw new Error(err)
                })
              }
              else { this.setState({ folder: data.folder, isLoaded: true }); }
            });
          } else {
            fetch(`https://keyol.vercel.app/images?folderId=${import.meta.env.VITE_FOLDER_ID}&folderPath=events&range=3`)
              .then(response => response.json())
              .then((res) => {
              const data = new Response(JSON.stringify({ folder: res.folders, timestamp: Date.now() }));
              cache.put("events", data);
              this.setState({ folder: res.folders, isLoaded: true })
            }).catch((err) => {
              throw new Error(err)
            })
          }
        })
      });
    }
  }
  componentDidMount() {
    this.initialize()
  }
  render() {
    const { folder, isLoaded } = this.state
    return (
      <Content>
        {!isLoaded ? <Loader /> : undefined}
        <Title>
          <h2>Events</h2>
        </Title>
        <Gallery className="gallery">
          {
            folder?.map(({ name, files, folders }, key) => {
              return (
                <Folder key={name} to={`/events/${name}`} delay={key}>
                  <RenderImage files={files} folders={folders}/>
                  <TextOverlay>{name}</TextOverlay>
                </Folder>)
            })
          }
        </Gallery>
      </Content >
    )
  }
}

RenderImage.propTypes = {
  files: PropTypes.object,
  folders: PropTypes.object
}
