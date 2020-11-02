import BuildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <div><h1>You are signed in</h1></div> 
  ) : ( 
    <div><h1>You are NOT signed in</h1></div> 
  );
}

LandingPage.getInitialProps = async (context) => {
  console.log('Landing Page!!',context);
  const { data } = await BuildClient(context).get('/api/users/currentuser')
  console.log('data',data);
  return data;
}

export default LandingPage;