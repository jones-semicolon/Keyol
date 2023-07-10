import { Component } from "react";
import ReactModal from "react-modal";
import PropTypes from 'prop-types'

function RenderModal(props){
  props.src?.replace(/(.*)view.?/, '$1preview')
  const src = `http://keyol.vercel.app/image?url=${props.src}`;
  console.log(props.src)
  return props.fileType === "image" ?
    <img src={src} alt="" /> :
    <iframe src={src} 
    />
}

export default class Modal extends Component {
  constructor(props) {
    super(props)
  }
  componentDidUpdate() {
    if (this.props.state && document.body.style.overflow !== "hidden") {
      document.body.style.overflow = 'hidden';
    }
    else if (!this.props.state && document.body.style.overflow !== "unset") {
      document.body.style.overflow = 'unset';
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = 'unset';
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.state}
        onRequestClose={this.props.close}
        style={{
          content: {
            padding: 0,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            transform: "translate(-50%, -50%)",
            // margin: "2rem 1.5rem",
            right: "auto",
            bottom: "auto",
            maxHeight: "90vh",
            aspectRatio: `${this.props.file?.width} / ${this.props.file?.height}`,
            height: "auto",
            width: "auto",
          },
          overlay: {
            backgroundColor: "var(--overlay-color)",
          }
        }}
      >
        <RenderModal {...this.props.file}/>
      </ReactModal>
    )
  }
}


Modal.propTypes = {
  close: PropTypes.func,
  state: PropTypes.bool,
  file: PropTypes.object
}

RenderModal.propTypes = {
  fileType: PropTypes.string,
  src: PropTypes.string
}
