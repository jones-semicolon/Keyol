import { Component } from 'react'
import { Content, Title, Gallery, Folder, TextOverlay } from "../components/styled"
import { importImages } from '../components/Files'
export default class Events extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folder: {
        folders: []
      },
    }
  }
  componentDidMount() {
    importImages("events", 5).then((folder) => {
      console.log(folder)
      this.setState({ folder: folder["events"] })
    })
  }
  render() {
    const { folder } = this.state
    return (
      < Content >
        <Title>
          <h2>Events</h2>
        </Title>
        <Gallery className="gallery">
          {
            folder?.folders.map(({ name, files, folders }, key) => {
              if (!name) return
              return (
                <Folder key={key} to={`/events/${name}`} delay={key}>
                  <img src={files[0].src} loading="lazy" />
                  <TextOverlay>{name}</TextOverlay>
                </Folder>)
            })
          }
        </Gallery>
      </Content >
    )
  }
}
