import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Component, Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Burger, ContactList, List, ListItem, Nav, SubList, Topbar } from '../styles/styled';
import Loader from "./Loader";

function navbarRoute(NavRoute) {
  return function wrappedNav(props) {
    const location = useLocation();
    return <NavRoute location={location} {...props} />
  }
}

export class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrolled: false,
      isBurgerOpen: false,
      isEventOpen: false,
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", () => {
      window.scrollY >= 50 ? this.setState({ isScrolled: true }) : this.setState({ isScrolled: false })
    })
  }

  hide() {
    this.setState({ isBurgerOpen: false })
  }

  render() {
    const { isScrolled, isBurgerOpen, isEventOpen } = this.state
    const { pathname } = this.props.location;
    return (
      <>
        <Nav scrolled={(!isScrolled && !isBurgerOpen) ? "transparent" : undefined}>
          <Topbar>
            <Link to="/" onClick={(e) => this.hide(e)}><h1>Keyol</h1></Link>
            <Burger
              onClick={() =>
                this.setState({
                  isBurgerOpen: !isBurgerOpen
                })}
              isopen={isBurgerOpen ? "flex" : "none"}
            >
              <FontAwesomeIcon
                icon={["fas",
                  !isBurgerOpen ?
                    "bars" :
                    "xmark"
                ]}
              />
            </Burger>
          </Topbar>
          <List isopen={isBurgerOpen ? "flex" : "none"}>
            <ListItem active={+(pathname === "/portraits")}>
              <div><Link to="/portraits" onClick={(e) => this.hide(e)}>Portraits</Link></div></ListItem>
            <ListItem active={+(pathname === '/events')}>
              <div>
                <Link to="/events">Events</Link>
                <FontAwesomeIcon icon={["fas", `chevron-${isEventOpen ? "up" : "down"}`]} onClick={(e) => {
                  e.stopPropagation();
                  this.setState({
                    isEventOpen: !isEventOpen
                  })
                }} />
              </div>
              <SubList isopen={isEventOpen ? "flex" : "none"} >
                <ListItem active={+(pathname === "/event/rakrakan-festival")}><div><Link to="/events/rakrakan-festival" onClick={(e) => this.hide(e)}>Rakrakan Festival</Link></div></ListItem>
                <ListItem active={+(pathname === "/event/wowowin")}><div><Link to="/events/wowowin" onClick={(e) => this.hide(e)}>Wowowin</Link></div></ListItem>
                <ListItem active={+(pathname === "/event/showtime")}><div><Link to="/events/showtime" onClick={(e) => this.hide(e)}>Showtime</Link></div></ListItem>
                <ListItem active={+(pathname === "/event/jakul")}><div><Link to="/events/jakul" onClick={(e) => this.hide(e)}>Jakul</Link></div></ListItem>
              </SubList>
            </ListItem>
            <ListItem active={+(pathname === "/still-life")}>
              <div><Link to="/still-life" onClick={(e) => this.hide(e)}>Still Life</Link></div></ListItem>
            <ListItem active={+(pathname === "/nature")}>
              <div><Link to="/nature" onClick={(e) => this.hide(e)}>Nature</Link></div></ListItem>
            <ListItem active={+(pathname === "/sports")}>
              <div><Link to="/sports" onClick={(e) => this.hide(e)}>Sports</Link></div></ListItem>
            <ContactList>
              <FontAwesomeIcon icon={["fab", "facebook"]} />
              <FontAwesomeIcon icon={["fab", "instagram"]} />
              <FontAwesomeIcon icon={["fab", "tiktok"]} />
            </ContactList>
          </List>
        </Nav>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </>
    )
  }
}

export default navbarRoute(Navbar);

Navbar.propTypes = {
  location: PropTypes.object
}
