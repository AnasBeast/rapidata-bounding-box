import rapidataLogo from '../assets/rapidata-logo.svg';

const NavBar = () => {
    return (
      <header>
          <img src={rapidataLogo} alt="rapidata logo" className="h-11" />
      </header>
    );
}

export default NavBar;