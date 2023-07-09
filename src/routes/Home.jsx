import { Component } from 'react'
import { Content, Title, Gallery, Folder, TextOverlay } from "../styles/styled"
import axios from "axios"
import Loader from '../components/Loader'
export default class Home extends Component {
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
        cache.match("home").then(resp => {
          if (resp) {
            resp.json().then(data => {
              if (Date.now() - data.timestamp < 5 * 60 * 1000) {
                axios.get(`/images?folderId=${import.meta.env.VITE_FOLDER_ID}`).then((res) => {
                  const data = new Response(JSON.stringify({ folder: res.data.folders, timestamp: Date.now() }));
                  cache.put("home", data);
                  this.setState({ folder: res.data.folders, isLoaded: true })
                }).catch((err) => {
                  throw new Error(err)
                })
              }
              else { this.setState({ folder: data.folder, isLoaded: true }); }
            });
          } else {
            axios.get(`/images?folderId=${import.meta.env.VITE_FOLDER_ID}`).then((res) => {
              console.log(res.data)
              const data = new Response(JSON.stringify({ folder: res.data.folders, timestamp: Date.now() }));
              cache.put("home", data);
              this.setState({ folder: res.data.folders, isLoaded: true })
            }).catch((err) => {
              throw new Error(err)
            })
          }
        })
      });
    }

  }
  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.folder && this.state.folder) {
      this.initialize()
    }
  }
  render() {
    const { folder, isLoaded } = this.state
    console.log(folder)
    return (
      <Content>
        {!isLoaded ? <Loader /> : undefined}
        <Title>
          <h3>My name is Caeoal Armentano and I am a passionate photographer dedicated to capturing the fleeting beauty of people.</h3>
        </Title>
        <Gallery className="gallery">
          {
            folder?.map(({ name, files, folders }, key) => {
              if (!name) return
              return (
                <Folder key={key} to={`/${name}`} delay={key}>
                  <img src={files.length ? files[Math.floor(Math.random() * files.length)].src : folders[Math.floor(Math.random(folders.length))].files[Math.floor(Math.random() * files.length)].src} loading="lazy" />
                  <TextOverlay>{name}</TextOverlay>
                </Folder>)
            })
          }
        </Gallery>
      </Content>
    )
  }
}
