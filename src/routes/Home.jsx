import { Component } from 'react'
import { Content, Title, Gallery, Folder, TextOverlay } from "../components/styled"
import axios from "axios"
import { loadAll } from '../components/Files'
export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folder: [],
    }
  }
  componentDidMount() {
    // loadAll().then((files) => {
    //   this.setState({ folder: files })
    // })
    axios.post("/images").then((res) => {
      console.log(res)
      this.setState({ folder: res.data.folders })
    })
  }
  render() {
    const { folder } = this.state
    console.log(folder)
    return (
      < Content >
        <Title>
          <h3>My name is Caeoal Armentano and I am a passionate photographer dedicated to capturing the fleeting beauty of people.</h3>
        </Title>
        <Gallery className="gallery">
          {
            folder.map(({ name, files, folders }, key) => {
              if (!name) return
              return (
                <Folder key={key} to={`/${name}`} delay={key}>
                  <img src={files.length ? files[0].src : folders[0].files[0].src} loading="lazy" />
                  <TextOverlay>{name}</TextOverlay>
                </Folder>)
            })
          }
        </Gallery>
      </Content >
    )
  }
}
