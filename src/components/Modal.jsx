import { Component } from "react";
import ReactModal from "react-modal";
import PropTypes from 'prop-types'

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
            aspectRatio: this.props.width > this.props.height ? "3 / 2" : "2 / 3",
            height: "auto",
            width: "auto",
          },
          overlay: {
            backgroundColor: "var(--overlay-color)",
          }
        }}
      >
        {
          this.props.fileType === "video" ?
            <video src={this.props.src} autoPlay controls playsInline controlsList="nodownload disablepictureinpicture" style={{ width: "100%", objectFit: "contain" }}></video> :
            <img src={this.props.src} alt="" style={{ width: "100%", objectFit: "contain" }} />
        }
      </ReactModal>
    )
  }
}


Modal.propTypes = {
  src: PropTypes.string,
  close: PropTypes.func,
  state: PropTypes.bool,
  fileType: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number
}
