import BuildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <div><h1>You are signed in</h1></div> 
  ) : ( 
    <div><h1>You are NOT signed in</h1></div> 
  );
}

LandingPage.getInitialProps = async (context) => {
  const { data } = await BuildClient(context).get('/api/users/currentuser')
  return data;
}

export default LandingPage;