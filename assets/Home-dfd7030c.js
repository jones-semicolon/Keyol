import{r as l,j as s,C as d,L as h,T as p,G as c,b as m,d as f}from"./index-bd50f6ed.js";class x extends l.Component{constructor(o){super(o),this.state={folder:[],isLoaded:!1}}initialize(){window.scrollTo(0,0),this.setState({isLoaded:!1}),"caches"in window&&caches.open("folders").then(o=>{o.match("home").then(a=>{a?a.json().then(e=>{Date.now()-e.timestamp<5*60*1e3?this.setState({folder:e.folder,isLoaded:!0}):fetch("https://keyol.vercel.app/images?folderId=1KEjiPWNH6mCO0b-VrK8Ax9a2PBXDgD9s&range=3").then(t=>t.json()).then(t=>{const n=new Response(JSON.stringify({folder:t.folders,timestamp:Date.now()}));o.put("home",n),this.setState({folder:t.folders,isLoaded:!0})}).catch(t=>{throw new Error(t)})}):fetch("https://keyol.vercel.app/images?folderId=1KEjiPWNH6mCO0b-VrK8Ax9a2PBXDgD9s&range=3").then(e=>e.json()).then(e=>{console.log(e);const t=new Response(JSON.stringify({folder:e.folders,timestamp:Date.now()}));o.put("home",t),this.setState({folder:e.folders,isLoaded:!0})}).catch(e=>{throw new Error(e)})})})}componentDidMount(){this.initialize()}componentDidUpdate(o,a){!a.folder&&this.state.folder&&this.initialize()}render(){const{folder:o,isLoaded:a}=this.state;return s.jsxs(d,{children:[a?void 0:s.jsx(h,{}),s.jsx(p,{children:s.jsx("h3",{children:"My name is Caeoal Armentano and I am a passionate photographer dedicated to capturing the fleeting beauty of people."})}),s.jsx(c,{className:"gallery",children:o==null?void 0:o.map(({name:e,files:t,folders:n},r)=>{var i;if(!(!e&&!t.length))return s.jsxs(m,{to:`/${e}`,delay:r,children:[s.jsx("img",{src:t.length?`https://keyol.vercel.app/image?url=${encodeURIComponent(t[0].thumbnailLink)}`:`https://keyol.vercel.app/image?url=${encodeURIComponent((i=n[0])==null?void 0:i.files[0].thumbnailLink)}`,loading:"lazy"}),s.jsx(f,{children:e})]},r)})})]})}}export{x as default};
