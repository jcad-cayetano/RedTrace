// ==========================================================================
// GLOBAL VARIABLES
// Used for tracking donation progress in donation-process.html
// ==========================================================================
let answeredCount = 0;
const totalQuestions = 12;

// ==========================================================================
// NOTIFICATION FILTERING LOGIC
// Primary file: notifications.html
// Handles the pill-based filtering of urgent alerts, events, and reminders
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Notification Filtering Logic
    const pills = document.querySelectorAll('.filter-pills .pill');
    const cards = document.querySelectorAll('.notif-card');

    if (pills.length > 0) {
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update Active Pill UI state
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // Filter cards based on data-filter attribute
                const filterValue = pill.getAttribute('data-filter');
                cards.forEach(card => {
                    if (filterValue === 'all' || card.classList.contains(filterValue)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. Initial Assessment Progress check for donation-process.html
    updateProgress();
});

// ==========================================================================
// NOTIFICATION DELETION
// Primary file: notifications.html
// Allows staff to remove notification cards from the dashboard
// ==========================================================================
document.querySelectorAll('.fa-trash').forEach(trashIcon => {
    trashIcon.parentElement.addEventListener('click', function() {
        if(confirm("Are you sure you want to delete this notification?")) {
            this.closest('.notif-card').remove();
        }
    });
});

// ==========================================================================
// HEADER SCROLL LOGIC
// Shared across all .html files
// Changes navbar background from transparent to white on scroll
// ==========================================================================
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ==========================================================================
// TAB SWITCHING (FAQs vs Policies)
// Primary file: help.html
// Toggles visibility between the Frequently Asked Questions and Policy cards
// ==========================================================================
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event) { event.currentTarget.classList.add('active'); }

    const faqSection = document.querySelector('.faq-section');
    const policiesSection = document.querySelector('.policies-section');

    if (faqSection && policiesSection) {
        faqSection.style.display = (tabName === 'faqs') ? 'block' : 'none';
        policiesSection.style.display = (tabName === 'policies') ? 'block' : 'none';
    }
}

// ==========================================================================
// ACCORDION LOGIC
// Primary file: help.html
// Handles the expanding/collapsing of FAQ questions
// ==========================================================================
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        document.querySelectorAll('.accordion-item').forEach(other => {
            if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active');
    });
});

// ==========================================================================
// MODAL MANAGEMENT (Staff Notifications)
// Primary file: notifications.html
// Controls the "Send New Notification" popup form
// ==========================================================================
const modal = document.getElementById('modalOverlay');
const openBtn = document.querySelector('.btn-red .fa-plus')?.parentElement;
const closeBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelModal');

if (openBtn) openBtn.addEventListener('click', () => modal.style.display = 'flex');
const closeModal = () => { if(modal) modal.style.display = 'none'; };
if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ==========================================================================
// AUTH ROLES AND MODES
// Primary file: login.html
// Handles Donor vs Staff role selection and Sign-In vs Register tab switching
// ==========================================================================
function selectRole(role) {
    const donorBtn = document.getElementById('donor-role');
    const staffBtn = document.getElementById('staff-role');
    const submitBtn = document.getElementById('submit-auth-btn');
    const subtext = document.getElementById('auth-subtext');
    const notice = document.getElementById('staff-footer-note');
    const emailInput = document.getElementById('login-email');
    const badge = document.getElementById('auth-badge');

    if (role === 'donor') {
        donorBtn.classList.add('active');
        staffBtn.classList.remove('active');
        submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
        subtext.innerText = "Sign in to access your donor dashboard and track your donations.";
        notice.style.display = 'none';
        emailInput.placeholder = "your.email@university.edu";
        badge.innerHTML = '<i class="fa-solid fa-heart"></i> Donate Now';
    } else {
        staffBtn.classList.add('active');
        donorBtn.classList.remove('active');
        submitBtn.innerHTML = '<i class="fa-solid fa-hospital-user"></i> Sign In as Staff';
        subtext.innerText = "Sign in to access the staff dashboard and manage donors.";
        notice.style.display = 'block';
        emailInput.placeholder = "staff@hospital.com";
        badge.innerHTML = '<i class="fa-solid fa-heart-pulse"></i> Staff Portal';
    }
}

