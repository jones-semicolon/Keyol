import { Component } from 'react'
import { Content, Title, Gallery, Folder, TextOverlay } from "../styles/styled"
import { importImages } from '../components/Files'
import axios from 'axios'
export default class Events extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folder: [],
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
                axios.post("/images").then((res) => {
                  const data = new Response(JSON.stringify({ folder: res.data.folders, timestamp: Date.now() }));
                  cache.put("events", data);
                  this.setState({ folder: res.data.folders, isLoaded: true })
                }).catch((err) => {
                  throw new Error(err)
                })
              }
              else { this.setState({ folder: data.folder, isLoaded: true }); }
            });
          } else {
            axios.post("/images").then((res) => {
              const data = new Response(JSON.stringify({ folder: res.data.folders, timestamp: Date.now() }));
              cache.put("events", data);
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
    // axios.post("/images", { folder: "events", range: 5 }).then((res) => {
    //   this.setState({ folders: res.data })
    // })
    this.initialize()
  }
  render() {
    const { folder } = this.state
    console.log(folder)
    return (
      <Content>
        <Title>
          <h2>Events</h2>
        </Title>
        <Gallery className="gallery">
          {
            folder?.map(({ name, files, folders }, key) => {
              return (
                <Folder key={name} to={`/events/${name}`} delay={key}>
                  <img src={files.length ? files[Math.floor(Math.random() * files.length)].src : folders[Math.floor(Math.random() * folders.length)].files[Math.floor(Math.random() * files.length)].src} loading="lazy" />
                  <TextOverlay>{name}</TextOverlay>
                </Folder>)
            })
          }
        </Gallery>
      </Content >
    )
  }
}
