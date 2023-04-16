import "./ContactUs.css"

export default function ContactUs() {
  return (
    <>
      <h2>Contact Us</h2>
      <div id="contact-us-content">
        <div id="contact-us-text">
          <h4>Our Address:</h4>
          <p>
            Units 1-3 Yelverton Road <br/>
            BS4 5HP<br/>
            Bristol
          </p>
          <hr/>
          <p>Tel: 0117 496 0891</p>
          <p>Email: <a href="mailto:info@jamhouse.com">info@jamhouse.com</a></p>
        </div>
      <img src="http://localhost:8000/media/map.png" alt="A map showing our location" />
      </div>
    </>
  );
};
