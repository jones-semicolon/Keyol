import { Component } from 'react'
import { Content, Title, Gallery, Folder, TextOverlay } from "../styles/styled"
import Loader from '../components/Loader'
export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folder: [],
      isLoaded: false,
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
                this.setState({ folder: data.folder, isLoaded: true });
              }
              else {
                fetch(`https://keyol.vercel.app/images?folderId=${import.meta.env.VITE_FOLDER_ID}&range=3`)
                  .then(response => response.json())
                  .then((res) => {
                  const data = new Response(JSON.stringify({ folder: res.folders, timestamp: Date.now() }));
                  cache.put("home", data);
                  this.setState({ folder: res.folders, isLoaded: true })
                }).catch((err) => {
                  throw new Error(err)
                })
              }
            });
          } else {
            fetch(`https://keyol.vercel.app/images?folderId=${import.meta.env.VITE_FOLDER_ID}&range=3`)
              .then((response) => response.json())
              .then((res) => {
                console.log(res)
                const data = new Response(JSON.stringify({ folder: res.folders, timestamp: Date.now() }));
                cache.put("home", data);
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
    this.initialize();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.folder && this.state.folder) {
      this.initialize()
    }
  }
  render() {
    const { folder, isLoaded } = this.state
    return (
      <Content>
        {!isLoaded ? <Loader /> : undefined}
        <Title>
          <h3>My name is Caeoal Armentano and I am a passionate photographer dedicated to capturing the fleeting beauty of people.</h3>
        </Title>
        <Gallery className="gallery">
          {
            folder?.map(({ name, files, folders }, key) => {
              if (!name && !files.length) return
              return (
                <Folder key={key} to={`/${name}`} delay={key}>
                  <img src={files.length ? `https://keyol.vercel.app/image?url=${encodeURIComponent(files[0].thumbnailLink)}` : `https://keyol.vercel.app/image?url=${encodeURIComponent(folders[0]?.files[0].thumbnailLink)}`} loading="lazy" />
                  <TextOverlay>{name}</TextOverlay>
                </Folder>)
            })
          }
        </Gallery>
      </Content>
    )
  }
}
