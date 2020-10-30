import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
}

LandingPage.getInitialProps = async () => {
  console.log('typeof window',typeof window);
  if (typeof window === 'undefined') {
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: { Host: 'ticketing.dev' }
      }
    )
    return data;
  } else {
    const { data } = await axios.get('/api/users/currentuser');
    return data;
  }
  // const {response} = await axios.get('http://ingress-nginx-controller.ingress-nginx.srv.cluster.local/api/users/currentuser');
  // return response.data
  console.log('I WAS EXECUTED');
  return {};
}

export default LandingPage;