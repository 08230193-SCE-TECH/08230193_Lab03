document.addEventListener('DOMContentLoaded', () => {
    // Page fade-in
    document.body.style.opacity = '1';

    // ---------------- Smooth Scrolling for in-page anchors ----------------
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            } else if (href && !href.startsWith('#') && !link.hasAttribute('target')) {
                // Fade-out for internal navigation
                e.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => { window.location.href = href; }, 300);
            }
        });
    });

    // ---------------- Active section highlight (if ids exist) ----------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links li a');
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (scrollY >= sectionTop) current = section.getAttribute('id') || '';
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (current && link.getAttribute('href') === `#${current}`) link.classList.add('active');
            });
        });
    }

    // ---------------- Theme toggle with persistence ----------------
    const themeToggle = document.querySelector('.theme-toggle');
    const applyTheme = (mode) => {
        document.body.classList.toggle('dark', mode === 'dark');
        if (themeToggle) themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
    };
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = document.body.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('theme', next);
            applyTheme(next);
        });
    }

    // ---------------- Footer year + live clock ----------------
    const footerText = document.getElementById('footer-text');
    const footerClock = document.getElementById('footer-clock');
    const updateFooter = () => {
        const now = new Date();
        const year = now.getFullYear();
        if (footerText) {
            // Ensure copyright year is current
            const base = `© ${year} Sonam Choden | All Rights Reserved`;
            footerText.firstChild ? footerText.firstChild.textContent = base + ' ' : footerText.textContent = base + ' ';
        }
        if (footerClock) footerClock.textContent = now.toLocaleTimeString();
    };
    updateFooter();
    setInterval(updateFooter, 1000);

    // ---------------- Project filtering ----------------
    const filterContainer = document.getElementById('project-filters');
    const projectGrid = document.getElementById('projects-grid');
    if (filterContainer && projectGrid) {
        const cards = projectGrid.querySelectorAll('.project-card');
        filterContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            const f = btn.getAttribute('data-filter');
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cards.forEach(card => {
                const cat = card.getAttribute('data-category') || '';
                const show = f === 'all' || cat === f;
                card.style.display = show ? '' : 'none';
            });
        });
    }

    // ---------------- Project hover overlay handled by CSS (.project-desc) ----------------

    // ---------------- Confetti on project card click ----------------
    const createConfetti = (x, y) => {
        for (let i = 0; i < 30; i++) {
            const node = document.createElement('div');
            node.classList.add('confetti');
            document.body.appendChild(node);
            node.style.left = x + Math.random()*100 - 50 + 'px';
            node.style.top = y + Math.random()*100 - 50 + 'px';
            node.style.background = `hsl(${Math.random()*360},70%,60%)`;
            node.style.width = '8px';
            node.style.height = '8px';
            node.style.position = 'absolute';
            node.style.borderRadius = '50%';
            node.style.opacity = 1;
            node.style.transition = 'all 1s ease-out';
            setTimeout(() => {
                node.style.transform = `translateY(${Math.random()*200 - 100}px) translateX(${Math.random()*200 - 100}px)`;
                node.style.opacity = 0;
            }, 50);
            setTimeout(() => node.remove(), 1000);
        }
    };
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const r = card.getBoundingClientRect();
            createConfetti(r.left + r.width/2, r.top + r.height/2);
        });
    });
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof window.confetti === 'function') {
                window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        });
    });

    // ---------------- Contact form validation + Thank You popup ----------------
    const contactForm = document.querySelector('.contact-section form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('input[name="name"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const message = contactForm.querySelector('textarea[name="message"]').value.trim();
            const valid = name.length >= 2 && /.+@.+\..+/.test(email) && message.length >= 5;
            if (!valid) {
                alert('Please fill all fields correctly.');
                return;
            }
            const modal = document.createElement('div');
            modal.className = 'thankyou-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Thank You!</h3>
                    <p>Your message has been sent successfully.</p>
                    <button class="modal-close">OK</button>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
            setTimeout(() => modal.remove(), 4000);
            contactForm.reset();
        });
    }

    // ---------------- Education expand on click ----------------
    document.querySelectorAll('.edu-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('expanded'));
    });

    // ---------------- Sidebar simple click animation ----------------
    document.querySelectorAll('.social-sidebar a img').forEach(img => {
        img.addEventListener('click', () => {
            img.style.transform = 'scale(1.25) rotate(12deg)';
            setTimeout(() => img.style.transform = '', 300);
        });
    });
});
