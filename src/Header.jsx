import './App.css';
import AHAIcon from '../public/AHA_icon.svg';

function Header() {
  return (
    <header className='topHeader'>
      <h1 className='header'>
        <img style={{ height: '100px', margin: "0 1rem" }} src={AHAIcon} alt="AHA Icon" />
        Interactive ACLS Algorithm
      </h1>
    </header>
  );
}

export default Header;