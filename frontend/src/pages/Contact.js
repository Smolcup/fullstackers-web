function Contact() {
  function onSubmit(e) {
    e.preventDefault();
    alert('Thanks! We will get back to you.');
  }

  return (
    <div>
      <h1 className="section-title">Contact</h1>
      <form className="form" onSubmit={onSubmit}>
        <input name="name" placeholder="Your name" />
        <input name="email" placeholder="Your email" />
        <textarea name="message" placeholder="Message" />
        <button className="btn" type="submit">Send</button>
      </form>
    </div>
  );
}

export default Contact;
