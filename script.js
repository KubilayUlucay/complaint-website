document.addEventListener('DOMContentLoaded', () => {
    const ticketForm = document.getElementById('ticketForm');
    const ticketsContainer = document.getElementById('ticketsContainer');
    const noTicketsMessage = document.getElementById('noTicketsMessage');
    const submitTicketBtn = document.getElementById('submitTicketBtn');
    const loadingAnimation = document.getElementById('loadingAnimation');
    const loadingImage = document.getElementById('loadingImage');
    const loadingMessageText = document.getElementById('loadingMessageText'); // For translated loading text

    const loveMeterBarFill = document.getElementById('loveMeterBarFill');
    const loveMeterStatus = document.getElementById('loveMeterStatus');
    const lovePointsDisplay = document.getElementById('lovePointsDisplay');
    const loveMeterEmoji = document.getElementById('loveMeterEmoji');

    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseModal = document.getElementById('surpriseModal');
    const closeModalBtn = document.querySelector('.modal .close-button');
    const surpriseMessageEl = document.getElementById('surpriseMessage');
    const surpriseImageEl = document.getElementById('surpriseImage');

    const heartsContainer = document.getElementById('background-hearts-container');
    const numHearts = 20;

    let lovePoints = 0;
    const MAX_LOVE_POINTS = 1000;
    const loveMeterMilestones = [
        { points: 0, status: "Bana her yazdığında doluyor!!! 🥰", emoji: "💖" },
        { points: 50, status: "Her not kalbimi kelebeklendiriyor! 🦋", emoji: "💕" },
        { points: 100, status: "Kocaman bir aşk dağı inşa ediyoruz! ⛰️❤️", emoji: "💞" },
        { points: 200, status: "Aşkımız bir elmas gibi parlıyor! 💎", emoji: "💓" },
        { points: 350, status: "Sevgiyle taşıyorum! Kalbim dopdolu! 🥰", emoji: "💗" },
        { points: 500, status: "Aşk notlarımızla buradan aya kadar! 🚀🌕", emoji: "💘" },
        { points: 750, status: "Aşkımız bir şehre enerji verebilir! ✨🏙️", emoji: "💝" },
        { points: MAX_LOVE_POINTS, status: "DURDURULAMAZ AŞK! Sen benim her şeyimsin! 😍🎉", emoji: "💖💖💖" }
    ];
    
    const carrierGifs = [
        "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDY1bjNvZXgzbXhteXVxcDh6ZW9tNXN1ZDJ5cDI3ZXN1Y21kb3F5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wTpkdIK1TeBK44tLRt/giphy.gif"
    ];

    const cuteSurprises = [ // Translated messages & updated Giphy links
        { message: "Sen benim favori insanımsın! 🥰", image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHhzbnNqOW42bmM0djJwMGE4NXp3ODRldGZoN3JnMWJtd2F3YW5kcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/yPQcB2bQVBQ6k/giphy.gif" },
        { message: "Sana sanal bir sarılma gönderiyorum! 🤗", image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHhzbnNqOW42bmM0djJwMGE4NXp3ODRldGZoN3JnMWJtd2F3YW5kcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MDJ9IbxxvDUQM/giphy.gif" },
        { message: "Kalbimi pır pır ettiriyorsun! 🦋", image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZxdTNwOW12cXlrNzIxcjZlbmhlejl5ZWszbWxhcmJucnVjMHFuaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/AAmXHAfy3WT6iTjDy6/giphy.gif" },
        { message: "Sadece seni düşünmek bile beni gülümsetiyor! 😊", image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXVkdXl1cm5pMXBxcjRzcncwbmxjbnltd3psZm1wNmt1Z3ZmZDlucCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oriO0OEd9QIDdllqo/giphy.gif" },
        { message: "Baldan tatlısın! 🍯", image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzRmNmU2Y2xqMGVibDRqMXBucWR4ajBrMW4ycWRvMG16ZXBucWYyMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KHhs4BXpy5dba/giphy.gif" }
    ];

    // Translated constants
    const TXT_ENTER_THOUGHT = "Lütfen aklında ne olduğunu yaz!";
    const TXT_SENDING = "Gönderiliyor...";
    const TXT_SUBMIT_BTN_DEFAULT = "Aşkımı Gönder!"; // Match button text in HTML
    const TXT_FORMPSREE_ERROR_GENERIC = "Gönderim başarısız oldu.";
    const TXT_TRY_AGAIN = "Lütfen tekrar dene.";
    const TXT_FETCH_ERROR = "Eyvah! Notunu gönderirken teknik bir aksaklık oldu. Lütfen internetini kontrol edip tekrar dene. Sorun devam ederse Kubi'ye haber ver!";
    const TXT_LOADING_MESSAGE = "Kıymetli notun ulaştırılıyor...";


    function initializePage() {
        console.log("Sayfa başlatılıyor...");
        if (noTicketsMessage) noTicketsMessage.textContent = "Henüz hiç not göndermedin :((((("; // Set initial text from JS
        if (loadingMessageText) loadingMessageText.textContent = TXT_LOADING_MESSAGE;

        if (ticketForm && ticketsContainer && noTicketsMessage) loadTickets();
        else console.error("Temel bilet elemanları bulunamadı!");
        if (loveMeterBarFill && loveMeterStatus && lovePointsDisplay && loveMeterEmoji) {
            loadLovePoints();
            updateLoveMeterUI();
        } else console.warn("Aşk metresi elemanları tam olarak bulunamadı.");
        if (heartsContainer) createFloatingHearts();
        else console.warn("Kalp konteyneri bulunamadı.");
        console.log("Sayfa başlatma tamamlandı.");
    }
    
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePage);
    else initializePage();

    if (ticketForm) {
        ticketForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log("Form gönderimi tetiklendi. Varsayılan engellendi.");

            const formData = new FormData(ticketForm);
            const ticketTitleValue = formData.get('ticketTitle');

            if (!ticketTitleValue || !ticketTitleValue.trim()) {
                alert(TXT_ENTER_THOUGHT);
                return;
            }

            const startTime = Date.now();
            const minLoadingDisplayTime = 4000; // 4 saniye

            if (loadingImage && carrierGifs.length > 0) {
                loadingImage.src = carrierGifs[Math.floor(Math.random() * carrierGifs.length)];
            }
            if (loadingAnimation) loadingAnimation.style.display = 'flex';
            if (submitTicketBtn) {
                submitTicketBtn.disabled = true;
                submitTicketBtn.textContent = TXT_SENDING;
            }

            try {
                const response = await fetch(ticketForm.action, {
                    method: ticketForm.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const ticket = {
                        id: new Date().getTime(),
                        type: formData.get('ticketType'),
                        title: ticketTitleValue,
                        message: formData.get('ticketMessage'),
                        mood: formData.get('ticketMood'),
                        timestamp: new Date().toLocaleString('tr-TR') // Turkish locale for date
                    };
                    addTicketToDOM(ticket);
                    saveTicketToLocalStorage(ticket);
                    incrementLovePoints(10);
                    ticketForm.reset();
                    playSendSound();
                    showConfetti();
                } else {
                    const responseData = await response.json().catch(() => ({}));
                    const errorMessages = responseData.errors ? responseData.errors.map(e => e.message).join(", ") : TXT_FORMPSREE_ERROR_GENERIC;
                    alert(`Hay aksi! ${errorMessages} ${TXT_TRY_AGAIN}`);
                }
            } catch (error) {
                console.error("Form gönderimi sırasında hata:", error);
                alert(TXT_FETCH_ERROR);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = minLoadingDisplayTime - elapsedTime;
                if (remainingTime > 0) {
                    await new Promise(resolve => setTimeout(resolve, remainingTime));
                }
                if (loadingAnimation) loadingAnimation.style.display = 'none';
                if (submitTicketBtn) {
                    submitTicketBtn.disabled = false;
                    submitTicketBtn.textContent = TXT_SUBMIT_BTN_DEFAULT;
                }
            }
        });
    } else {
        console.error("KRİTİK: Bilet formu (ID: ticketForm) bulunamadı!");
    }

    function addTicketToDOM(ticket) {
        if (!ticketsContainer) return;
        const ticketCard = document.createElement('div');
        ticketCard.classList.add('ticket-card');
        ticketCard.dataset.id = ticket.id;
        const typeSlug = ticket.type.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, '-').replace(/^-+|-+$/g, ''); // Turkish chars in slug
        ticketCard.innerHTML = `
            <div class="ticket-header">
                <h3>${escapeHTML(ticket.title)}</h3>
                <span class="ticket-type-badge type-${typeSlug}">${escapeHTML(ticket.type)}</span>
                <span class="expand-arrow">▼</span>
            </div>
            <div class="ticket-body">
                ${ticket.mood ? `<div class="mood">${escapeHTML(ticket.mood)}</div>` : ''}
                ${ticket.message ? `<p>${escapeHTML(ticket.message)}</p>` : ''}
                <div class="timestamp">${ticket.timestamp}</div>
            </div>
            <button class="delete-btn" title="Bu notu sil">×</button>
        `;
        const header = ticketCard.querySelector('.ticket-header');
        if (header) header.addEventListener('click', () => ticketCard.classList.toggle('open'));
        const deleteButton = ticketCard.querySelector('.delete-btn');
        if (deleteButton) deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTicket(ticket.id, ticketCard);
        });
        ticketsContainer.prepend(ticketCard);
        updateNoTicketsMessage();
    }

    function saveTicketToLocalStorage(ticket) {
        const tickets = getTicketsFromLocalStorage();
        tickets.unshift(ticket);
        localStorage.setItem('gfTickets', JSON.stringify(tickets));
    }

    function getTicketsFromLocalStorage() {
        const ticketsJSON = localStorage.getItem('gfTickets');
        if (ticketsJSON) {
            try { return JSON.parse(ticketsJSON); }
            catch (e) {
                console.error("Yerel Depolamadan biletleri ayrıştırırken hata:", e);
                localStorage.removeItem('gfTickets'); return [];
            }
        } return [];
    }

    function loadTickets() {
        const tickets = getTicketsFromLocalStorage();
        if (ticketsContainer) ticketsContainer.innerHTML = '';
        tickets.forEach(ticket => addTicketToDOM(ticket));
        updateNoTicketsMessage();
    }

    function deleteTicket(ticketId, ticketCardElement) {
        ticketCardElement.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => { ticketCardElement.remove(); updateNoTicketsMessage(); }, 300);
        let tickets = getTicketsFromLocalStorage();
        tickets = tickets.filter(t => t.id !== ticketId);
        localStorage.setItem('gfTickets', JSON.stringify(tickets));
    }

    function updateNoTicketsMessage() {
        if (noTicketsMessage && ticketsContainer) {
            noTicketsMessage.style.display = ticketsContainer.children.length === 0 ? 'block' : 'none';
        }
    }

    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"]/g, function (match) {
            return { '&': '&', '<': '<', '>': '>', '"': '"' }[match];
        });
    }

    function playSendSound() { console.log("PLING! Ses efekti."); }
    function showConfetti() {
        const confettiCount = 50; const colors = ['#E91E63', '#FFC0CB', '#FFAB91', '#fff'];
        for (let i = 0; i < confettiCount; i++) {
            const c = document.createElement('div');
            Object.assign(c.style, { position: 'fixed', left: `${Math.random()*100}vw`, top: `${Math.random()*-20+90}vh`, width: `${Math.random()*10+5}px`, height: c.style.width, backgroundColor: colors[Math.floor(Math.random()*colors.length)], opacity: '0', borderRadius: `${Math.random()>.5?'50%':'0'}`, zIndex: '9999' });
            document.body.appendChild(c);
            c.animate([{transform:`translateY(0px) rotate(0deg)`,opacity:1},{transform:`translateY(${Math.random()*200+100}px) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:Math.random()*2000+1000,easing:'ease-out',delay:Math.random()*200}).onfinish=()=>c.remove();
        }
    }

    function loadLovePoints() {
        const p = localStorage.getItem('gfLovePoints'); lovePoints = p ? parseInt(p, 10) : 0;
    }
    function saveLovePoints() { localStorage.setItem('gfLovePoints', lovePoints.toString()); }
    function incrementLovePoints(pts) { lovePoints += pts; saveLovePoints(); updateLoveMeterUI(); }
    function updateLoveMeterUI() {
        if (!loveMeterBarFill || !loveMeterStatus || !loveMeterEmoji || !lovePointsDisplay) return;
        const pct = Math.min((lovePoints / MAX_LOVE_POINTS) * 100, 100);
        loveMeterBarFill.style.width = `${pct}%`;
        loveMeterBarFill.textContent = lovePoints >= 50 ? `${Math.round(pct)}%` : '';
        let currentStatus = loveMeterMilestones[0].status;
        let currentEmoji = loveMeterMilestones[0].emoji;
        for (let i = loveMeterMilestones.length - 1; i >= 0; i--) {
            if (lovePoints >= loveMeterMilestones[i].points) {
                currentStatus = loveMeterMilestones[i].status;
                currentEmoji = loveMeterMilestones[i].emoji;
                if (lovePoints > MAX_LOVE_POINTS && i === loveMeterMilestones.length-1) {
                     currentStatus = `AMAN TANRIM! ${lovePoints} puan! Aşkımız efsanevi! 💖👑`;
                }
                break;
            }
        }
        loveMeterStatus.textContent = currentStatus;
        loveMeterEmoji.textContent = currentEmoji;
        lovePointsDisplay.textContent = `Aşk Puanı: ${lovePoints}`;
        loveMeterBarFill.style.background = pct >= 100 ? 'linear-gradient(90deg, #fffd7a, #fbd786, #f7797d)' : 'linear-gradient(90deg, #ff758c, #ff7eb3)';
    }

    function createFloatingHearts() {
        if (!heartsContainer) return;
        const emojis = ['❤️','💖','💕','💜','💗'];
        for (let i=0; i<numHearts; i++) {
            const h = document.createElement('div'); h.classList.add('bg-heart');
            Object.assign(h.style, {left:`${Math.random()*100}vw`, fontSize:`${Math.random()*15+10}px`, animationDuration:`${Math.random()*10+10}s`, animationDelay:`-${Math.random()*15}s`});
            h.innerHTML = emojis[Math.floor(Math.random()*emojis.length)]; heartsContainer.appendChild(h);
        }
    }

    if (surpriseBtn && surpriseModal && surpriseMessageEl && surpriseImageEl) {
        surpriseBtn.addEventListener('click', () => {
            console.log("Sürpriz butonu tıklandı.");
            const surprise = cuteSurprises[Math.floor(Math.random() * cuteSurprises.length)];
            surpriseMessageEl.textContent = surprise.message;
            if (surprise.image) {
                surpriseImageEl.src = surprise.image;
                surpriseImageEl.alt = "Sevimli sürpriz GIF"; // Alt text for accessibility
                surpriseImageEl.style.display = 'block';
                console.log("Sürpriz GIF ayarlandı:", surprise.image);
            } else {
                surpriseImageEl.style.display = 'none';
                console.log("Sürpriz için resim yok.");
            }
            surpriseModal.style.display = 'block';
        });
    }
    if (closeModalBtn && surpriseModal) closeModalBtn.addEventListener('click', () => surpriseModal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target===surpriseModal && surpriseModal) surpriseModal.style.display='none'; });

    if (!document.getElementById('customAnimationsStyle')) {
        const s=document.createElement("style"); s.id='customAnimationsStyle';
        s.innerText=`@keyframes fadeOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}`;
        document.head.appendChild(s);
    }
});