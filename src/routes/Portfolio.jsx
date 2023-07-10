import { Component } from "react";
import Loader from "../components/Loader"
import PhotoAlbum from "react-photo-album";
import { useParams, useLocation } from "react-router-dom";
import { Content, Title } from "../styles/styled";
import ScrollTop from '../components/ScrollTop'
import imagesloaded from 'imagesloaded'
import Modal from "../components/Modal";
import PropTypes from 'prop-types'

function portfolioRoute(PortfolioRoute) {
  return function WrappedPrarams(props) {
    const params = useParams();
    const location = useLocation();
    return <PortfolioRoute {...props} params={params} location={location} />
  }
}

function rowHeightConfig(containerWidth) {
  if (containerWidth < 768) return (containerWidth / 1.5);
  return (containerWidth / 2.5);
}

function RenderItem(props){
  const {imageProps, photo} = props;
  imageProps.src = `https://keyol.vercel.app/image?url=${encodeURIComponent(photo.thumbnailLink)}`
  return <img {...imageProps} />
}

class Portfolio extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folders: {},
      isLoaded: false,
      title: "" || this.props.title,
      modal: {
        state: false,
        file: {}
      },
    }
  }

  initialize() {
    window.scrollTo(0, 0);
    this.setState({ isLoaded: false, folders: {}, title: this.props.title})
    if ('caches' in window) {
      caches.open('images').then((cache) => {
        cache.match(this.props.title).then(resp => {
          if (resp) {
            resp.json().then(data => {
              if (Date.now() - data.timestamp < 5 * 60 * 1000) {
                this.setState({ folders: data.folders, isLoaded: true });
              }
              else {
                fetch(`https://keyol.vercel.app/images?folderId=${import.meta.env.VITE_FOLDER_ID}&folderPath=${this.props.location.pathname.substring(1)}`)
                  .then(response => response.json())
                  .then((res) => {
                  const data = new Response(JSON.stringify({ folders: res, timestamp: Date.now() }));
                  cache.put(this.props.title, data);
                  this.setState({ folders: res, isLoaded: true })
                }).catch((err) => {
                  throw new Error(err)
                })
              }
            });
          } else {
            fetch(`https://keyol.vercel.app/images?folderId=${import.meta.env.VITE_FOLDER_ID}&folderPath=${this.props.location.pathname.substring(1)}`)
              .then(response => response.json())
              .then((res) => {
              const data = new Response(JSON.stringify({ folders: res, timestamp: Date.now() }));
              cache.put(this.props.title, data);
              this.setState({ folders: res, isLoaded: true })
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.title !== this.props.title) {
      this.initialize()
    }
    if (!prevState.folders && this.state.folders) {
      imagesloaded('.react-photo-album', (inst) => {
        if (!inst.images.length && this.state.isLoaded) return
        this.setState({ isLoaded: true })
      })
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
            folders?.folders?.map(
              ({ files, name }) => (
                <PhotoAlbum
                  layout="rows"
                  photos={files}
                  targetRowHeight={rowHeightConfig}
                  onClick={({ index }) => {
                    this.setState({
                      modal: {
                        state: true,
                        file: files[index]
                      }
                    })
                  }}
                  key={name}
                  renderPhoto={(props) => <RenderItem {...props} />}
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
                  file: folders?.files[index]
                }
              })
            }}
            renderPhoto={(props) => <RenderItem {...props} />}
          />
          <ScrollTop />
        </Content>
      </>
    )
  }
}

export default portfolioRoute(Portfolio)

Portfolio.propTypes = {
  title: PropTypes.string,
  location: PropTypes.object
}

RenderItem.propTypes = {
  photo: PropTypes.object,
  imageProps: PropTypes.object
}
