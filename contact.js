async function handleSubmit() {
      const fname = document.getElementById('fname').value.trim();
      const lname = document.getElementById('lname').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const err = document.getElementById('cf-error');
      const btn = document.getElementById('cf-submit');

      if (!fname || !lname || !email || !message) {
        err.textContent = 'Please fill out all fields.';
        err.style.display = 'block';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.textContent = 'Please enter a valid email address.';
        err.style.display = 'block';
        return;
      }

      err.style.display = 'none';
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const res = await fetch('https://formspree.io/f/xpqojejv', {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: `${fname} ${lname}`, email, message })
        });

        if (res.ok) {
          document.getElementById('cf-form').style.display = 'none';
          document.getElementById('cf-success').style.display = 'block';
        } else {
          err.textContent = 'Something went wrong. Please try again.';
          err.style.display = 'block';
          btn.textContent = 'Send';
          btn.disabled = false;
        }
      } catch {
        err.textContent = 'Network error. Please check your connection and try again.';
        err.style.display = 'block';
        btn.textContent = 'Send';
        btn.disabled = false;
      }
    }

    function resetForm() {
      ['fname','lname','email','message'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('cf-submit').textContent = 'Send';
      document.getElementById('cf-submit').disabled = false;
      document.getElementById('cf-form').style.display = 'block';
      document.getElementById('cf-success').style.display = 'none';
    }