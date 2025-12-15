/* ==========================================
   MUHAMMAD NOMAN - CHATBOT WEBSITE
   JavaScript - Interactivity & Chatbot
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initScrollAnimations();
    initFAQ();
    initContactForm();
    initChatbot();
    initMobileMenu();
    initScrollToTop();
    initKeyboardShortcuts();
});

/* === Navbar Scroll Effect === */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const promoBanner = document.querySelector('.promo-banner');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show promo banner based on scroll
        if (promoBanner) {
            if (window.scrollY > 100) {
                promoBanner.classList.add('hidden');
            } else {
                promoBanner.classList.remove('hidden');
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open (handled by initMobileMenu, but ensure fallback)
                const navLinks = document.querySelector('.nav-links');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.classList.remove('active');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// ... scroll animations ...
/* === Scroll Animations === */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* === FAQ Accordion === */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* === Contact Form === */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        // Set Formspree endpoint
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mpwvewgz';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const formData = new FormData(form);

            // Show loading state
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Helper to handle success UI
            const showSuccess = () => {
                submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                form.reset();
                showFormNotification('Message sent successfully!', 'success');

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            };

            // Helper to handle error UI
            const showError = (msg) => {
                submitBtn.innerHTML = '<span>Error! Try Again</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                showFormNotification(msg, 'error');

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            };

            // Real submission attempt
            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showSuccess();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        throw new Error(data.errors.map(error => error.message).join(", "));
                    } else {
                        throw new Error('Form submission failed');
                    }
                }
            } catch (error) {
                console.error('Form Error:', error);

                showError('Oops! Sending failed. Please check your internet or try again later.');
            }
        });
    }
}

