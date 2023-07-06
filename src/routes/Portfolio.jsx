import { Component } from "react";
import Loader from "../components/Loader"
import PhotoAlbum from "react-photo-album";
import { useParams } from "react-router-dom";
import files, { importImages } from "../components/Files";
import { Content, Title } from "../components/styled";
import ScrollTop from '../components/ScrollTop'
import imagesloaded from 'imagesloaded'
import Modal from "../components/Modal";

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
      photos: [],
      isLoaded: false,
      title: "",
      modal: {
        state: false,
        src: "",
        height: "",
        width: "",
      },
    }
  }

  componentDidMount() {
    const { src, events } = this.props.params;
    if (!src) throw new Error("404 not Found")
    files(events ? events : src).then((photos) => {
      this.setState({ photos: photos })
    }).catch((err) => {
      throw new Error(err)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { src, events } = this.props.params;
    if (prevProps.params.src !== src || prevProps.params.events !== events) {
      window.scrollTo(0, 0);
      this.setState({ photos: [] });
      this.setState({ isLoaded: false })
      files(events ? events : src).then((photos) => {
        this.setState({ photos: photos })
      }).catch((err) => {
        throw new Error(err)
      })
    }
    this.checkLink(this.props.params)
    if (!prevState.photos.length && this.state.photos.length) {
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
        if (events === 'wowowin')
          this.state.title != 'Wowowin' &&
            this.setState({ title: "Wowowin" })
        if (events === 'showtime')
          this.state.title != 'Showtime' &&
            this.setState({ title: "Showtime" })
        if (events === 'jakul')
          this.state.title != 'Jakul' &&
            this.setState({ title: "Jakul" })
        else return;
      default:
        return
    }
  }

  render() {
    const { photos, isLoaded, title, modal } = this.state;
    return (
      <>
        <Modal {...modal} close={() => this.setState({ modal: { state: false, src: "" } })} />
        <Content>
          {!isLoaded ? <Loader /> : undefined}
          <Title>
            <h2>{title}</h2>
          </Title>
          < PhotoAlbum layout="rows" photos={photos} targetRowHeight={rowHeightConfig}
            onClick={({ index }) => {
              this.setState({ modal: { state: true, ...photos[index] } })
            }} />
          <ScrollTop />
        </Content>
      </>
    )
  }
}

export default portfolioRoute(Portfolio)
