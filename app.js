// app.js

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Mobile Menu Toggle
    // ==========================================
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const btnLine1 = document.getElementById('btn-line1');
    const btnLine2 = document.getElementById('btn-line2');
    const btnLine3 = document.getElementById('btn-line3');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                mobileMenu.classList.remove('hidden');
                // Animate hamburger to X
                btnLine1.style.transform = 'rotate(45deg) translate(5px, 5px)';
                btnLine2.style.opacity = '0';
                btnLine3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                mobileMenu.classList.add('hidden');
                // Animate X to hamburger
                btnLine1.style.transform = 'none';
                btnLine2.style.opacity = '1';
                btnLine3.style.transform = 'none';
            }
        });

        // Close menu on navigation click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                btnLine1.style.transform = 'none';
                btnLine2.style.opacity = '1';
                btnLine3.style.transform = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                btnLine1.style.transform = 'none';
                btnLine2.style.opacity = '1';
                btnLine3.style.transform = 'none';
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
                        otherItem.querySelector('.faq-content').style.maxHeight = '0';
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
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

                // Respect reduced-motion: show the final value instantly, no count-up
                if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    target.innerText = fmt(targetVal);
                    observer.unobserve(target);
                    return;
                }

                let currentVal = 0;

                // Set duration and step timing
                const duration = 1500; // 1.5 seconds total
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
                
                observer.unobserve(target); // Only count up once
            }
        });
    };

    const countObserver = new IntersectionObserver(startCounting, {
        threshold: 0.5
    });

    statsNumbers.forEach(num => countObserver.observe(num));

    // ==========================================
    // 5. Hero Screen Mockup Interactive controls
    // ==========================================
    const mockupScreenGame = document.getElementById('mockup-screen-game');
    const mockupScreenLocked = document.getElementById('mockup-screen-locked');
    const mockupIndicator = document.getElementById('mockup-indicator');
    const mockupIndicatorText = document.getElementById('mockup-indicator-text');
    const mockupStatusText = document.getElementById('mockup-status-text');
    const mockupActionLock = document.getElementById('mockup-action-lock');
    const mockupActionInput = document.getElementById('mockup-action-input');
    const killBtn1 = document.getElementById('mockup-btn-kill1');
    const killBtn2 = document.getElementById('mockup-btn-kill2');
    
    let isMockupLocked = true;
    let isMockupInputBlocked = false;

    const setMockupState = (locked) => {
        isMockupLocked = locked;
        if (locked) {
            // Screen is locked
            mockupScreenGame.classList.add('opacity-0');
            mockupScreenGame.classList.remove('opacity-100');
            mockupScreenLocked.classList.add('opacity-100');
            mockupScreenLocked.classList.remove('opacity-0');
            
            // Indicator lights red
            mockupIndicator.className = 'inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse';
            mockupIndicatorText.innerText = 'Écran Verrouillé';
            mockupIndicatorText.className = 'text-xs text-red-500 font-medium';
            
            // Lock control button status
            mockupStatusText.innerText = 'Actif';
            mockupStatusText.className = 'text-xs font-semibold text-red-400 mt-1';
            mockupActionLock.innerText = 'Déverrouiller';
            mockupActionLock.className = 'w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer';
        } else {
            // Screen is active (game)
            mockupScreenGame.classList.add('opacity-100');
            mockupScreenGame.classList.remove('opacity-0');
            mockupScreenLocked.classList.add('opacity-0');
            mockupScreenLocked.classList.remove('opacity-100');
            
            // Indicator lights green
            mockupIndicator.className = 'inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse';
            mockupIndicatorText.innerText = 'Session Active';
            mockupIndicatorText.className = 'text-xs text-emerald-400 font-medium';
            
            // Lock control button status
            mockupStatusText.innerText = 'Désactivé';
            mockupStatusText.className = 'text-xs font-semibold text-[#9ca3af] mt-1';
            mockupActionLock.innerText = 'Verrouiller';
            mockupActionLock.className = 'w-full py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer';
        }
    };

    // Toggle state on action buttons click
    if (mockupActionLock) {
        mockupActionLock.addEventListener('click', () => {
            setMockupState(!isMockupLocked);
            addDemoLog(isMockupLocked ? "lock" : "unlock", isMockupLocked ? "Temps de pause" : "");
        });
    }

    if (mockupActionInput) {
        mockupActionInput.addEventListener('click', () => {
            isMockupInputBlocked = !isMockupInputBlocked;
            if (isMockupInputBlocked) {
                mockupActionInput.innerText = 'Débloquer Entrées';
                mockupActionInput.className = 'w-full py-2 bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer';
                addDemoLog("blockinput", "true");
            } else {
                mockupActionInput.innerText = 'Bloquer Clavier/Souris';
                mockupActionInput.className = 'w-full py-2 bg-[#223154] hover:bg-[#3b82f6]/20 hover:text-[#38bdf8] text-xs font-semibold text-white rounded-lg transition-colors border border-[#223154] cursor-pointer';
                addDemoLog("blockinput", "false");
            }
        });
    }

    // Process kill buttons action simulator
    const setupKillBtn = (btn, processName, pid, logAction) => {
        if (btn) {
            btn.addEventListener('click', () => {
                const row = btn.closest('div.flex');
                if (row) {
                    row.style.opacity = '0.3';
                    btn.disabled = true;
                    btn.innerText = 'Fermé';
                    btn.className = 'px-3 py-1 bg-gray-800 text-gray-500 rounded border border-gray-700 text-[10px] font-bold cursor-not-allowed';
                    addDemoLog("killprocess", pid);
                }
            });
        }
    };

    setupKillBtn(killBtn1, "Minecraft.exe", "9024");
    setupKillBtn(killBtn2, "Discord.exe", "5120");

    // ==========================================
    // 6. Interactive Web Console Showcase Logs
    // ==========================================
    const demoButtons = document.querySelectorAll('.demo-btn');
    const demoLogsContainer = document.getElementById('demo-logs-container');
    const clearDemoLogs = document.getElementById('clear-demo-logs');

    const addDemoLog = (action, parameter = '') => {
        if (!demoLogsContainer) return;
        
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        let logs = [];
        
        // Match C# Agent API exactly
        switch(action.toLowerCase()) {
            case 'lock':
                logs.push(`<div class="text-[#9ca3af]">[${timeStr}] Commande reçue - Action: lock, Paramètre: "${parameter || 'Verrouillage à distance'}"</div>`);
                logs.push(`<div class="text-red-400">[${timeStr}] Lancement du composant de blocage d'écran (ScreenLockManager)...</div>`);
                logs.push(`<div class="text-red-500 font-bold">[${timeStr}] ÉCRAN VERROUILLÉ. Clavier et souris bloqués avec succès.</div>`);
                
                // Sync Hero Mockup
                setMockupState(true);
                break;
            case 'unlock':
                logs.push(`<div class="text-[#9ca3af]">[${timeStr}] Commande reçue - Action: unlock</div>`);
                logs.push(`<div class="text-emerald-400">[${timeStr}] Libération des ressources de blocage par le ScreenLockManager...</div>`);
                logs.push(`<div class="text-emerald-500 font-bold">[${timeStr}] Écran déverrouillé. Interface utilisateur restaurée.</div>`);
                
                // Sync Hero Mockup
                setMockupState(false);
                break;
            case 'blockinput':
                const blockVal = parameter === 'true';
                logs.push(`<div class="text-[#9ca3af]">[${timeStr}] Commande reçue - Action: blockinput, Paramètre: ${parameter}</div>`);
                if (blockVal) {
                    logs.push(`<div class="text-orange-400">[${timeStr}] Blocage système activé : clavier et souris physiques verrouillés.</div>`);
                } else {
                    logs.push(`<div class="text-emerald-400">[${timeStr}] Entrées utilisateur réactivées.</div>`);
                }
                break;
            case 'screenpower':
                logs.push(`<div class="text-[#9ca3af]">[${timeStr}] Commande reçue - Action: screenpower, Paramètre: ${parameter}</div>`);
                if (parameter === 'off') {
                    logs.push(`<div class="text-red-400">[${timeStr}] Arrêt de l'alimentation logique de l'écran cible (SetScreenPower).</div>`);
                } else {
                    logs.push(`<div class="text-emerald-400">[${timeStr}] Remise sous tension logique de l'écran cible.</div>`);
                }
                break;
            case 'killprocess':
                logs.push(`<div class="text-[#9ca3af]">[${timeStr}] Commande reçue - Action: killprocess, PID: ${parameter}</div>`);
                logs.push(`<div class="text-orange-400">[${timeStr}] Envoi du signal de fermeture de force au processus PID ${parameter}...</div>`);
                logs.push(`<div class="text-[#34d399] font-semibold">[${timeStr}] Succès: Arbre du processus PID ${parameter} tué de force.</div>`);
                break;
            case 'setkeywords':
                logs.push(`<div class="text-[#9ca3af]">[${timeStr}] Commande reçue - Action: setkeywords, Mots-clés: "${parameter}"</div>`);
                logs.push(`<div class="text-[#38bdf8]">[${timeStr}] Écriture des nouvelles règles dans le fichier hosts local...</div>`);
                logs.push(`<div class="text-emerald-400">[${timeStr}] FlushDNS système effectué. Règles hosts rechargées.</div>`);
                break;
            default:
                logs.push(`<div class="text-[#9ca3af]">[${timeStr}] Commande inconnue reçue - Action: ${action}</div>`);
        }
        
        logs.forEach(logHtml => {
            demoLogsContainer.insertAdjacentHTML('beforeend', logHtml);
        });
        
        // Auto scroll to bottom
        demoLogsContainer.scrollTop = demoLogsContainer.scrollHeight;
    };

    // Attach actions to demo buttons
    demoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const param = btn.getAttribute('data-param') || '';
            
            // Add styling feedback on click
            btn.classList.add('scale-95', 'bg-[#38bdf8]/20');
            setTimeout(() => {
                btn.classList.remove('scale-95', 'bg-[#38bdf8]/20');
            }, 150);

            addDemoLog(action, param);
        });
    });

    // Clear logs button
    if (clearDemoLogs) {
        clearDemoLogs.addEventListener('click', () => {
            if (demoLogsContainer) {
                demoLogsContainer.innerHTML = `<div class="text-[#9ca3af]">[${new Date().toLocaleTimeString('fr-FR')}] Console d'agent vidée. En attente de commandes...</div>`;
            }
        });
    }

    // ==========================================
    // 7. Track mouse for card glow hover effects
    // ==========================================
    const cards = document.querySelectorAll('.glow-on-hover, .faq-item, #features > div > div');
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
