let defaultSettings = {  
    whatsapp: '94712345678',  
    wachannel: '',
    telegram: '',  
    tiktok: '',
    youtube: '',
    facebook: '',
    typing: 'Premium S4G X CHEATZ Assistant',
    headerLogo: 'https://i.ibb.co/tppN1kF0/logo.jpg',
    devNumber: '94712345678',
    devPhoto: 'https://i.ibb.co/R4bCH8PC/dev.jpg',
    s4gNumber: '94712345678',
    s4gPhoto: 'https://i.ibb.co/N64f43X2/contact.jpg',
    notice: ''
};

let appData = {  
    products: [],  
    mods: [],
    proofs: [],  
    customers: 0,
    lastUpdateTimestamp: Date.now(),
    settings: { ...defaultSettings }  
};  

let editingProjectId = null;  
let logoClickCount = 0;
let logoClickTimer = null;

document.addEventListener('DOMContentLoaded', function(){  
    loadLocalData();  
    calculateAutoCustomers();
    renderEverything();  
    updateSriLankaClock();
    
    setInterval(updateSriLankaClock, 1000);
    setInterval(calculateAutoCustomers, 60000);

    document.addEventListener('click', function(e){
        if(!e.target.closest('.custom-select-wrapper')){
            document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
        }
    });
});  

function startWebsite(){
    const overlay = document.getElementById('playOverlay');
    if(overlay){
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }
}

