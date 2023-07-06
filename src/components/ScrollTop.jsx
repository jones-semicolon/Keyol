import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import { ScrollButton } from '../components/styled'

export default class ScrollTop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isScrolled: false,
    }
  }

  componentDidMount(){
    window.addEventListener('scroll', () => {
      window.scrollY >= 200 ? this.setState({isScrolled: true}) : this.setState({isScrolled: false})
    })
  }

  render() {
    const { isScrolled } = this.state;
    return (
      <ScrollButton scrolled={isScrolled ? "flex" : "none"} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
        <FontAwesomeIcon icon={["fas", "chevron-up"]} />
      </ScrollButton>
    )
  }
}
