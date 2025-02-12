const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>Daniel Martin &copy; {currentYear}</p>
        </footer>
    );
};

export default Footer;