import { Component } from 'react'
import { Content, Title, Gallery, Folder, TextOverlay } from "../style/styled"
import { importImages } from '../components/Files'
export default class Events extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folders: {
      },
    }
  }
  componentDidMount() {
    axios.post("/images", { folder: "events", range: 5 }).then((res) => {
      this.setState({ folders: res.data })
    })
  }
  render() {
    const { folders } = this.state
    return (
      <Content>
        <Title>
          <h2>Events</h2>
        </Title>
        <Gallery className="gallery">
          {
            folders?.folders.map(({ name, files, folders }, key) => {
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
