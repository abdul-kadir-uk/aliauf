const Footer = () => {
  return (
    <>
      <footer className="flex flex-col items-center sm:flex-row sm:justify-between mt-2 border-2 border-theme p-2">
        <div> Made with Love &copy;{new Date().getFullYear()} Aliauf</div>
        <div> privacy and policy </div>
        <div> Contact us</div>
      </footer>
    </>
  );
};

export default Footer;
