import { Link } from "react-router-dom"
import { styled, keyframes } from "styled-components";

const popupAnim = keyframes`
  from {
    opacity: 0;
    top: 2rem;
  }
  to {
    opacity: 1;
    top: 0;
  }
`
const Content = styled.div`
  display: grid;
  padding: 1rem;
  padding-bottom: 5rem;
  position: relative;
  width: 100%;
  min-height: 100vh;
  outline-color: blue;
  @media (width < 300px) {
    grid-gap: 5px;
  };
  @media (width >= 300px) {
    grid-gap: 10px;
  };
  @media (600px <= width <= 1200px) {
    grid-gap: 15px;
  };
  @media (width >= 1200px) {
    grid-gap: 20px;
  };
`
const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: clamp(1rem, 5vw, 5rem);
  text-transform: Capitalize;
  text-align: center;
  & > * {
    max-width: 500px;
  }
`
const ScrollButton = styled.div`
  display: ${props => props.scrolled};
  position: fixed;
  inset: auto 10% 10% auto;
  aspect-ratio: 1;
  width: 3rem;
  background: var(--navBg);
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 5;
`
const Nav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  z-index: 50;
  position: sticky;
  top: 0;
  background-color: ${props => !props.scrolled && `var(--navBg)`};
  @media (width > 460px){
    background-color: var(--navBg);
    width: max(400px, min(20%, 200px));
    height: 100vh;
    height: 100svh;
  }
`
const Burger = styled.button`
  font-size: 1.5rem;
  @media (width > 460px) {
    display: none;
  }
`

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: .5rem 1.5rem;
  font-family: Comforter, Helvetica;
  & > a {
    padding: 5px 10px;
  }
`

const List = styled.ul`
  display: ${props => props.isopen};
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: .5rem 1.5rem 1.5rem 1.5rem;
  gap: .5rem;
  position: absolute;
  width: 100%;
  background-color: inherit;
  top: 100%;
  @media (width > 460px) {
    display: flex;
    position: unset;
    top: unset;
    flex-grow: 1;
    & > li:last-of-type {
        margin-top: auto;
      }
  }
`

const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  position: relative;
  ${({ active }) => active && `
    & > div {
      color: var(--active);
    }
  `};
  & > div:hover, & > div:active {
    color: var(--active);
  }
  & > * {
    display: flex;
    flex-grow: 1;
    width: calc(100% - 1rem);
    justify-content: space-between;
    align-items: center;
    user-select: none;
    padding: .25rem .5rem;
  };
  & a {
    flex-grow: 1;
  }
`

const SubList = styled(List)`
  position: unset;
  padding-bottom: .5rem;
  display: ${props => props.isopen};
`

const ContactList = styled(ListItem)`
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  padding: .5rem 1rem;
`
const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 1rem;
  width: 100%;
  outline-color: plum;
  /* flex-grow: 1; */
  @media (min-width: 1024px){
    grid-template-columns: repeat(3, minmax(150px, 1fr))
  }
`
const Folder = styled(Link)`
  width: 100%;
  min-height: 320px;
  aspect-ratio: 1 / 1;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  cursor: pointer;
  animation: ${popupAnim} ${props => props.delay * .5}s ease;
  &:after {
    content: "";
    background-color: var(--overlay-color);
    position: absolute;
    inset: 0;
  }
  @media (width > 768px){
    min-height: 150px;
  }
`
const TextOverlay = styled.div`
  position: absolute;
  z-index: 3;
  text-transform: Capitalize;
  font-size: clamp(1.2rem, 2vw, 2rem);
  color: hsl(0 0% 80%)
`
const ErrorPage = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export {
  Content,
  Title,
  ScrollButton,
  Nav,
  Burger,
  Topbar,
  List,
  ListItem,
  ContactList,
  SubList,
  Gallery,
  Folder,
  TextOverlay,
  ErrorPage,
}
