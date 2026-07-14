// Alphega Security - Homepage & Contact Form Dispatch Interaction Scripts

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const serviceEnquireBtns = document.querySelectorAll(".service-enquire-btn");
  const contactForm = document.getElementById("contact-form");
  const serviceSelect = document.getElementById("form-service");
  const messageInput = document.getElementById("form-message");

  // 1. "Enquire Now" Service Card Interaction
  serviceEnquireBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const serviceVal = btn.getAttribute("data-service");

      // Highlight/select corresponding option in contact form
      if (serviceSelect) {
        for (let option of serviceSelect.options) {
          if (
            option.value === serviceVal ||
            option.text.toLowerCase().includes(serviceVal.toLowerCase())
          ) {
            serviceSelect.value = option.value;
            break;
          }
        }
      }

      // Smooth scroll to the contact form section
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Focus and add temporary helper placeholder/cursor to message textarea
      if (messageInput) {
        setTimeout(() => {
          messageInput.focus();
          messageInput.placeholder = `I am interested in Alphega's ${serviceVal} services. Please outline availability and options.`;
        }, 800); // Wait for smooth scroll to finalize
      }
    });
  });

  // 2. Contact Form Submission Web3Forms Integration
  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("form-name").value.trim();
      const email = document.getElementById("form-email").value.trim();
      const service = document.getElementById("form-service").value;

      if (!name || !email) {
        alert("Please fill in your name and email address.");
        return;
      }

      // Build FormData directly from form inputs
      const formData = new FormData(contactForm);
      // Appends access key programmatically so it doesn't need to exist in the HTML
      formData.append("access_key", "ae810202-237a-4bd4-b45f-e0e7586150b1");

      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          // Success: Swaps form container with the tailored Alphega success overlay
          const formContainer = contactForm.parentElement;
          const originalContent = formContainer.innerHTML;

          formContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 0; animation: fadeIn 0.5s ease;">
                <div style="width: 70px; height: 70px; border: 2px solid var(--border-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px auto;">
                    <svg style="width: 35px; height: 35px; fill: var(--text-primary);" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                </div>
                <h3 style="margin-bottom: 15px; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Security Inquiry Logged</h3>
                <p style="color: var(--text-secondary); max-width: 380px; margin: 0 auto 30px auto; font-size: 15px; line-height: 1.6;">
                    Thank you, <strong>${name}</strong>. Your protective consultation request for <strong>${service}</strong> has been logged. Our dispatch division will reach out via <strong>${email}</strong> shortly.
                </p>
                <button id="reset-form-btn" class="btn-secondary" style="font-size: 14px; padding: 10px 24px; cursor: pointer;">Submit Another Inquiry</button>
            </div>
          `;

          document
            .getElementById("reset-form-btn")
            .addEventListener("click", () => {
              formContainer.innerHTML = originalContent;
              window.location.reload(); // Restores clean DOM state and re-binds listeners
            });
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        alert("Something went wrong. Please try again.");
      } finally {
        // Safe check: Only restore button state if the button element is still mounted in the DOM.
        // If submission was successful, the form is replaced, so this step is safely ignored.
        if (document.body.contains(submitBtn)) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  // 3. Highlight Navigation Links on Scroll
  const sections = document.querySelectorAll("div[id], header");
  const navLinks = document.querySelectorAll("nav a");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.scrollY + 150; // offset for nav height

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});
