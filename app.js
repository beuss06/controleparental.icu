// app.js — ControleParental.icu
// Comportement : nav mobile, scroll navbar, FAQ, compteurs, mockup hero, démonstrateur console.

// ============================================================================
// PRODUCT_CAPABILITIES — source unique de vérité pour les promesses marketing.
// Toute valeur affichée dans la landing (chiffres, plateformes, sources de
// listes) doit venir d'ici plutôt que d'un littéral en dur dans le HTML.
// Les éléments avec l'attribut data-cp-capability="<clé>" sont hydratés ci-bas.
// ============================================================================
window.PRODUCT_CAPABILITIES = Object.freeze({
    // Nombre approximatif de domaines couverts par la combinaison des listes
    // communautaires que l'agent peut activer. Variable, à actualiser quand
    // les listes upstream évoluent significativement.
    filteredSitesCount: 430000,
    filteredSitesLabel: '430 000+',
    // Sources upstream — affichées telles quelles dans la carte de filtrage.
    blocklistSources: 'Block List Project · OISD · Hagezi',
    // Plateformes supportées par l'agent (côté enfant).
    agentPlatforms: 'Windows 10 et 11',
    // Plateformes supportées par l'espace parent (côté parents).
    consolePlatforms: 'Ordinateur, iPhone et Android',
});

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Hydratation des claims marketing
    // ==========================================
    // Remplit le contenu des éléments marqués data-cp-capability="<key>" à
    // partir de PRODUCT_CAPABILITIES. Évite de dupliquer les chiffres et
    // libellés dans le HTML.
    document.querySelectorAll('[data-cp-capability]').forEach(el => {
        const key = el.getAttribute('data-cp-capability');
        const value = window.PRODUCT_CAPABILITIES[key];
        if (value !== undefined && value !== null) {
            el.textContent = String(value);
        }
    });

    // ==========================================
    // 1. Mobile Menu Toggle
    // ==========================================
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const btnLine1 = document.getElementById('btn-line1');
    const btnLine2 = document.getElementById('btn-line2');
    const btnLine3 = document.getElementById('btn-line3');

    const setMobileMenuOpen = (open) => {
        if (!mobileMenu) return;
        if (open) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            btnLine1.style.transform = 'rotate(45deg) translate(5px, 5px)';
            btnLine2.style.opacity = '0';
            btnLine3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            btnLine1.style.transform = 'none';
            btnLine2.style.opacity = '1';
            btnLine3.style.transform = 'none';
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    };

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = mobileMenu.classList.contains('hidden');
            setMobileMenuOpen(isHidden);
        });

        // Close menu on navigation click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMobileMenuOpen(false));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                setMobileMenuOpen(false);
            }
        });
    }

    // ==========================================
    // 2. Header Effects on Scroll
    // ==========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        }
    });

    // ==========================================
    // 3. FAQ Accordion Toggle
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const t = otherItem.querySelector('.faq-trigger');
                        if (t) t.setAttribute('aria-expanded', 'false');
                        otherItem.querySelector('.faq-content').style.maxHeight = '0';
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // ==========================================
    // 4. Dynamic Stats Counter
    // ==========================================
    const statsNumbers = document.querySelectorAll('.stats-number');

    const startCounting = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetVal = parseInt(target.getAttribute('data-target'), 10);
                const prefix = target.getAttribute('data-prefix') || '';
                const suffix = target.getAttribute('data-suffix') || '';
                const fmt = (n) => prefix + Math.floor(n).toLocaleString('fr-FR') + suffix;

                // Respect reduced-motion
                if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    target.innerText = fmt(targetVal);
                    observer.unobserve(target);
                    return;
                }

                let currentVal = 0;
                const duration = 1500;
                const steps = 60;
                const increment = targetVal / steps;
                const stepTime = duration / steps;

                const timer = setInterval(() => {
                    currentVal += increment;
                    if (currentVal >= targetVal) {
                        target.innerText = fmt(targetVal);
                        clearInterval(timer);
                    } else {
                        target.innerText = fmt(currentVal);
                    }
                }, stepTime);

                observer.unobserve(target);
            }
        });
    };

    const countObserver = new IntersectionObserver(startCounting, { threshold: 0.5 });
    statsNumbers.forEach(num => countObserver.observe(num));

    // ==========================================
    // 5. Hero Mockup interactive controls
    // ==========================================
    const mockupScreenGame = document.getElementById('mockup-screen-game');
    const mockupScreenLocked = document.getElementById('mockup-screen-locked');
    const mockupIndicator = document.getElementById('mockup-indicator');
    const mockupIndicatorText = document.getElementById('mockup-indicator-text');
    const mockupStatusText = document.getElementById('mockup-status-text');
    const mockupActionLock = document.getElementById('mockup-action-lock');
    const mockupActionInput = document.getElementById('mockup-action-input');

    let isMockupLocked = false;
    let isMockupInputBlocked = false;

    const setMockupState = (locked) => {
        if (!mockupScreenGame || !mockupScreenLocked) return;
        isMockupLocked = locked;
        if (locked) {
            mockupScreenGame.classList.add('opacity-0');
            mockupScreenGame.classList.remove('opacity-100');
            mockupScreenLocked.classList.add('opacity-100');
            mockupScreenLocked.classList.remove('opacity-0');

            if (mockupIndicator) {
                mockupIndicator.className = 'inline-block w-2.5 h-2.5 rounded-full bg-[#48b7ff] animate-pulse';
            }
            if (mockupIndicatorText) {
                mockupIndicatorText.innerText = 'Appareil en pause';
                mockupIndicatorText.className = 'text-xs text-[#48b7ff] font-medium';
            }
            if (mockupStatusText) {
                mockupStatusText.innerText = 'Pause active';
                mockupStatusText.className = 'text-xs font-semibold text-[#48b7ff] mt-1';
            }
            if (mockupActionLock) {
                mockupActionLock.innerText = 'Réactiver';
                mockupActionLock.className = 'w-full py-2 bg-[#22d3c5] hover:brightness-110 text-xs font-semibold text-[#061426] rounded-lg transition-all cursor-pointer';
            }
        } else {
            mockupScreenGame.classList.add('opacity-100');
            mockupScreenGame.classList.remove('opacity-0');
            mockupScreenLocked.classList.add('opacity-0');
            mockupScreenLocked.classList.remove('opacity-100');

            if (mockupIndicator) {
                mockupIndicator.className = 'inline-block w-2.5 h-2.5 rounded-full bg-[#28d39a] animate-pulse';
            }
            if (mockupIndicatorText) {
                mockupIndicatorText.innerText = 'Protection active';
                mockupIndicatorText.className = 'text-xs text-[#28d39a] font-medium';
            }
            if (mockupStatusText) {
                mockupStatusText.innerText = 'Disponible';
                mockupStatusText.className = 'text-xs font-semibold text-[#aab7c9] mt-1';
            }
            if (mockupActionLock) {
                mockupActionLock.innerText = 'Mettre en pause';
                mockupActionLock.className = 'w-full py-2 bg-[#258bff] hover:brightness-110 text-xs font-semibold text-white rounded-lg transition-all cursor-pointer';
            }
        }
    };

    if (mockupActionLock) {
        mockupActionLock.addEventListener('click', () => {
            setMockupState(!isMockupLocked);
            addDemoLog(isMockupLocked ? 'lock' : 'unlock', isMockupLocked ? 'Pause famille' : '');
        });
    }

    if (mockupActionInput) {
        mockupActionInput.addEventListener('click', () => {
            isMockupInputBlocked = !isMockupInputBlocked;
            if (isMockupInputBlocked) {
                mockupActionInput.innerText = 'Réactiver les entrées';
                mockupActionInput.className = 'w-full py-2 bg-[#f59e0b] hover:brightness-110 text-xs font-semibold text-white rounded-lg transition-all cursor-pointer';
                addDemoLog('blockinput', 'true');
            } else {
                mockupActionInput.innerText = 'Suspendre les entrées';
                mockupActionInput.className = 'w-full py-2 bg-[#102641] hover:bg-[#48b7ff]/15 hover:text-[#48b7ff] text-xs font-semibold text-white rounded-lg transition-colors border border-[#48b7ff]/15 cursor-pointer';
                addDemoLog('blockinput', 'false');
            }
        });
    }

    // ==========================================
    // 6. Interactive Console Showcase Logs
    // ==========================================
    const demoButtons = document.querySelectorAll('.demo-btn');
    const demoLogsContainer = document.getElementById('demo-logs-container');
    const clearDemoLogs = document.getElementById('clear-demo-logs');

    const addDemoLog = (action, parameter = '') => {
        if (!demoLogsContainer) return;

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        const logs = [];

        switch (action.toLowerCase()) {
            case 'lock':
                logs.push(`<div class="text-[#aab7c9]">[${timeStr}] Action demandée : mise en pause — "${parameter || 'Pause demandée'}"</div>`);
                logs.push(`<div class="text-[#48b7ff]">[${timeStr}] L'appareil est mis en pause...</div>`);
                logs.push(`<div class="text-[#48b7ff] font-bold">[${timeStr}] Appareil en pause. Les entrées sont neutralisées.</div>`);
                setMockupState(true);
                break;
            case 'unlock':
                logs.push(`<div class="text-[#aab7c9]">[${timeStr}] Action demandée : réactivation</div>`);
                logs.push(`<div class="text-[#28d39a]">[${timeStr}] L'appareil reprend son fonctionnement normal.</div>`);
                logs.push(`<div class="text-[#28d39a] font-bold">[${timeStr}] Session réactivée. Bon usage.</div>`);
                setMockupState(false);
                break;
            case 'blockinput': {
                const blockVal = parameter === 'true';
                logs.push(`<div class="text-[#aab7c9]">[${timeStr}] Action : suspension des entrées (${parameter})</div>`);
                if (blockVal) {
                    logs.push(`<div class="text-[#f59e0b]">[${timeStr}] Clavier et souris suspendus.</div>`);
                } else {
                    logs.push(`<div class="text-[#28d39a]">[${timeStr}] Clavier et souris réactivés.</div>`);
                }
                break;
            }
            case 'screenpower':
                logs.push(`<div class="text-[#aab7c9]">[${timeStr}] Action : alimentation de l'écran (${parameter})</div>`);
                if (parameter === 'off') {
                    logs.push(`<div class="text-[#48b7ff]">[${timeStr}] Écran mis en veille.</div>`);
                } else {
                    logs.push(`<div class="text-[#28d39a]">[${timeStr}] Écran réactivé.</div>`);
                }
                break;
            case 'killprocess':
                logs.push(`<div class="text-[#aab7c9]">[${timeStr}] Action : fermeture d'une application (réf. ${parameter})</div>`);
                logs.push(`<div class="text-[#f59e0b]">[${timeStr}] Demande de fermeture transmise...</div>`);
                logs.push(`<div class="text-[#28d39a] font-semibold">[${timeStr}] Application fermée avec succès.</div>`);
                break;
            case 'setkeywords':
                logs.push(`<div class="text-[#aab7c9]">[${timeStr}] Action : ajout de mots-clés filtrés — "${parameter}"</div>`);
                logs.push(`<div class="text-[#48b7ff]">[${timeStr}] Mise à jour des règles locales...</div>`);
                logs.push(`<div class="text-[#28d39a]">[${timeStr}] Règles appliquées. Filtrage actif.</div>`);
                break;
            default:
                logs.push(`<div class="text-[#aab7c9]">[${timeStr}] Action inconnue : ${action}</div>`);
        }

        logs.forEach(logHtml => demoLogsContainer.insertAdjacentHTML('beforeend', logHtml));
        demoLogsContainer.scrollTop = demoLogsContainer.scrollHeight;
    };

    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const param = btn.getAttribute('data-param') || '';

            btn.classList.add('scale-95', 'bg-[#48b7ff]/15');
            setTimeout(() => {
                btn.classList.remove('scale-95', 'bg-[#48b7ff]/15');
            }, 150);

            addDemoLog(action, param);
        });
    });

    if (clearDemoLogs) {
        clearDemoLogs.addEventListener('click', () => {
            if (demoLogsContainer) {
                const now = new Date().toLocaleTimeString('fr-FR');
                demoLogsContainer.innerHTML = `<div class="text-[#aab7c9]">[${now}] Journal vidé. En attente d'une action...</div>`;
            }
        });
    }

    // ==========================================
    // 7. Reveal-on-scroll
    // ==========================================
    const reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
        const revealTargets = document.querySelectorAll(
            'section .cp-section-heading, section .cp-card, section .grid > div'
        );
        revealTargets.forEach(el => el.classList.add('reveal'));

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

        revealTargets.forEach(el => revealObserver.observe(el));
    }

    // ==========================================
    // 8. Track mouse for card glow hover effects
    // ==========================================
    const cards = document.querySelectorAll('.glow-on-hover');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
