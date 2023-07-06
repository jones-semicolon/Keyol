import { Component } from 'react'
import { Nav, Burger, Topbar, List, ListItem, ContactList, SubList } from './styled';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function navbarRoute(NavRoute) {
  return function wrappedNav(props) {
    const location = useLocation();
    return <NavRoute location={location} />
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

  hide(e){
    this.setState({isBurgerOpen: false})
  }

  render() {
    const { isScrolled, haveBurger, isBurgerOpen, isEventOpen } = this.state
    const { pathname } = this.props.location;
    return (
      <>
        <Nav scrolled={(!isScrolled && !isBurgerOpen) ? "transparent" : undefined}>
          <Topbar>
            <Link to="/"><h1>Keyol</h1></Link>
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
              <Link to="/portraits" onClick={(e) => this.hide(e)}>Portraits</Link></ListItem>
            <ListItem>
              <Link to="/events">Events <FontAwesomeIcon icon={["fas", "chevron-down"]} onClick={(e) =>
                this.setState({
                  isEventOpen: !isEventOpen
                })} /></Link>
              <SubList isopen={isEventOpen ? "flex" : "none"} >
                <ListItem active={+(pathname === "/event/rakrakan-festival")}><Link to="/event/rakrakan-festival" onClick={(e) => this.hide(e)}>Rakrakan Festival</Link></ListItem>
                <ListItem active={+(pathname === "/event/wowowin")}><Link to="/event/wowowin" onClick={(e) => this.hide(e)}>Wowowin</Link></ListItem>
                <ListItem active={+(pathname === "/event/showtime")}><Link to="/event/showtime" onClick={(e) => this.hide(e)}>Showtime</Link></ListItem>
                <ListItem active={+(pathname === "/event/jakul")}><Link to="/event/jakul" onClick={(e) => this.hide(e)}>Jakul</Link></ListItem>
              </SubList>
            </ListItem>
            <ListItem active={+(pathname === "/still-life")}>
              <Link to="/still-life" onClick={(e) => this.hide(e)}>Still Life</Link></ListItem>
            <ListItem active={+(pathname === "/nature")}>
              <Link to="/nature" onClick={(e) => this.hide(e)}>Nature</Link></ListItem>
            <ListItem active={+(pathname === "/sports")}>
              <Link to="/sports" onClick={(e) => this.hide(e)}>Sports</Link></ListItem>
            <ContactList>
              <FontAwesomeIcon icon={["fab", "facebook"]} />
              <FontAwesomeIcon icon={["fab", "instagram"]} />
              <FontAwesomeIcon icon={["fab", "tiktok"]} />
            </ContactList>
          </List>
        </Nav>
        <Outlet />
      </>
    )
  }
}

export default navbarRoute(Navbar);
