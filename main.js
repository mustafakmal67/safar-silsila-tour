// --- Preloader Fade Out with Safety Timeout ---
(function() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const fadeOut = () => {
      if (!preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }
    };
    
    // Fade out when window is fully loaded
    window.addEventListener('load', fadeOut);
    
    // Safety fallback: fade out anyway after 2.5s
    setTimeout(fadeOut, 2500);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Menu Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Create an overlay for the mobile menu backdrop
  const menuOverlay = document.createElement('div');
  menuOverlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(2px); z-index: 1999;
    opacity: 0; pointer-events: none;
    transition: opacity 0.35s ease;
  `;
  document.body.appendChild(menuOverlay);

  const openMenu = () => {
    navMenu.classList.add('open');
    navToggle.innerHTML = '<i class="ph ph-x"></i>';
    menuOverlay.style.opacity = '1';
    menuOverlay.style.pointerEvents = 'all';
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    navMenu.classList.remove('open');
    navToggle.innerHTML = '<i class="ph ph-list"></i>';
    menuOverlay.style.opacity = '0';
    menuOverlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
    menuOverlay.addEventListener('click', closeMenu);
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }


  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');
    
    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(i => {
          i.classList.remove('active');
          const panel = i.querySelector('.faq-answer-panel');
          if (panel) panel.style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
        }
      });
    }
  });

  // --- Custom Tour Form Actions ---
  const customTourForm = document.getElementById('custom-tour-form');
  if (customTourForm) {
    // Option Cards selections
    const optionContainers = document.querySelectorAll('.option-grid');
    optionContainers.forEach(container => {
      const cards = container.querySelectorAll('.option-card');
      const hiddenInput = container.querySelector('input[type="hidden"]');
      const isMulti = container.dataset.multi === 'true';
      
      cards.forEach(card => {
        card.addEventListener('click', () => {
          if (isMulti) {
            // Toggle active state
            card.classList.toggle('active');
            
            // Gather all active values
            const activeCards = container.querySelectorAll('.option-card.active');
            const values = Array.from(activeCards).map(c => c.dataset.value || c.querySelector('.option-card-title').innerText);
            if (hiddenInput) {
              hiddenInput.value = values.join(', ');
            }
          } else {
            // Remove active from sibling cards in this grid
            cards.forEach(c => c.classList.remove('active'));
            // Set current card to active
            card.classList.add('active');
            
            // Save value in hidden input
            if (hiddenInput) {
              hiddenInput.value = card.dataset.value || card.querySelector('.option-card-title').innerText;
            }
          }
        });
      });
    });

    // Form Submit Action
    customTourForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validation of required fields
      const requiredInputs = customTourForm.querySelectorAll('[required]');
      let isValid = true;
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--error)';
          input.addEventListener('input', function checkFilled() {
            if (this.value.trim()) {
              this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              this.removeEventListener('input', checkFilled);
            }
          });
        }
      });

      // Check if required option hidden inputs are selected
      const hiddenRequired = customTourForm.querySelectorAll('input[type="hidden"][required]');
      hiddenRequired.forEach(input => {
        if (!input.value) {
          isValid = false;
          const grid = input.closest('.option-grid');
          if (grid) {
            grid.style.outline = '1px solid var(--error)';
            grid.style.borderRadius = 'var(--radius-default)';
            grid.addEventListener('click', function clearOutline() {
              grid.style.outline = 'none';
              grid.removeEventListener('click', clearOutline);
            });
          }
        }
      });

      if (!isValid) {
        alert('Please select your destination, accommodation, budget tier, and fill out your contact details.');
        return;
      }

      // Collect values
      const destinations = document.getElementById('selected-destination').value || 'Custom / Other';
      const duration = customTourForm.querySelector('[name="duration"]').value || 'Not specified';
      const travelers = customTourForm.querySelector('[name="travelers"]').value || 'Not specified';
      const flexible = customTourForm.querySelector('[name="flexible_dates"]:checked') ? 'Yes' : 'No';
      const startDate = customTourForm.querySelector('[name="start_date"]').value || 'Not specified';
      const endDate = customTourForm.querySelector('[name="end_date"]').value || 'Not specified';
      const accommodation = document.getElementById('selected-accommodation').value || 'Not specified';
      const activities = document.getElementById('selected-activities').value || 'None';
      const budget = document.getElementById('selected-budget').value || 'Not specified';
      const notes = customTourForm.querySelector('[name="special_requirements"]').value || 'None';
      const name = customTourForm.querySelector('[name="name"]').value || '';
      const email = customTourForm.querySelector('[name="email"]').value || '';
      const phone = customTourForm.querySelector('[name="phone"]').value || '';

      // Compile WhatsApp message
      const waMessage = `Hello Safar Silsila, I would like to request a Custom Tour planning:\n\n` +
        `📍 Destinations: ${destinations}\n` +
        `🕒 Duration: ${duration}\n` +
        `👥 Travelers: ${travelers}\n` +
        `📅 Flexible Dates: ${flexible} (Start: ${startDate}, End: ${endDate})\n` +
        `🏨 Accommodation: ${accommodation}\n` +
        `🎒 Activities: ${activities}\n` +
        `💵 Budget Per Person: ${budget}\n` +
        `📝 Notes: ${notes}\n\n` +
        `👤 Name: ${name}\n` +
        `✉️ Email: ${email}\n` +
        `📞 Phone/WhatsApp: ${phone}`;

      // Redirect to WhatsApp
      const waUrl = `https://wa.me/923111145456?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');
      
      // Simulate success message
      const formContent = document.querySelector('.form-card');
      if (formContent) {
        formContent.innerHTML = `
          <div class="text-center py-12 animate-fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;">
            <div style="width: 80px; height: 80px; background-color: rgba(116, 135, 78, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--sunset-accent); font-size: 40px; margin-bottom: 8px;">
              <i class="ph ph-check-circle"></i>
            </div>
            <h2 class="display-lg-mobile text-snow-peak font-bold">Request Prepared!</h2>
            <p class="body-md text-muted" style="max-width: 500px; margin: 0 auto; color: rgba(255,255,255,0.7) !important;">
              Thank you for choosing Safar Silsila. We have compiled your custom itinerary details and redirected you to WhatsApp to complete your request with our travel planners.
            </p>
            <a href="index.html" class="btn btn-secondary mt-6" style="text-decoration: none;">Return Home</a>
          </div>
        `;
      }
    });
  }

  // --- Dynamic Tours Page Filter Logic ---
  const searchInput = document.getElementById('tour-search');
  const locationSelect = document.getElementById('tour-location');
  const durationSelect = document.getElementById('tour-duration');
  const levelSelect = document.getElementById('tour-level');
  const typeSelect = document.getElementById('tour-type');
  const filterPills = document.querySelectorAll('.filter-pill');
  const tourCountText = document.getElementById('tour-count');
  
  if (searchInput || locationSelect || durationSelect || levelSelect || typeSelect || filterPills.length > 0) {
    const tourCards = document.querySelectorAll('article.tour-card');
    
    const filterTours = () => {
      let activePillType = 'all';
      filterPills.forEach(pill => {
        if (pill.classList.contains('active')) {
          activePillType = pill.dataset.filter;
        }
      });

      const query = searchInput ? searchInput.value.toLowerCase() : '';
      const location = locationSelect ? locationSelect.value.toLowerCase() : 'all';
      const duration = durationSelect ? durationSelect.value.toLowerCase() : 'all';
      const level = levelSelect ? levelSelect.value.toLowerCase() : 'all';
      const type = typeSelect ? typeSelect.value.toLowerCase() : 'all';

      let visibleCount = 0;

      tourCards.forEach(card => {
        let show = true;

        // 1. Text Search Query
        const titleText = card.querySelector('.tour-title')?.textContent.toLowerCase() || '';
        const highlightText = Array.from(card.querySelectorAll('.tour-highlights li')).map(li => li.textContent.toLowerCase()).join(' ');
        const cardMetaText = card.querySelector('.tour-meta')?.textContent.toLowerCase() || '';
        const fullText = `${titleText} ${highlightText} ${cardMetaText}`;
        if (query && !fullText.includes(query)) {
          show = false;
        }

        // 2. Location filter
        if (location !== 'all' && location !== 'all locations') {
          if (!fullText.includes(location)) show = false;
        }

        // 3. Duration filter
        if (duration !== 'all' && duration !== 'all durations') {
          // parses e.g. "4 days", "6 days", "8 days"
          const daysText = card.querySelector('.tour-meta')?.textContent.toLowerCase() || '';
          if (!daysText.includes(duration)) show = false;
        }

        // 4. Level filter
        if (level !== 'all' && level !== 'all levels') {
          const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.toLowerCase());
          if (!badges.includes(level)) show = false;
        }

        // 5. Type filter
        if (type !== 'all' && type !== 'all types') {
          const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.toLowerCase());
          if (!badges.includes(type)) show = false;
        }

        // 6. Pill Category filter (All, By Air, Group)
        if (activePillType !== 'all') {
          if (activePillType === 'by-air') {
            const isByAir = titleText.includes('by air') || highlightText.includes('by air') || cardMetaText.includes('by air');
            if (!isByAir) show = false;
          } else if (activePillType === 'group') {
            const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.toLowerCase());
            if (!badges.includes('group')) show = false;
          }
        }

        // Toggle display
        if (show) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update count text
      if (tourCountText) {
        tourCountText.textContent = `${visibleCount} tour${visibleCount !== 1 ? 's' : ''} found`;
      }
    };

    // Event listeners
    if (searchInput) searchInput.addEventListener('input', filterTours);
    if (locationSelect) locationSelect.addEventListener('change', filterTours);
    if (durationSelect) durationSelect.addEventListener('change', filterTours);
    if (levelSelect) levelSelect.addEventListener('change', filterTours);
    if (typeSelect) typeSelect.addEventListener('change', filterTours);

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterTours();
      });
    });
  }

  // --- Floating WhatsApp Button Action ---
  const whatsappBtns = document.querySelectorAll('.whatsapp-action');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://wa.me/923111145456?text=Hello%20Safar%20Silsila%20I%20would%20like%20to%20inquire%20about%20a%20tour', '_blank');
    });
  });

  // --- Who We Are Scroll Reveal Observer ---
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window && revealItems.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.1,
              rootMargin: '0px 0px -50px 0px'
    });
    revealItems.forEach(item => observer.observe(item));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealItems.forEach(item => item.classList.add('revealed'));
  }



  // --- Query Parameter Parsing for Tour Inquiries ---
  const urlParams = new URLSearchParams(window.location.search);
  const tourName = urlParams.get('tour');
  if (tourName) {
    const messageTextarea = document.getElementById('form-message') || document.getElementById('home-form-message');
    if (messageTextarea) {
      messageTextarea.value = `Hello, I am interested in inquiring about the tour package: "${tourName}".\n\n`;
      messageTextarea.focus();
    }
    const subjectSelect = document.getElementById('form-subject');
    if (subjectSelect) {
      subjectSelect.value = 'Custom Tour Inquiry';
    }
  }

  // --- Contact Form Submission Redirect to WhatsApp ---
  const contactForms = document.querySelectorAll('#contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect inputs
      const nameInput = form.querySelector('[id*="name"]');
      const emailInput = form.querySelector('[id*="email"]');
      const phoneInput = form.querySelector('[id*="phone"]');
      const subjectInput = form.querySelector('[id*="subject"]');
      const messageInput = form.querySelector('[id*="message"]');

      const name = nameInput ? nameInput.value : '';
      const email = emailInput ? emailInput.value : '';
      const phone = phoneInput ? phoneInput.value : 'Not specified';
      const subject = subjectInput ? subjectInput.value : 'Contact Inquiry';
      const messageText = messageInput ? messageInput.value : '';

      // Validate required inputs
      if (!name || !email || !messageText) {
        alert('Please fill out all required fields.');
        return;
      }

      // Compile WhatsApp message text
      const waMessage = `Hello Safar Silsila, I have a contact inquiry:\n\n` +
        `📝 Subject: ${subject}\n` +
        `👤 Name: ${name}\n` +
        `✉️ Email: ${email}\n` +
        `📞 Phone: ${phone}\n\n` +
        `💬 Message:\n${messageText}`;

      // Open WhatsApp link in new tab
      const waUrl = `https://wa.me/923111145456?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');

      // Reset form and show success alert
      form.reset();
      alert('Thank you! Your inquiry details have been prepared and redirected to WhatsApp for instant chat.');
    });
  });

  // --- Newsletter Form Redirect to WhatsApp ---
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const waMessage = `Hello Safar Silsila, I would like to subscribe to your newsletter with my email: ${emailInput.value}`;
        const waUrl = `https://wa.me/923111145456?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, '_blank');
        form.reset();
        alert('Thank you! Redirecting to WhatsApp to complete your newsletter subscription.');
      }
    });
  });

  // --- Transport Booking Form Redirect to WhatsApp ---
  const transportForm = document.getElementById('transport-booking-form');
  if (transportForm) {
    transportForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect inputs
      const departure = document.getElementById('booking-departure').value;
      const destination = document.getElementById('booking-destination').value;
      const vehicle = document.getElementById('booking-vehicle').value;
      const tripType = document.getElementById('booking-trip-type').value;
      const startDate = document.getElementById('booking-start-date').value;
      const endDate = document.getElementById('booking-end-date').value;
      const notes = document.getElementById('booking-notes').value || 'None';
      const name = document.getElementById('booking-name').value;
      const email = document.getElementById('booking-email').value;
      const phone = document.getElementById('booking-phone').value;

      // Validate required inputs
      if (!departure || !destination || !vehicle || !tripType || !startDate || !endDate || !name || !email || !phone) {
        alert('Please fill out all required fields.');
        return;
      }

      // Compile WhatsApp message text
      const waMessage = `Hello Safar Silsila, I would like to request a Rental Transport booking:\n\n` +
        `🚗 Selected Vehicle: ${vehicle}\n` +
        `📍 Departure City: ${departure}\n` +
        `🎯 Destination/Route: ${destination}\n` +
        `🔁 Rental Trip Type: ${tripType}\n` +
        `📅 Pickup Date: ${startDate}\n` +
        `📅 Return Date: ${endDate}\n` +
        `📝 Special Requirements: ${notes}\n\n` +
        `👤 Name: ${name}\n` +
        `✉️ Email: ${email}\n` +
        `📞 Phone/WhatsApp: ${phone}`;

      // Open WhatsApp link in new tab
      const waUrl = `https://wa.me/923111145456?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');

      // Reset form and display success state
      transportForm.reset();
      const formCard = transportForm.closest('.form-card');
      if (formCard) {
        formCard.innerHTML = `
          <div class="text-center py-12 animate-fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;">
            <div style="width: 80px; height: 80px; background-color: rgba(116, 135, 78, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--sunset-accent); font-size: 40px; margin-bottom: 8px;">
              <i class="ph ph-check-circle"></i>
            </div>
            <h2 class="display-lg-mobile text-snow-peak font-bold">Booking Request Prepared!</h2>
            <p class="body-md text-muted" style="max-width: 500px; margin: 0 auto; color: rgba(255,255,255,0.7) !important;">
              Thank you for choosing Safar Silsila. We have compiled your transport rental request and redirected you to WhatsApp to finalise your booking with our transport managers.
            </p>
            <a href="index.html" class="btn btn-secondary mt-6" style="text-decoration: none;">Return Home</a>
          </div>
        `;
      }
    });
  }
});