/* === Form Notification Helper === */
function showFormNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        max-width: 350px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        border-radius: 12px;
        color: white;
        font-size: 0.95rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
    `;
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => notification.remove(), 5000);
}

/* === Mobile Menu === */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileMenuBtn && navLinks) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on window resize (if going to desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });

        function toggleMenu() {
            const isOpen = navLinks.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        function openMenu() {
            navLinks.classList.add('active');
            mobileMenuBtn.classList.add('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            body.style.overflow = 'hidden'; // Prevent body scroll
        }

        function closeMenu() {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            body.style.overflow = ''; // Restore body scroll
        }
    }
}

/* === Chatbot Widget === */
function initChatbot() {
    const widget = document.getElementById('chatbotWidget');
    const toggle = document.getElementById('chatbotToggle');
    const messagesContainer = document.getElementById('chatbotMessages');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatInput');
    const notificationSound = document.getElementById('chatNotificationSound');
    const promoBadge = document.getElementById('promoBadge');

    // Safety check - if chatbot elements don't exist, exit early
    if (!widget || !toggle || !messagesContainer || !form || !input) {
        console.warn('Chatbot: Required DOM elements not found, skipping initialization');
        return;
    }

    // Handle Promo Badge Click
    if (promoBadge) {
        promoBadge.addEventListener('click', () => {
            // Open chatbot if not already open
            if (!widget.classList.contains('open')) {
                toggle.click(); // Use the existing toggle button click handler
            }
            // Focus on input field
            setTimeout(() => {
                input.focus();
            }, 300);
        });
    }

    // ========== LOCAL STORAGE KEYS ==========
    const STORAGE_KEY = 'noman_chatbot_history';
    const CONTEXT_KEY = 'noman_chatbot_context';

    // ========== CONVERSATION CONTEXT ==========
    let context = loadContext() || {
        userName: null,
        lastTopic: null,
        topicsDiscussed: [],
        messageCount: 0,
        interests: [],
        projectType: null
    };

    // ========== STORAGE SETTINGS ==========
    const EXPIRE_DAYS = 7; // Chat history expires after 7 days
    const TIMESTAMP_KEY = 'noman_chatbot_timestamp';

    // ========== LOAD/SAVE FUNCTIONS ==========
    function isExpired() {
        try {
            const timestamp = localStorage.getItem(TIMESTAMP_KEY);
            if (!timestamp) return false;

            const savedTime = new Date(timestamp).getTime();
            const now = new Date().getTime();
            const daysDiff = (now - savedTime) / (1000 * 60 * 60 * 24);

            return daysDiff >= EXPIRE_DAYS;
        } catch (e) {
            return false;
        }
    }

    function loadChatHistory() {
        try {
            // Check if chat history has expired
            if (isExpired()) {
                clearChatHistory();
                return false;
            }

            const history = localStorage.getItem(STORAGE_KEY);
            if (history) {
                const messages = JSON.parse(history);
                // Clear default messages
                messagesContainer.innerHTML = '';
                // Restore messages
                messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${msg.type}`;
                    messageDiv.innerHTML = `
                        <div class="message-content">
                            <p>${msg.content}</p>
                        </div>
                    `;
                    messagesContainer.appendChild(messageDiv);
                });
                return true;
            }
        } catch (e) {
            console.warn('Could not load chat history:', e);
        }
        return false;
    }

    function saveChatHistory() {
        try {
            const messages = [];
            messagesContainer.querySelectorAll('.message').forEach(msg => {
                const content = msg.querySelector('.message-content p');
                if (content && !msg.classList.contains('typing-indicator')) {
                    messages.push({
                        type: msg.classList.contains('user') ? 'user' : 'bot',
                        content: content.innerHTML
                    });
                }
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
            // Save timestamp for expiry check
            if (!localStorage.getItem(TIMESTAMP_KEY)) {
                localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
            }
        } catch (e) {
            console.warn('Could not save chat history:', e);
        }
    }

    function clearChatHistory() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(CONTEXT_KEY);
            localStorage.removeItem(TIMESTAMP_KEY);

            // Reset to default welcome message
            messagesContainer.innerHTML = `
                <div class="message bot">
                    <div class="message-content">
                        <p>Hi there! 👋 I'm Noman's AI assistant. How can I help you today?</p>
                    </div>
                </div>
                <div class="quick-replies">
                    <button class="quick-reply" data-reply="services">What services do you offer?</button>
                    <button class="quick-reply" data-reply="pricing">Tell me about pricing</button>
                    <button class="quick-reply" data-reply="contact">I want to start a project</button>
                </div>
            `;

            // Reset context
            context = {
                userName: null,
                lastTopic: null,
                topicsDiscussed: [],
                messageCount: 0,
                interests: [],
                projectType: null
            };

            // Re-attach quick reply handlers
            attachQuickReplyHandlers();

        } catch (e) {
            console.warn('Could not clear chat history:', e);
        }
    }

    function loadContext() {
        try {
            if (isExpired()) return null;
            const ctx = localStorage.getItem(CONTEXT_KEY);
            return ctx ? JSON.parse(ctx) : null;
        } catch (e) {
            return null;
        }
    }

    function saveContext() {
        try {
            localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
        } catch (e) {
            console.warn('Could not save context:', e);
        }
    }

    // ========== ADD CLEAR CHAT BUTTON ==========
    function addClearChatButton() {
        const header = document.querySelector('.chatbot-header');
        if (header && !header.querySelector('.clear-chat-btn')) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'clear-chat-btn';
            clearBtn.innerHTML = '🗑️';
            clearBtn.title = 'Clear chat history';
            clearBtn.style.cssText = `
                position: absolute;
                top: 50%;
                right: 16px;
                transform: translateY(-50%);
                background: none;
                border: none;
                font-size: 1.1rem;
                cursor: pointer;
                opacity: 0.5;
                transition: opacity 0.2s;
                padding: 4px;
            `;
            clearBtn.addEventListener('mouseenter', () => clearBtn.style.opacity = '1');
            clearBtn.addEventListener('mouseleave', () => clearBtn.style.opacity = '0.5');
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Clear chat history? This cannot be undone.')) {
                    clearChatHistory();
                }
            });
            header.style.position = 'relative';
            header.appendChild(clearBtn);
        }
    }

    // Add clear button to chat header
    addClearChatButton();

    // ========== PLAY NOTIFICATION SOUND ==========
    function playNotificationSound() {
        if (notificationSound) {
            try {
                notificationSound.currentTime = 0;
                notificationSound.volume = 0.3;
                notificationSound.play().catch(() => {
                    // Ignore autoplay restrictions
                });
            } catch (e) {
                // Ignore sound errors
            }
        }
    }

    // Load existing chat history on init
    const hasHistory = loadChatHistory();
    if (hasHistory) {
        context.messageCount = messagesContainer.querySelectorAll('.message.user').length;
    }

    // Function to attach quick reply handlers (used after clearing chat)
    function attachQuickReplyHandlers() {
        document.querySelectorAll('.quick-reply').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.textContent;
                handleUserMessage(text);
                processUserMessage(text);

                const quickReplies = document.querySelector('.quick-replies');
                if (quickReplies) {
                    quickReplies.style.opacity = '0';
                    setTimeout(() => quickReplies.remove(), 300);
                }
            });
        });
    }


    // ========== RICH KNOWLEDGE BASE (25+ Categories) ==========
    const knowledgeBase = {
        // === CORE SERVICES ===
        services: {
            keywords: ['service', 'offer', 'provide', 'what do you', 'what can you', 'capabilities', 'specialize'],
            response: `I specialize in building intelligent chatbots that transform businesses! 🚀

🌐 **Website Chatbots** - 24/7 customer engagement, FAQs, lead capture
📱 **WhatsApp & Messenger Bots** - Business automation, bookings, support  
🤖 **AI-Powered Assistants** - GPT-4/Claude powered smart conversations
🛒 **E-Commerce Bots** - Product recommendations, order tracking
🏥 **Industry-Specific Bots** - Healthcare, Real Estate, Restaurants
🔗 **Custom Integrations** - CRM, databases, payment systems, APIs`,
            quickReplies: ['💰 View Pricing', '⏱️ Timeline', '📂 See Portfolio', '💬 Start Project']
        },

        pricing: {
            keywords: ['price', 'cost', 'pricing', 'how much', 'rate', 'charge', 'fee', 'budget', 'affordable', 'cheap', 'expensive', 'money', 'pay', 'payment', 'pricng', 'prcing'],
            response: `Great question! Here's my transparent pricing:

💼 **Starter Package** - $39
• Basic FAQ chatbot (up to 20 responses)
• Website integration
• 7 days email support

⭐ **Professional Package** - $89 (Most Popular!)
• Advanced AI-powered bot
• WhatsApp + Website integration
• Up to 100 smart responses
• CRM integration
• 14 days priority support

🏢 **Enterprise** - Custom Quote
• Unlimited capabilities
• Multi-platform deployment
• Custom AI training
• Ongoing dedicated support

💡 All prices are **one-time payments** - no monthly fees!`,
            quickReplies: ['📱 WhatsApp Bot Details', '🔧 Custom Solution', '📞 Get Free Quote', '⏱️ Delivery Time']
        },

        contact: {
            keywords: ['contact', 'email', 'reach', 'hire', 'work with', 'get in touch', 'connect', 'call', 'phone', 'message'],
            response: `I'd love to discuss your project! Here's how to reach me: 📬

📧 **Email**: nomijoiya84@gmail.com
💬 **WhatsApp**: +92 310 2824072 (Fastest response!)
📝 **Contact Form**: Scroll down to fill out the form

⏰ **Response Time**: Usually within 2-4 hours
🌍 **Available**: Worldwide clients welcome!

What type of chatbot are you looking to build?`,
            quickReplies: ['🛒 E-commerce Bot', '🏥 Healthcare Bot', '🏠 Real Estate Bot', '📱 WhatsApp Bot']
        },

        timeline: {
            keywords: ['time', 'long', 'days', 'week', 'deadline', 'duration', 'fast', 'quick', 'urgent', 'asap', 'deliver', 'when', 'ready', 'complete', 'finish'],
            response: `Here's my typical delivery timeline:

⚡ **Basic FAQ Bot**: 1-3 days
🔧 **AI-Powered Bot**: 1-2 weeks  
🏗️ **Enterprise Solution**: 2+ weeks

**Timeline includes:**
✅ Initial consultation
✅ Design & development
✅ Testing & refinement
✅ Deployment & training

🚀 **Rush delivery available** for urgent projects!

Need something faster? Let me know your deadline!`,
            quickReplies: ['🚀 Rush Delivery', '💰 Pricing Info', '📞 Book Consultation', '🔧 Custom Timeline']
        },

        technologies: {
            keywords: ['technolog', 'gpt', 'ai', 'platform', 'integration', 'tool', 'stack', 'claude', 'gemini', 'openai', 'machine learning', 'nlp', 'artificial'],
            response: `I use cutting-edge AI technology! 🧠

**AI Models:**
• OpenAI GPT-4 & GPT-4o
• Anthropic Claude
• Google Gemini
• Custom fine-tuned models

**Platforms I Build For:**
• 🌐 Websites (React, Next.js, WordPress)
• 📱 WhatsApp Business API
• 💬 Facebook Messenger
• 📲 Telegram
• 💼 Slack & Microsoft Teams

**Integrations:**
• Shopify, WooCommerce, WordPress
• Firebase, MongoDB, PostgreSQL
• Zapier, Make, custom APIs
• Payment gateways (Stripe, PayPal)`,
            quickReplies: ['📱 WhatsApp Bot', '🛒 E-commerce Bot', '🔧 Custom Integration', '💰 Pricing']
        },

        portfolio: {
            keywords: ['portfolio', 'project', 'example', 'work', 'built', 'client', 'case study', 'previous', 'past', 'show', 'done', 'completed'],
            response: `Here are some of my successful projects! 🏆

🛒 **ShopEase E-Commerce Bot**
• Handles 1,000+ queries daily
• 95% issue resolution rate
• 40% increase in sales

🏥 **MediBook Healthcare**
• 500+ appointment bookings daily
• Automated prescription reminders
• Multi-language support

🏠 **PropertyPro Real Estate**
• AI-powered property search
• Virtual tour scheduling
• Lead qualification

📦 **TrackIt Logistics**
• Real-time order tracking
• Automated delivery updates
• Customer satisfaction: 4.9/5

Scroll down to see the full portfolio!`,
            quickReplies: ['💰 Get Similar Bot', '📞 Discuss My Project', '🔧 Custom Solution', '⏱️ Timeline']
        },

        whatsapp: {
            keywords: ['whatsapp', 'wa', 'messaging', 'watsap', 'whats app', 'business api', 'green app'],
            response: `WhatsApp bots are incredibly popular! Here's what I can build: 📱

**Features:**
✅ Automated customer support 24/7
✅ Appointment & booking management
✅ Order status & tracking
✅ Product catalog with images
✅ Payment integration
✅ Lead capture & qualification
✅ Multi-agent support
✅ Broadcast messaging

**Industries:**
🏥 Clinics & Healthcare
🍕 Restaurants & Food Delivery
🛒 E-commerce & Retail
🏠 Real Estate
🎓 Education & Training

Included in **Professional Package** ($89)!`,
            quickReplies: ['💰 WhatsApp Bot Pricing', '🔧 Custom Features', '📞 Get Started', '⏱️ Delivery Time']
        },

        support: {
            keywords: ['support', 'help', 'maintenance', 'after', 'issue', 'fix', 'bug', 'problem', 'update', 'warranty', 'guarantee'],
            response: `I provide comprehensive support! 🛡️

**Included Support:**
📦 Starter ($39): 7 days email support
⭐ Professional ($89): 14 days priority support  
🏢 Enterprise: Ongoing dedicated support

**What's Covered:**
✅ Bug fixes & troubleshooting
✅ Minor content updates
✅ Performance optimization
✅ Platform updates handling

**After Support Period:**
• Affordable maintenance packages
• Pay-per-fix options available
• Priority support extensions

All issues within the support period are fixed **100% free**!`,
            quickReplies: ['💰 Pricing Details', '📞 Contact Me', '🔧 Maintenance Plans', '📂 See Portfolio']
        },

        // === INDUSTRY-SPECIFIC BOTS ===
        ecommerce: {
            keywords: ['ecommerce', 'e-commerce', 'online store', 'shop', 'shopify', 'woocommerce', 'products', 'cart', 'order', 'sell', 'retail', 'store'],
            response: `E-commerce chatbots are my specialty! 🛒

**What I Build:**
🛍️ Product recommendation engine
🔍 Smart product search
📦 Order tracking & status
💳 Checkout assistance
❓ FAQ & customer support
📊 Abandoned cart recovery
⭐ Review collection

**Platforms:**
• Shopify integration
• WooCommerce/WordPress
• Custom solutions

**Results for Clients:**
• 40% increase in conversions
• 60% reduction in support tickets
• 24/7 automated assistance`,
            quickReplies: ['💰 E-commerce Bot Price', '📂 See Case Study', '📞 Discuss Project', '⏱️ Timeline']
        },

        healthcare: {
            keywords: ['healthcare', 'medical', 'doctor', 'clinic', 'hospital', 'patient', 'appointment', 'health', 'medicine', 'dental', 'pharmacy'],
            response: `Healthcare chatbots can transform patient experience! 🏥

**Features I Build:**
📅 Appointment scheduling
💊 Prescription reminders
🩺 Symptom pre-screening
📋 Patient intake forms
❓ Medical FAQ support
📱 Telehealth integration
🔒 HIPAA-compliant options

**Benefits:**
• Reduce no-shows by 35%
• 24/7 patient engagement
• Free up staff time
• Improve patient satisfaction

I've built bots handling 500+ bookings daily!`,
            quickReplies: ['💰 Healthcare Bot Pricing', '📂 See Medical Case Study', '📞 Discuss Project', '🔒 HIPAA Compliance']
        },

        realestate: {
            keywords: ['real estate', 'property', 'home', 'house', 'apartment', 'rent', 'buy', 'listing', 'agent', 'broker', 'realtor'],
            response: `Real estate chatbots are game-changers! 🏠

**Features I Build:**
🏘️ Property search & filtering
📅 Virtual tour scheduling
💰 Mortgage calculator
📋 Lead qualification
📍 Location-based search
📧 Automated follow-ups
🔔 New listing alerts

**Benefits:**
• Qualify leads 24/7
• Instant property recommendations
• Reduce response time from hours to seconds
• Capture leads even at 3 AM!

Perfect for agents, brokers & developers!`,
            quickReplies: ['💰 Real Estate Bot Price', '📂 See Case Study', '📞 Discuss Project', '🔧 Custom Features']
        },

        restaurant: {
            keywords: ['restaurant', 'food', 'menu', 'order', 'delivery', 'cafe', 'reservation', 'table', 'booking', 'dine', 'eat'],
            response: `Restaurant chatbots boost orders & bookings! 🍕

**Features I Build:**
📋 Digital menu with images
🛵 Food ordering system
📅 Table reservations
⏰ Operating hours info
🎉 Special offers & promos
⭐ Review collection
💬 Customer feedback

**Platforms:**
• Website ordering
• WhatsApp ordering
• Facebook Messenger

**Results:**
• 30% increase in online orders
• Zero missed reservations
• Improved customer experience`,
            quickReplies: ['💰 Restaurant Bot Price', '📱 WhatsApp Ordering', '📞 Discuss Project', '⏱️ Timeline']
        },

        // === COMPARISON & VALUE ===
        whychoose: {
            keywords: ['why', 'choose', 'different', 'better', 'compare', 'versus', 'vs', 'advantage', 'benefit', 'unique', 'special'],
            response: `Great question! Here's why clients choose me: ⭐

**What Sets Me Apart:**
🎯 **Personalized Approach** - No cookie-cutter solutions
💰 **Affordable Pricing** - Starting at just $39  
🚀 **Fast Delivery** - Basic bots in 1-3 days
🤖 **Latest AI Tech** - GPT-4, Claude, Gemini
📱 **Multi-Platform** - Website, WhatsApp, Messenger
🛠️ **Full Support** - I don't disappear after delivery

**My Promise:**
✅ 100% satisfaction or free revisions
✅ Transparent pricing, no hidden fees
✅ Direct communication (no middlemen)
✅ Post-launch support included

Ready to experience the difference?`,
            quickReplies: ['💰 View Pricing', '📂 See Portfolio', '📞 Let\'s Talk', '⏱️ Timeline']
        },

        experience: {
            keywords: ['experience', 'background', 'qualification', 'skill', 'about', 'who', 'yourself', 'noman', 'developer', 'expert'],
            response: `Let me tell you about Muhammad Noman! 👨‍💻

**Background:**
🎓 AI & Chatbot Specialist
💼 50+ successful projects delivered
🌍 Clients from 10+ countries
⭐ 4.9/5 average client rating

**Expertise:**
• AI/ML & Natural Language Processing
• Full-stack development
• Business process automation
• Customer experience optimization

**Philosophy:**
"I don't just build chatbots - I create conversation experiences that drive real business results."

Available for projects worldwide! 🌐`,
            quickReplies: ['📂 See Portfolio', '💰 Pricing', '📞 Contact Me', '🔧 Custom Project']
        },

        // === PAYMENT & PROCESS ===
        payment: {
            keywords: ['payment', 'pay', 'method', 'bank', 'transfer', 'paypal', 'stripe', 'credit card', 'installment', 'milestone'],
            response: `I offer flexible payment options! 💳

**Payment Methods:**
💵 PayPal
🏦 Bank Transfer
💳 Wise/TransferWise
📱 JazzCash/Easypaisa (Pakistan)

**Payment Structure:**
• Small projects: 100% upfront
• Medium projects: 50% upfront, 50% on completion
• Enterprise: Milestone-based payments

**Guarantees:**
✅ Invoice provided for all payments
✅ Money-back if not satisfied with initial design
✅ Revisions until you're happy

No hidden fees - what I quote is what you pay!`,
            quickReplies: ['💰 Get Quote', '📞 Discuss Payment', '🔧 Project Details', '⏱️ Timeline']
        },

        process: {
            keywords: ['process', 'how does', 'work with', 'step', 'procedure', 'start', 'begin', 'workflow', 'method'],
            response: `Here's how we'll work together! 🤝

**Step 1: Discovery** (Day 1)
📞 Free consultation call/chat
📋 Understand your requirements
💡 Propose solutions

**Step 2: Planning** (Day 2-3)
📐 Design conversation flow
🎨 Mockup approval
💰 Final quote

**Step 3: Development** (Day 4-10)
🔧 Build the chatbot
🧪 Internal testing
🔄 Your feedback & revisions

**Step 4: Launch** 
🚀 Deploy to your platform
📚 Training & documentation
🛡️ Support period begins

Ready to start? Let's chat! 💬`,
            quickReplies: ['📞 Book Free Consultation', '💰 Get Quote', '⏱️ Timeline', '📂 Portfolio']
        },

        revision: {
            keywords: ['revision', 'change', 'modify', 'update', 'edit', 'tweak', 'adjust', 'redo', 'unlimited'],
            response: `I want you to be 100% happy! Here's my revision policy: 🔄

**Included Revisions:**
📦 Starter: 2 revision rounds
⭐ Professional: 3 revision rounds
🏢 Enterprise: Unlimited revisions

**What's a Revision?**
• Changing response text
• Adjusting conversation flow
• Adding new Q&A pairs
• Design tweaks

**My Promise:**
I work closely with you until you're completely satisfied. Most clients need just 1-2 rounds!`,
            quickReplies: ['💰 Pricing Details', '📞 Contact Me', '🔧 Custom Project', '⏱️ Timeline']
        },

        consultation: {
            keywords: ['consult', 'free', 'call', 'meeting', 'discuss', 'talk', 'chat', 'book'],
            response: `Yes! I offer FREE consultations! 🎉

**What We'll Discuss:**
📋 Your business needs
🤖 Best chatbot solution
💰 Accurate pricing
⏱️ Realistic timeline

**How to Book:**
📧 Email: nomijoiya84@gmail.com
💬 WhatsApp: +92 310 2824072

Or just tell me about your project right here and I'll give you initial guidance!

No pressure, no obligation - just a friendly chat! 😊`,
            quickReplies: ['📱 WhatsApp Now', '📧 Email Me', '💬 Tell Me About Project', '💰 View Pricing']
        },

        // === GREETINGS & SMALL TALK ===
        greeting: {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'assalam', 'salam', 'aoa', 'greetings', 'howdy'],
            response: `Assalam u Alaikum! 👋 Welcome to Noman's Chatbot Services!

I'm an AI assistant here to help you learn about:
🤖 Custom chatbot solutions
💰 Affordable pricing (from $39!)
📱 WhatsApp & website bots
🚀 Fast delivery

What brings you here today?`,
            quickReplies: ['🔧 View Services', '💰 Pricing', '📂 Portfolio', '💬 Start Project']
        },

        thanks: {
            keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'thx', 'ty', 'cheers'],
            response: `You're very welcome! 😊

I'm glad I could help! If you have any more questions, just ask.

**Ready to get started?**
📧 Email: nomijoiya84@gmail.com
💬 WhatsApp: +92 310 2824072

Looking forward to building something amazing together! 🚀`,
            quickReplies: ['📞 Contact Noman', '💬 More Questions', '📂 View Portfolio', '🏠 Main Menu']
        },

        goodbye: {
            keywords: ['bye', 'goodbye', 'see you', 'later', 'good night', 'cya', 'bbye', 'take care'],
            response: `Goodbye! 👋 Thanks for chatting!

**Before you go:**
📱 Save this WhatsApp: +92 310 2824072
📧 Email: nomijoiya84@gmail.com

Feel free to return anytime - I'm always here to help!

Take care and have a great day! 🌟`,
            quickReplies: ['📱 WhatsApp Now', '📧 Email Me', '🏠 Main Menu']
        },

        positive: {
            keywords: ['great', 'awesome', 'perfect', 'excellent', 'amazing', 'wonderful', 'cool', 'nice', 'good', 'love', 'fantastic'],
            response: `I'm so happy to hear that! 🎉

Anything else you'd like to know about my chatbot services?

• 💰 Pricing starts at $39
• ⏱️ Fast 3-5 day delivery
• 📱 WhatsApp + Website bots
• 🛡️ Support included

Ready to start your project?`,
            quickReplies: ['📞 Start Project', '💰 View Pricing', '📂 See Portfolio', '💬 More Questions']
        },

        // === MISC & DEFAULT ===
        name: {
            keywords: ['my name', 'i am', 'im', 'i\'m', 'call me', 'name is'],
            response: `Nice to meet you! 😊

I'll remember that! How can I help you today?

Are you looking for a chatbot for your business? I'd love to learn more about your needs!`,
            quickReplies: ['🔧 View Services', '💰 Pricing', '📂 Portfolio', '💬 Start Project']
        },

        urgent: {
            keywords: ['urgent', 'asap', 'rush', 'emergency', 'hurry', 'quick', 'fast track', 'immediately'],
            response: `I understand you need this fast! ⚡

**Rush Delivery Available:**
🚀 Basic bot: 1-2 days
🔧 Advanced bot: 4-5 days
🏗️ Complex project: 1 week

**Rush fee:** 20-30% extra (depending on complexity)

Contact me NOW and we can discuss your timeline:
💬 WhatsApp: +92 310 2824072
📧 Email: nomijoiya84@gmail.com

I'll prioritize your project! 🎯`,
            quickReplies: ['📱 WhatsApp NOW', '📧 Email Urgently', '💰 Rush Pricing', '⏱️ Regular Timeline']
        },

        custom: {
            keywords: ['custom', 'specific', 'unique', 'special', 'tailor', 'bespoke', 'personalize'],
            response: `I love custom projects! 🎨

Every business is unique, and your chatbot should be too!

**Custom Solutions Include:**
• Unique conversation flows
• Brand voice & personality
• Custom integrations
• Industry-specific features
• Multilingual support

Tell me more about your specific requirements, and I'll create a tailored solution just for you!

What industry are you in?`,
            quickReplies: ['🛒 E-commerce', '🏥 Healthcare', '🏠 Real Estate', '🍕 Restaurant', '📞 Other']
        },

        language: {
            keywords: ['language', 'urdu', 'arabic', 'spanish', 'french', 'multilingual', 'translate', 'other language'],
            response: `Yes! I can build multilingual chatbots! 🌍

**Languages I've Built For:**
• 🇬🇧 English
• 🇵🇰 Urdu
• 🇸🇦 Arabic
• 🇪🇸 Spanish
• 🇫🇷 French
• And more!

**Features:**
• Auto language detection
• Seamless language switching
• Cultural nuances considered

Need a bot in multiple languages? No problem!`,
            quickReplies: ['💰 Multilingual Pricing', '📞 Discuss Languages', '🔧 Custom Solution', '📂 Portfolio']
        }
    };

    // ========== SMART INTENT RECOGNITION ==========
    function fuzzyMatch(text, keyword) {
        // Improved fuzzy matching - uses Levenshtein-inspired approach
        // Checks for substring matches with allowed typos
        const lowerText = text.toLowerCase();
        const lowerKeyword = keyword.toLowerCase();

        // If keyword is short (<=3 chars), require exact substring match
        if (lowerKeyword.length <= 3) {
            return lowerText.includes(lowerKeyword);
        }

        // For longer keywords, allow 1-2 character differences
        const allowedErrors = Math.floor(lowerKeyword.length / 4); // 1 error per 4 chars

        // Check each position in text for fuzzy substring match
        for (let i = 0; i <= lowerText.length - lowerKeyword.length + allowedErrors; i++) {
            let errors = 0;
            let matched = 0;
            let j = 0; // keyword index
            let k = i; // text index

            while (j < lowerKeyword.length && k < lowerText.length && errors <= allowedErrors) {
                if (lowerText[k] === lowerKeyword[j]) {
                    matched++;
                    j++;
                    k++;
                } else {
                    errors++;
                    k++;
                    // Try skipping a character in text (insertion typo)
                    if (errors <= allowedErrors && k < lowerText.length && lowerText[k] === lowerKeyword[j]) {
                        continue;
                    }
                    j++;
                }
            }

            // If we matched most of the keyword with few errors
            if (matched >= lowerKeyword.length - allowedErrors && errors <= allowedErrors) {
                return true;
            }
        }

        return false;
    }

    function findBestMatch(message) {
        const lowerMessage = message.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;

        for (let [key, data] of Object.entries(knowledgeBase)) {
            let score = 0;

            for (let keyword of data.keywords) {
                // Exact match (highest weight)
                if (lowerMessage.includes(keyword)) {
                    score += 10;
                }
                // Fuzzy match (lower weight)
                else if (fuzzyMatch(lowerMessage, keyword)) {
                    score += 5;
                }
            }

            // Context bonus - if user asks about something related to last topic
            if (context.lastTopic === key) {
                score += 3;
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = key;
            }
        }

        return highestScore >= 5 ? bestMatch : null;
    }

    // ========== EXTRACT USER NAME ==========
    function extractName(message) {
        const patterns = [
            /my name is (\w+)/i,
            /i am (\w+)/i,
            /i'm (\w+)/i,
            /call me (\w+)/i,
            /this is (\w+)/i
        ];

        for (let pattern of patterns) {
            const match = message.match(pattern);
            if (match) {
                return match[1].charAt(0).toUpperCase() + match[1].slice(1);
            }
        }
        return null;
    }

    // ========== ADD QUICK REPLIES ==========
    function addQuickReplies(replies) {
        // Remove existing quick replies
        const existingReplies = messagesContainer.querySelector('.dynamic-quick-replies');
        if (existingReplies) {
            existingReplies.remove();
        }

        const repliesDiv = document.createElement('div');
        repliesDiv.className = 'dynamic-quick-replies';
        repliesDiv.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; padding: 0 4px;';

        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply dynamic';
            btn.textContent = reply;
            btn.style.cssText = 'padding: 8px 14px; background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(16, 185, 129, 0.1)); border: 1px solid rgba(20, 184, 166, 0.3); border-radius: 20px; color: #14b8a6; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;';

            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'linear-gradient(135deg, #14b8a6, #10b981)';
                btn.style.color = 'white';
                btn.style.transform = 'translateY(-2px)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(16, 185, 129, 0.1))';
                btn.style.color = '#14b8a6';
                btn.style.transform = 'translateY(0)';
            });

            btn.addEventListener('click', () => {
                handleUserMessage(reply);
                processUserMessage(reply);
                // Remove quick replies after click
                repliesDiv.style.opacity = '0';
                setTimeout(() => repliesDiv.remove(), 300);
            });

            repliesDiv.appendChild(btn);
        });

        messagesContainer.appendChild(repliesDiv);
        scrollToBottom();
    }

    // ========== TOGGLE CHATBOT WITH HISTORY ==========
    const handleToggle = () => {
        const isOpen = widget.classList.contains('open');

        if (isOpen) {
            // If dragging history or simple open, check state
            if (history.state && history.state.chatbotOpen) {
                history.back();
            } else {
                widget.classList.remove('open');
            }
        } else {
            history.pushState({ chatbotOpen: true }, '', '');
            widget.classList.add('open');
            input.focus();

            // Show welcome message quick replies if first time
            if (context.messageCount === 0) {
                setTimeout(() => {
                    addQuickReplies(['🔧 View Services', '💰 Pricing', '📂 Portfolio', '💬 Start Project']);
                }, 500);
            }
        }
    };

    toggle.addEventListener('click', handleToggle);

    // Initial check for open state
    if (history.state && history.state.chatbotOpen) {
        widget.classList.add('open');
    }

    // Handle browser back button
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.chatbotOpen) {
            widget.classList.add('open');
            input.focus();
        } else {
            widget.classList.remove('open');
        }
    });

    // ========== HANDLE INITIAL QUICK REPLIES ==========
    document.querySelectorAll('.quick-reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent;
            handleUserMessage(text);
            processUserMessage(text);

            const quickReplies = document.querySelector('.quick-replies');
            if (quickReplies) {
                quickReplies.style.opacity = '0';
                setTimeout(() => quickReplies.remove(), 300);
            }
        });
    });

    // ========== FORM SUBMISSION ==========
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = input.value.trim();

        if (message) {
            handleUserMessage(message);
            processUserMessage(message);
            input.value = '';
        }
    });

    // ========== DISPLAY USER MESSAGE ==========
    function handleUserMessage(message) {
        // Remove any existing quick replies
        const existingReplies = messagesContainer.querySelector('.dynamic-quick-replies');
        if (existingReplies) {
            existingReplies.style.opacity = '0';
            setTimeout(() => existingReplies.remove(), 200);
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHtml(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        context.messageCount++;

        // Save chat history after user message
        saveChatHistory();
    }

    // ========== PROCESS USER MESSAGE ==========
    function processUserMessage(message) {
        // Check for name
        const extractedName = extractName(message);
        if (extractedName) {
            context.userName = extractedName;
        }

        // Find best matching response
        const matchedTopic = findBestMatch(message);

        if (matchedTopic) {
            context.lastTopic = matchedTopic;
            if (!context.topicsDiscussed.includes(matchedTopic)) {
                context.topicsDiscussed.push(matchedTopic);
            }
            respondWithTopic(matchedTopic);
        } else {
            // Default response
            respondWithDefault();
        }
    }

    // ========== RESPOND WITH MATCHED TOPIC ==========
    function respondWithTopic(topic) {
        const data = knowledgeBase[topic];
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();

            let response = data.response;

            // Personalize with name if available - only replace greeting-style exclamations
            if (context.userName && Math.random() > 0.5) {
                // Match patterns like "Hello!", "Welcome!", "Hi!" etc. at the start
                const greetingPattern = /^([^!]+)(!)(?=\s|\n|$)/;
                if (greetingPattern.test(response)) {
                    response = response.replace(greetingPattern, `$1, ${context.userName}$2`);
                }
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${formatMessage(response)}</p>
                </div>
            `;
            messagesContainer.appendChild(messageDiv);
            scrollToBottom();

            // Play notification sound and save chat
            playNotificationSound();
            saveChatHistory();
            saveContext();

            // Add contextual quick replies
            if (data.quickReplies) {
                setTimeout(() => {
                    addQuickReplies(data.quickReplies);
                }, 300);
            }
        }, 800 + Math.random() * 600);
    }

    // ========== DEFAULT RESPONSE ==========
    function respondWithDefault() {
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();

            const defaultResponses = [
                `I'm not quite sure I understand, but I'm here to help! ${context.userName ? context.userName + ', ' : ''}Let me guide you:

🔧 **Services** - What chatbot solutions I offer
💰 **Pricing** - Affordable packages starting at $39
📱 **WhatsApp Bots** - Automate your business messaging
📂 **Portfolio** - See my successful projects

What would you like to know more about?`,

                `Hmm, could you tell me more about what you're looking for? ${context.userName ? 'Hi ' + context.userName + ', ' : ''}I can help with:

• Building custom chatbots 🤖
• WhatsApp business automation 📱
• E-commerce & healthcare bots 🛒🏥
• Pricing & project timelines 💰⏱️

Just ask about any of these!`,

                `I want to make sure I help you correctly! ${context.userName ? context.userName + ', ' : ''}Try asking me about:

🤖 "What services do you offer?"
💰 "How much does a chatbot cost?"
📱 "Tell me about WhatsApp bots"
⏱️ "How long does it take?"

Or tell me about your project idea! 💡`
            ];

            const response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${formatMessage(response)}</p>
                </div>
            `;
            messagesContainer.appendChild(messageDiv);
            scrollToBottom();

            // Play notification sound and save chat
            playNotificationSound();
            saveChatHistory();
            saveContext();

            // Add helpful quick replies
            setTimeout(() => {
                addQuickReplies(['🔧 Services', '💰 Pricing', '📱 WhatsApp Bot', '📞 Contact']);
            }, 300);
        }, 800 + Math.random() * 400);
    }

    // ========== HELPER FUNCTIONS ==========
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content" style="padding: 12px 20px;">
                <div class="typing-animation">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatMessage(text) {
        // Convert **text** to bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Convert newlines to <br>
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    // ========== ADD TYPING ANIMATION STYLES ==========
    const chatbotStyles = document.createElement('style');
    chatbotStyles.textContent = `
        .typing-animation {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .typing-animation .dot {
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #14b8a6, #10b981);
            border-radius: 50%;
            animation: typingBounce 1.4s infinite ease-in-out;
        }
        
        .typing-animation .dot:nth-child(1) { animation-delay: 0s; }
        .typing-animation .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-animation .dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typingBounce {
            0%, 60%, 100% { 
                transform: translateY(0);
                opacity: 0.4;
            }
            30% { 
                transform: translateY(-8px);
                opacity: 1;
            }
        }
        
        .dynamic-quick-replies {
            animation: fadeInUp 0.3s ease;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(chatbotStyles);
}

/* === Typing Animation for Hero === */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.style.opacity = '1';
}

/* === Add some sparkle effects === */
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        animation: sparkle 0.5s ease-out forwards;
        z-index: 9999;
    `;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 500);
}

