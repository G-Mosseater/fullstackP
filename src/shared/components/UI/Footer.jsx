import './Footer.css'
const Footer = () => {
  return (
    <>
      <footer class="site-footer">
        <div class="footer-container">
          <div class="footer-section">
            <h3>Example Footer</h3>
            <p>
              This is an example footer for your website. You can replace this
              text with real info.
            </p>
          </div>

          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Follow Us</h3>
            <ul class="social-links">
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2025 Example Footer. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