function toggleAuth(mode) {
    const signInTab = document.getElementById('tab-signin');
    const registerTab = document.getElementById('tab-register');
    const signInSection = document.getElementById('signin-section');
    const registerSection = document.getElementById('register-section');
    const title = document.getElementById('auth-title');
    const subtext = document.getElementById('auth-subtext');

    if (mode === 'signin') {
        signInTab.classList.add('active');
        registerTab.classList.remove('active');
        signInSection.style.display = 'block';
        registerSection.style.display = 'none';
        title.innerText = "Welcome Back";
        subtext.innerText = "Sign in to access your donor dashboard.";
    } else {
        registerTab.classList.add('active');
        signInTab.classList.remove('active');
        registerSection.style.display = 'block';
        signInSection.style.display = 'none';
        title.innerText = "Join Our Community";
        subtext.innerText = "Register as a blood donor today.";
    }
}

// ==========================================================================
// ASSESSMENT LOGIC
// Primary file: donation-process.html
// Handles user input for the 12 screening questions and tracks progress
// ==========================================================================
function answer(btn, choice) {
    const row = btn.closest('.q-row');
    const btns = row.querySelectorAll('.choice-btn');
    btns.forEach(b => b.classList.remove('selected-yes', 'selected-no'));
    btn.classList.add(choice === 'Yes' ? 'selected-yes' : 'selected-no');
    row.classList.add('answered');

    if (!row.hasAttribute('data-answered')) {
        row.setAttribute('data-answered', 'true');
        answeredCount++;
    }
    row.setAttribute('data-user-choice', choice);
    updateProgress(); 
}

function updateProgress() {
    const progressDisplay = document.getElementById('progress-text');
    const btn = document.getElementById('continue-btn');
    if (progressDisplay) progressDisplay.innerText = `${answeredCount} of ${totalQuestions} questions answered`;

    if (answeredCount === totalQuestions && btn) {
        btn.disabled = false;
        btn.classList.add('ready'); // Activates Mapúa Red styling
        
        // Ensure button is clickable despite default CSS restrictions
        btn.style.pointerEvents = "auto";
        btn.style.opacity = "1";
    }
}

// ==========================================================================
// ELIGIBILITY CHECK
// Primary file: donation-process.html
// Compares user answers to data-required attributes and shows Success/Fail modals
// ==========================================================================
function checkEligibility() {
    document.getElementById('loading-overlay').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading-overlay').style.display = 'none';
        const rows = document.querySelectorAll('.q-row');
        let failedQuestion = null;

        for (let row of rows) {
            if (row.getAttribute('data-user-choice') !== row.getAttribute('data-required')) {
                failedQuestion = row.querySelector('p').innerText.split('. ')[1];
                break;
            }
        }

        if (failedQuestion) {
            document.getElementById('failure-reason').innerText = failedQuestion;
            document.getElementById('ineligible-modal').style.display = 'flex';
        } else {
            document.getElementById('eligible-modal').style.display = 'flex';
        }
    }, 2000); 
}

// ==========================================================================
// STEP TRANSITION LOGIC
// Primary file: donation-process.html
// Manages the single-page transition from Self-Assessment to Physical Screening
// ==========================================================================
function changeStep(step) {
    const assessmentSection = document.getElementById('section-assessment');
    const screeningSection = document.getElementById('section-screening');
    
    // Nodes and Lines for Stepper UI updates
    const step2Node = document.getElementById('step-2-node');
    const line1 = document.getElementById('line-1');
    const eligibleModal = document.getElementById('eligible-modal');

    if (step === 2) {
        // Transition to Physical Screening layout
        if (eligibleModal) eligibleModal.style.display = 'none';
        assessmentSection.style.display = 'none';
        screeningSection.style.display = 'block';

        // Update Stepper nodes and lines to Mapúa Red
        step2Node.classList.add('active');
        line1.style.backgroundColor = 'var(--primary-red)';
        
        window.scrollTo(0, 0);
    } else if (step === 1) {
        // Return to Self-Assessment layout
        screeningSection.style.display = 'none';
        assessmentSection.style.display = 'block';
        
        // Revert Stepper UI back to neutral
        step2Node.classList.remove('active');
        line1.style.backgroundColor = '#e2e8f0';
        
        window.scrollTo(0, 0);
    }
}