// Add sparkle animation to buttons on click
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 60;
                const offsetY = (Math.random() - 0.5) * 60;
                createSparkle(e.clientX + offsetX, e.clientY + offsetY);
            }, i * 50);
        }
    });
});

// Add sparkle keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
    
    .typing-dots {
        animation: typing 1s infinite;
        display: inline-block;
    }
    
    @keyframes typing {
        0%, 60%, 100% { opacity: 0.3; }
        30% { opacity: 1; }
    }
`;
document.head.appendChild(style);

/* === Parallax effect for hero background === */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroBg = document.querySelector('.hero-bg-animation');
    if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

/* === Scroll to Top Button === */
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (!scrollToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* === Keyboard Shortcuts === */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+K or Cmd+K to toggle chatbot
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const toggle = document.getElementById('chatbotToggle');
            if (toggle) {
                toggle.click(); // Use the existing click handler which manages history
            }
        }

        // Escape to close chatbot
        if (e.key === 'Escape') {
            const widget = document.getElementById('chatbotWidget');
            if (widget && widget.classList.contains('open')) {
                if (history.state && history.state.chatbotOpen) {
                    history.back();
                } else {
                    widget.classList.remove('open');
                }
            }
        }
    });
}

/* === Additional Animation Styles === */
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Clear chat button for development */
    .clear-chat-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.8rem;
        opacity: 0.5;
        transition: opacity 0.2s;
    }
    
    .clear-chat-btn:hover {
        opacity: 1;
    }
`;
document.head.appendChild(additionalStyles);

console.log('🤖 Muhammad Noman Chatbot Website - Loaded Successfully!');
console.log('💡 Tip: Press Ctrl+K to toggle the chatbot!');