function updateSriLankaClock(){
    const options = {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const timeString = formatter.format(new Date());
    const clockEl = document.getElementById('slClock');
    if(clockEl) clockEl.textContent = timeString;
}

function calculateAutoCustomers(){
    const now = Date.now();
    const lastTime = appData.lastUpdateTimestamp || now;
    const diffMs = now - lastTime;
    
    const addedCustomers = Math.floor(diffMs / 180000); 

    if(addedCustomers > 0){
        appData.customers = (appData.customers || 0) + addedCustomers;
        appData.lastUpdateTimestamp = lastTime + (addedCustomers * 180000);
        saveData();
        renderCounts();
    }
}

function incrementCustomer(){
    appData.customers = (appData.customers || 0) + 1;
    saveData();
    renderCounts();
}

function handleModTypeChange(type){
    const priceGrp = document.getElementById('modPriceGroup');
    if(type === 'Paid'){
        priceGrp.style.display = 'block';
    } else {
        priceGrp.style.display = 'none';
        setValue('modPrice', '');
    }
}

function loadLocalData(){  
    try{  
        const saved = localStorage.getItem('s4g_cheatz_data');  
        if(saved){  
            const parsed = JSON.parse(saved);  
            appData = {  
                products: Array.isArray(parsed.products) ? parsed.products : [],  
                mods: Array.isArray(parsed.mods) ? parsed.mods : [],
                proofs: Array.isArray(parsed.proofs) ? parsed.proofs : [],  
                customers: typeof parsed.customers === 'number' ? parsed.customers : 0,
                lastUpdateTimestamp: parsed.lastUpdateTimestamp || Date.now(),
                settings: {  
                    ...defaultSettings,  
                    ...(parsed.settings || {}),
                    headerLogo: parsed.settings?.headerLogo || defaultSettings.headerLogo,
                    devPhoto: parsed.settings?.devPhoto || defaultSettings.devPhoto,
                    s4gPhoto: parsed.settings?.s4gPhoto || defaultSettings.s4gPhoto
                }  
            };  
        }  
    }catch(error){  
        console.log('Local Data Read Error:', error);  
    }  
}  

function saveData(){  
    try {
        localStorage.setItem('s4g_cheatz_data', JSON.stringify(appData));  
    } catch(e) {
        alert('Storage full! Please use smaller image size or restart data.');
    }
}  

function toggleCustomSelect(id){
    const el = document.getElementById(id);
    document.querySelectorAll('.custom-select-wrapper').forEach(w => {
        if(w !== el) w.classList.remove('open');
    });
    el.classList.toggle('open');
}

function selectCustomOption(wrapperId, val, label){
    const wrapper = document.getElementById(wrapperId);
    wrapper.querySelector('input[type="hidden"]').value = val;
    wrapper.querySelector('.custom-select-trigger span').textContent = label;
    
    wrapper.querySelectorAll('.custom-option').forEach(opt => {
        if(opt.textContent === label){
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    wrapper.classList.remove('open');
}

function getYoutubeEmbedUrl(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=0&rel=0`;
    }
    return url;
}

function switchPage(pageId){
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const target = document.getElementById(pageId);
    if(target) target.classList.add('active');

    const navIndex = ['homePage','storyPage','proofsPage','supportPage'].indexOf(pageId);
    if(navIndex !== -1){
        document.querySelectorAll('.nav-item')[navIndex].classList.add('active');
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function openCategory(cat){
    document.getElementById('categoryTitle').textContent = cat + ' PROJECTS';
    document.getElementById('categoryBackBtn').setAttribute('onclick', "switchPage('storyPage')");
    renderCategoryProducts(cat);
    switchPage('categoryPage');
}

function openModSelection(){
    switchPage('modTypePage');
}

function openModCategory(type){
    document.getElementById('categoryTitle').textContent = type + ' MOD APPS';
    document.getElementById('categoryBackBtn').setAttribute('onclick', "switchPage('modTypePage')");
    renderModProducts(type);
    switchPage('categoryPage');
}

function handleLogoClick(){
    logoClickCount++;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1500);

    if(logoClickCount >= 5){
        logoClickCount = 0;
        openModal('loginModal');
    }
}

function adminLogin(){
    const pwd = getValue('adminPassword');
    if(pwd === '1234'){
        closeModal('loginModal');
        setValue('adminPassword', '');
        openModal('adminModal');
        showToast('Welcome Admin!');
    } else {
        showToast('Incorrect Password!');
    }
}

function openModal(id){ document.getElementById(id).classList.add('active'); }
function closeModal(id){ document.getElementById(id).classList.remove('active'); }
function closeAdmin(){ closeModal('adminModal'); resetProjectForm(); }

function switchAdminTab(tabId, btn){
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btns button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

function renderEverything(){
    renderSettings();
    renderCounts();
    renderProofs();
    renderAdminLists();
}

let typingTimer = null;
function startTypingEffect(text){
    const container = document.getElementById('typingText');
    if(!container) return;
    container.textContent = '';
    let i = 0;
    if(typingTimer) clearInterval(typingTimer);
    
    typingTimer = setInterval(() => {
        if(i < text.length){
            container.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingTimer);
        }
    }, 100);
}

function renderSettings(){
    const s = appData.settings;
    setValue('settingWhatsapp', s.whatsapp);
    setValue('settingWaChannel', s.wachannel || '');
    setValue('settingNotice', s.notice || '');
    setValue('settingTelegram', s.telegram);
    setValue('settingTiktok', s.tiktok);
    setValue('settingYoutube', s.youtube);
    setValue('settingFacebook', s.facebook);
    setValue('settingTyping', s.typing);
    setValue('settingHeaderLogo', s.headerLogo || defaultSettings.headerLogo);
    setValue('settingDevNumber', s.devNumber || '');
    setValue('settingDevPhoto', s.devPhoto || defaultSettings.devPhoto);
    setValue('settingS4gNumber', s.s4gNumber || '');
    setValue('settingS4gPhoto', s.s4gPhoto || defaultSettings.s4gPhoto);

    const noticeBar = document.getElementById('announcementBar');
    if(s.notice){
        noticeBar.textContent = s.notice;
        noticeBar.style.display = 'block';
    } else {
        noticeBar.style.display = 'none';
    }

    startTypingEffect(s.typing || 'Premium S4G X CHEATZ Assistant');
    
    const headerLogoEl = document.getElementById('headerLogoImg');
    if(headerLogoEl) headerLogoEl.src = s.headerLogo || defaultSettings.headerLogo;

    const waUrl = s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g,'')}` : '#';
    document.getElementById('linkWhatsapp').href = waUrl;
    
    const waChanUrl = s.wachannel || '#';
    document.getElementById('linkWaChannel').href = waChanUrl;

    document.getElementById('linkTelegram').href = s.telegram || '#';
    document.getElementById('linkTiktok').href = s.tiktok || '#';
    document.getElementById('linkYoutube').href = s.youtube || '#';
    document.getElementById('linkFb').href = s.facebook || '#';

    const devWaUrl = `https://wa.me/${(s.devNumber||'').replace(/\D/g,'')}?text=Hello%20S4G%20Developer%20Team%20Contact`;
    document.getElementById('devContactBtn').href = devWaUrl;
    document.getElementById('devProfileImg').src = s.devPhoto || defaultSettings.devPhoto;

    const s4gWaUrl = `https://wa.me/${(s.s4gNumber||'').replace(/\D/g,'')}?text=Hello%20S4G%20Contact`;
    document.getElementById('s4gContactBtn').href = s4gWaUrl;
    document.getElementById('s4gContactImg').src = s.s4gPhoto || defaultSettings.s4gPhoto;
}

function renderCounts(){
    const prods = appData.products;
    const mods = appData.mods || [];

    setText('iosCount', prods.filter(p => p.category === 'iOS').length + ' PRODUCTS');
    setText('androidCount', prods.filter(p => p.category === 'Android').length + ' PRODUCTS');
    setText('pcCount', prods.filter(p => p.category === 'PC').length + ' PRODUCTS');
    setText('modCount', mods.length + ' MODS');

    setText('freeModCount', mods.filter(m => m.type === 'Free').length + ' MODS');
    setText('paidModCount', mods.filter(m => m.type === 'Paid').length + ' MODS');

    setText('projectCount', prods.length);
    setText('modApkCount', mods.length);
    setText('customerCount', appData.customers || 0);
}

function renderCategoryProducts(category){
    const container = document.getElementById('categoryProjectsContainer');
    const filtered = appData.products.filter(p => p.category === category);

    if(filtered.length === 0){
        container.innerHTML = `<div class="empty-state"><h3>No Projects Available</h3><p>No projects listed under ${category} category yet.</p></div>`;
        return;
    }

    container.innerHTML = filtered.map(p => {
        const isAvailable = p.available !== false;
        let mediaHtml = '';
        
        if(p.video){
            const embedUrl = getYoutubeEmbedUrl(p.video);
            mediaHtml = `<div class="project-video">
                <iframe 
                    src="${embedUrl}" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>
            </div>`;
        }

        return `
            <div class="project-card">
                ${mediaHtml}
                <div class="project-top">
                    <div>
                        <div class="project-name">${escapeHTML(p.name)}</div>
                        <div class="project-platform">${escapeHTML(p.category)}</div>
                    </div>
                    <span class="project-stock ${isAvailable ? '' : 'out'}">
                        ${isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>
                </div>
                <div class="project-price">${escapeHTML(p.price)}</div>
                <div class="project-description">${escapeHTML(p.description)}</div>
                <button class="buy-btn" onclick="buyProduct('${p.id}')" ${isAvailable ? '' : 'disabled'}>
                    ${isAvailable ? 'BUY NOW 🛒' : 'OUT OF STOCK'}
                </button>
                <button class="share-btn" onclick="shareItem('${escapeHTML(p.name)}')">🔗 Share Item</button>
            </div>
        `;
    }).join('');
}

function renderModProducts(type){
    const container = document.getElementById('categoryProjectsContainer');
    const filtered = (appData.mods || []).filter(m => m.type === type);

    if(filtered.length === 0){
        container.innerHTML = `<div class="empty-state"><h3>No ${type} Mods Available</h3><p>No ${type} Mod Apps listed yet.</p></div>`;
        return;
    }

    container.innerHTML = filtered.map(m => `
        <div class="project-card">
            <div class="mod-item-header">
                <img src="${escapeHTML(m.image || 'https://i.ibb.co/tppN1kF0/logo.jpg')}" class="mod-item-img">
                <div>
                    <h3 style="font-size:16px;">${escapeHTML(m.name)}</h3>
                    <small style="color:var(--cyan);">${m.platform || 'Android'}</small>
                </div>
            </div>
            ${m.type === 'Paid' && m.price ? `<div class="project-price">${escapeHTML(m.price)}</div>` : ''}
            <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="buy-btn" style="${type==='Free'?'background:#00ff66;color:#000;':'background:#ff0055;'}" onclick="handleModClick('${type}', '${escapeHTML(m.link || '')}', '${escapeHTML(m.name)}', '${escapeHTML(m.price || '')}')">
                    ${type === 'Free' ? 'DOWNLOAD NOW 📥' : 'CONTACT TO BUY 💬'}
                </button>
                ${m.link ? `<button class="buy-btn" style="background:#008cff; color:#fff;" onclick="window.open('${escapeHTML(m.link)}', '_blank')">DOWNLOAD LINK 📥</button>` : ''}
            </div>
            <button class="share-btn" onclick="shareItem('${escapeHTML(m.name)}')">🔗 Share Mod</button>
        </div>
    `).join('');
}

function shareItem(name){
    if(navigator.share){
        navigator.share({
            title: 'S4G X CHEATZ - ' + name,
            text: 'Check out ' + name + ' on S4G X CHEATZ Gaming!',
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
    }
}

function handleModClick(type, link, name, price){
    incrementCustomer();
    if(type === 'Free'){
        if(link) window.open(link, '_blank');
        else showToast('No download link provided!');
    } else {
        const num = appData.settings.whatsapp;
        let priceStr = price ? ` for ${price}` : '';
        const msg = `Hello S4G X CHEATZ, I want to buy this Paid Mod App: ${name}${priceStr}`;
        window.open(`https://wa.me/${num.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
    }
}

function renderProofs(){
    const container = document.getElementById('proofsContainer');
    if(!appData.proofs || appData.proofs.length === 0){
        container.innerHTML = `<div class="empty-state"><h3>No Proofs Yet</h3></div>`;
        return;
    }

    container.innerHTML = appData.proofs.map(pr => `
        <div class="proof-card">
            ${pr.image ? `<img src="${escapeHTML(pr.image)}" class="proof-img" alt="Proof">` : ''}
            <div>
                <h4 style="font-size:15px;">${escapeHTML(pr.name || 'Customer')}</h4>
                <p style="color:var(--text-gray); font-size:12px; margin-top:4px;">${escapeHTML(pr.description || '')}</p>
            </div>
        </div>
    `).join('');
}

function renderAdminLists(){
    const pList = document.getElementById('adminProjectList');
    if(appData.products.length === 0){
        pList.innerHTML = '<small style="color:var(--text-gray)">No projects added.</small>';
    } else {
        pList.innerHTML = appData.products.map(p => `
            <div class="admin-list-item">
                <div>
                    <strong>${escapeHTML(p.name)} (${p.category})</strong>
                    <small>${escapeHTML(p.price)} - ${p.available !== false ? 'In Stock' : 'Out of Stock'}</small>
                </div>
                <div>
                    <button class="edit-btn" onclick="editProject('${p.id}')">EDIT</button>
                    <button class="delete-btn" onclick="deleteProject('${p.id}')">DELETE</button>
                </div>
            </div>
        `).join('');
    }

    const mList = document.getElementById('adminModList');
    if(!appData.mods || appData.mods.length === 0){
        mList.innerHTML = '<small style="color:var(--text-gray)">No mods added.</small>';
    } else {
        mList.innerHTML = appData.mods.map(m => `
            <div class="admin-list-item">
                <div>
                    <strong>${escapeHTML(m.name)} (${m.type}) ${m.price ? '- ' + escapeHTML(m.price) : ''}</strong>
                    <small>${m.platform || 'Android'}</small>
                </div>
                <div>
                    <button class="delete-btn" onclick="deleteMod('${m.id}')">DELETE</button>
                </div>
            </div>
        `).join('');
    }

    const prList = document.getElementById('adminProofList');
    if(!appData.proofs || appData.proofs.length === 0){
        prList.innerHTML = '<small style="color:var(--text-gray)">No proofs added.</small>';
    } else {
        prList.innerHTML = appData.proofs.map(pr => `
            <div class="admin-list-item">
                <div>
                    <strong>${escapeHTML(pr.name || 'Proof')}</strong>
                    <small>${escapeHTML(pr.description || '')}</small>
                </div>
                <div>
                    <button class="delete-btn" onclick="deleteProof('${pr.id}')">DELETE</button>
                </div>
            </div>
        `).join('');
    }
}

function saveSettingsFromAdmin(){
    appData.settings = {
        whatsapp: getValue('settingWhatsapp'),
        wachannel: getValue('settingWaChannel'),
        notice: getValue('settingNotice'),
        telegram: getValue('settingTelegram'),
        tiktok: getValue('settingTiktok'),
        youtube: getValue('settingYoutube'),
        facebook: getValue('settingFacebook'),
        typing: getValue('settingTyping'),
        headerLogo: getValue('settingHeaderLogo') || defaultSettings.headerLogo,
        devNumber: getValue('settingDevNumber'),
        devPhoto: getValue('settingDevPhoto') || defaultSettings.devPhoto,
        s4gNumber: getValue('settingS4gNumber'),
        s4gPhoto: getValue('settingS4gPhoto') || defaultSettings.s4gPhoto
    };
    saveData();
    renderEverything();
    showToast('Settings Saved!');
}

function showUploadNotification(title, typeText){
    let notif = document.createElement('div');
    notif.className = 'live-toast-notif';
    notif.innerHTML = `
        <span style="font-size:22px;">🔔</span>
        <div>
            <strong style="color:#00ffcc; font-size:11px; display:block; letter-spacing:1px;">NEW ${typeText}!</strong>
            <span style="font-size:13px; color:#fff; font-weight:800;">${escapeHTML(title)} is now available!</span>
        </div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => { notif.remove(); }, 5000);
}

function saveMod(){
    const name = getValue('modName');
    const image = getValue('modImage');
    const platform = getValue('modPlatform');
    const type = getValue('modType');
    const price = getValue('modPrice');
    const link = getValue('modLink');

    if(!name){ showToast('Enter Mod Name!'); return; }

    if(!appData.mods) appData.mods = [];
    appData.mods.unshift({ id: Date.now().toString(36), name, image, platform, type, price, link });
    saveData();
    
    setValue('modName', '');
    setValue('modImage', '');
    setValue('modPrice', '');
    setValue('modLink', '');

    renderEverything();
    showUploadNotification(name, 'MOD APP');
    showToast('MOD App Saved!');
}

function saveProject(){
    const name = getValue('projectName');
    const category = getValue('projectPlatform');
    const price = getValue('projectPrice');
    const stock = getValue('projectStock') === 'true';
    const video = getValue('projectVideo');
    const description = getValue('projectDescription');

    if(!name){ showToast('Enter project name!'); return; }

    const projectData = {
        id: editingProjectId || Date.now().toString(36),
        name, category, price, available: stock, video, description
    };

    if(editingProjectId){
        const idx = appData.products.findIndex(p => p.id === editingProjectId);
        if(idx !== -1) appData.products[idx] = projectData;
        editingProjectId = null;
        showToast('Project Updated!');
    } else {
        appData.products.unshift(projectData);
        showUploadNotification(name, 'PROJECT');
        showToast('Project Added!');
    }

    saveData();
    resetProjectForm();
    renderEverything();
}

function editProject(id){
    const p = appData.products.find(item => item.id === id);
    if(!p) return;

    editingProjectId = p.id;
    setValue('projectName', p.name);
    selectCustomOption('customCategoryWrapper', p.category, p.category);
    setValue('projectPrice', p.price);
    selectCustomOption('customStockWrapper', p.available !== false ? 'true' : 'false', p.available !== false ? 'IN STOCK' : 'OUT OF STOCK');
    setValue('projectVideo', p.video || '');
    setValue('projectDescription', p.description || '');

    document.getElementById('projectFormTitle').textContent = 'EDIT PROJECT';
    switchAdminTab('tabProject', document.querySelectorAll('.admin-nav-btns button')[1]);
}

function deleteProject(id){
    if(confirm('Delete this project?')){
        appData.products = appData.products.filter(p => p.id !== id);
        saveData();
        renderEverything();
        showToast('Project Deleted!');
    }
}

function deleteMod(id){
    if(confirm('Delete this mod?')){
        appData.mods = appData.mods.filter(m => m.id !== id);
        saveData();
        renderEverything();
        showToast('MOD App Deleted!');
    }
}

function resetProjectForm(){
    editingProjectId = null;
    setValue('projectName', '');
    setValue('projectPrice', '');
    setValue('projectVideo', '');
    setValue('projectDescription', '');
    selectCustomOption('customCategoryWrapper', 'iOS', 'iOS');
    selectCustomOption('customStockWrapper', 'true', 'IN STOCK');
    document.getElementById('projectFormTitle').textContent = 'ADD PROJECT';
}

function saveProof(){
    const name = getValue('proofName');
    const description = getValue('proofText');
    const fileInput = document.getElementById('proofImageFile');

    if(fileInput.files && fileInput.files[0]){
        const reader = new FileReader();
        reader.onload = function(e){
            const base64Image = e.target.result;
            if(!appData.proofs) appData.proofs = [];
            appData.proofs.unshift({ id: Date.now().toString(36), name, image: base64Image, description });
            saveData();
            clearProofForm();
            renderEverything();
            showToast('Proof Added Successfully!');
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        showToast('Please select a proof image!');
    }
}

function clearProofForm(){
    setValue('proofName', '');
    setValue('proofText', '');
    const fileInput = document.getElementById('proofImageFile');
    if(fileInput) fileInput.value = '';
}

function deleteProof(id){
    if(confirm('Delete this proof?')){
        appData.proofs = appData.proofs.filter(pr => pr.id !== id);
        saveData();
        renderEverything();
        showToast('Proof Deleted!');
    }
}

function resetCustomersCount(){
    if(confirm('Reset customer count to 0?')){
        appData.customers = 0;
        appData.lastUpdateTimestamp = Date.now();
        saveData();
        renderEverything();
        showToast('Customer Count Reset to 0!');
    }
}

function resetProjectsData(){
    if(confirm('Delete ALL Projects from the system?')){
        appData.products = [];
        saveData();
        renderEverything();
        showToast('All Projects Deleted!');
    }
}

function resetModsData(){
    if(confirm('Delete ALL MOD Apps from the system?')){
        appData.mods = [];
        saveData();
        renderEverything();
        showToast('All MOD Apps Deleted!');
    }
}

function resetProofsData(){
    if(confirm('Delete ALL Payment Proofs?')){
        appData.proofs = [];
        saveData();
        renderEverything();
        showToast('All Proofs Cleared!');
    }
}

function resetAllData(){
    if(confirm('WARNING: Reset ALL Projects, Mods, Proofs, and Settings to Default?')){
        localStorage.removeItem('s4g_cheatz_data');
        appData = {  
            products: [],  
            mods: [],
            proofs: [],  
            customers: 0,
            lastUpdateTimestamp: Date.now(),
            settings: { ...defaultSettings }  
        };
        renderEverything();
        showToast('System Completely Restarted!');
    }
}

function buyProduct(id){
    incrementCustomer();
    const p = appData.products.find(item => item.id === id);
    if(!p) return;
    const num = appData.settings.whatsapp;
    if(!num){ showToast('WhatsApp Not Configured!'); return; }

    const msg = `Hello S4G X CHEATZ, I want to buy: ${p.name} (${p.category})`;
    window.open(`https://wa.me/${num.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
}

function getValue(id){ const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function setValue(id, val){ const el = document.getElementById(id); if(el) el.value = val; }
function setText(id, val){ const el = document.getElementById(id); if(el) el.textContent = val; }
function escapeHTML(str){ return String(str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function showToast(msg){
    let t = document.getElementById('toastMsg');
    if(!t){
        t = document.createElement('div');
        t.id = 'toastMsg';
        t.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#008cff; color:#fff; padding:10px 20px; border-radius:8px; font-weight:800; font-size:12px; z-index:999999; box-shadow:0 0 15px rgba(0,140,255,0.5); transition:opacity 0.3s;';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 2000);
}
