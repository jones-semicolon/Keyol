import { Component } from "react";
import Loader from "../components/Loader"
import PhotoAlbum from "react-photo-album";
import { useParams, useLocation } from "react-router-dom";
import { Content, Title } from "../styles/styled";
import ScrollTop from '../components/ScrollTop'
import imagesloaded from 'imagesloaded'
import Modal from "../components/Modal";
import axios from "axios"
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

class Portfolio extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folders: {},
      isLoaded: false,
      title: "" || this.props.title,
      modal: {
        state: false,
        src: "",
        height: 0,
        width: 0,
      },
    }
  }

  initialize() {
    window.scrollTo(0, 0);
    this.setState({ isLoaded: false })
    if ('caches' in window) {
      caches.open('images').then((cache) => {
        cache.match(this.props.title).then(resp => {
          if (resp) {
            resp.json().then(data => {
              if (Date.now() - data.timestamp < 5 * 60 * 1000) {
                axios.get(`/images?folderId=${import.meta.env.VITE_FOLDER_ID}&folder=${this.props.title}`).then((res) => {
                  const data = new Response(JSON.stringify({ folders: res.data, timestamp: Date.now() }));
                  cache.put(this.props.title, data);
                  this.setState({ folders: res.data, isLoaded: true })
                }).catch((err) => {
                  throw new Error(err)
                })
              }
              else { this.setState({ folders: data.folders, isLoaded: true }); }
            });
          } else {
            axios.get(`/images?folderId=${import.meta.env.VITE_FOLDER_ID}&folder=${this.props.title}`).then((res) => {
              const data = new Response(JSON.stringify({ folders: res.data, timestamp: Date.now() }));
              cache.put(this.props.title, data);
              this.setState({ folders: res.data, isLoaded: true })
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
    console.log(folders)
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
              ({ files, name, folders }) => (
                <PhotoAlbum
                  layout="rows"
                  photos={files}
                  targetRowHeight={rowHeightConfig}
                  onClick={({ index }) => {
                    this.setState({
                      modal: {
                        state: true,
                        ...files[index]
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
                  ...folders?.files[index]
                }
              })
            }}
            renderPhoto={({ photo, imageProps }) => photo.fileType === "video" ? <video {...imageProps} /> : <img {...imageProps} />}
          />
          <ScrollTop />
        </Content>
      </>
    )
  }
}

export default portfolioRoute(Portfolio)

Portfolio.propTypes = {
  title: PropTypes.string
}
