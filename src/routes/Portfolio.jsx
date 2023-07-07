import { Component } from "react";
import Loader from "../components/Loader"
import PhotoAlbum from "react-photo-album";
import { useParams } from "react-router-dom";
import files, { importImages } from "../components/Files";
import { Content, Title } from "../components/styled";
import ScrollTop from '../components/ScrollTop'
import imagesloaded from 'imagesloaded'
import Modal from "../components/Modal";
import axios from "axios"

function portfolioRoute(PortfolioRoute) {
  return function WrappedPrarams(props) {
    const params = useParams();
    return <PortfolioRoute {...props} params={params} />
  }
}

function rowHeightConfig(containerWidth) {
  if (containerWidth < 768) return (containerWidth / 1.5);
  return (containerWidth / 3);
}

class Portfolio extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folders: [],
      isLoaded: false,
      title: "" || this.props.title,
      modal: {
        state: false,
        src: "",
        height: "",
        width: "",
      },
    }
  }

  componentDidMount() {
    axios.post("/images", { folder: this.props.title }).then((res) => {
      this.setState({ folders: res.data })
    }).catch((err) => {
      throw new Error(err)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.title !== this.props.title) {
      window.scrollTo(0, 0);
      this.setState({ folders: {} });
      this.setState({ isLoaded: false })
      axios.post("/images", { folder: this.props.title }).then((res) => {
        this.setState({ folders: res.data })
      }).catch((err) => {
        throw new Error(err)
      })
    }
    if (!Object.keys(prevState.folders).length && Object.keys(this.state.folders).length) {
      imagesloaded('.react-photo-album', (inst) => {
        if (!inst.images.length && this.state.isLoaded) return
        this.setState({ isLoaded: true })
      })
    }
  }

  checkLink({ src, events }) {
    switch (src) {
      case 'debug':
        this.state.title != 'Portraits' &&
          this.setState({ title: "Portraits" })
        break;
      case 'portraits':
        this.state.title != 'Portraits' &&
          this.setState({ title: "Portraits" })
        break;
      case 'nature':
        this.state.title != 'Nature' &&
          this.setState({ title: "Nature" })
        break;
      case 'sports':
        this.state.title != 'Sports' &&
          this.setState({ title: "Sports" })
        break;
      case 'still-life':
        this.state.title != 'Still Life' &&
          this.setState({ title: "Still Life" })
        break;
      case 'events':
        if (events === 'rakrakan-festival')
          this.state.title != 'Rakrakan Festival' &&
            this.setState({ title: "Rakrakan Festival" })
        else if (events === 'wowowin')
          this.state.title != 'Wowowin' &&
            this.setState({ title: "Wowowin" })
        else if (events === 'showtime')
          this.state.title != 'Showtime' &&
            this.setState({ title: "Showtime" })
        else if (events === 'jakul')
          this.state.title != 'Jakul' &&
            this.setState({ title: "Jakul" })
        break;
      default:
        return
    }
  }

  render() {
    const { isLoaded, title, modal, folders } = this.state;
    return (
      <>
        <Modal {...modal} close={() => this.setState({ modal: { state: false, src: "" } })} />
        <Content>
          {!isLoaded ? <Loader /> : undefined}
          <Title>
            <h2>{title}</h2>
          </Title>
          {
            folders?.folders &&
            folders?.folders?.map(
              ({ files, name, folders }, key) => (
                <PhotoAlbum
                  layout="rows"
                  photos={files}
                  targetRowHeight={rowHeightConfig}
                  onClick={({ index }) => {
                    this.setState({
                      modal: {
                        state: true,
                        ...photos[index]
                      }
                    })
                  }}
                  key={name}
                />
              )
            )
          }
          <PhotoAlbum
            layout="rows"
            photos={folders?.files}
            targetRowHeight={rowHeightConfig}
            onClick={({ index }) => {
              this.setState({
                modal: {
                  state: true,
                  ...photos[index]
                }
              })
            }}
          />
          <ScrollTop />
        </Content>
      </>
    )
  }
}

export default portfolioRoute(Portfolio)
