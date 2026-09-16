const root = document.getElementById('root');
const icons = { home:'⌂', scan:'📷', car:'🚗', trophy:'🏆', user:'👤', shield:'✓', gift:'🎁', wallet:'▣', search:'⌕', settings:'⚙', alert:'⚠', chart:'▥' };
const vehicles = [
  { icon: '🚗', name: 'Swift', plate: 'UP85AB1234', litres: 42.6, spend: 4310, points: 43 },
  { icon: '🏍️', name: 'Bike', plate: 'UP85CD5678', litres: 18.2, spend: 1845, points: 18 }
];
const offers = [
  { icon: '🔥', title: 'Weekend Bonus', desc: 'Earn 2X points on Saturday & Sunday', tag: '2X points' },
  { icon: '⛽', title: 'Fuel Saver', desc: 'Bonus points after three qualifying purchases', tag: 'Milestone' },
  { icon: '🎁', title: 'Monthly Reward', desc: 'Unlock surprise rewards every month', tag: 'New' }
];
function userApp(){return `
  <div class="phone-shell">
    <header class="hero">
      <div class="topline"><span class="brand-mark"><b>F</b> FuelPulse</span><span class="secure">${icons.shield} Device secured</span></div>
      <p>Good Morning 👋</p>
      <h1>Your Points</h1>
      <div class="points">1,250 <small>pts</small></div>
      <button class="scan">${icons.scan} Scan Parchi</button>
      <p class="trust">Your reward is issued only after secure station verification.</p>
    </header>
    <section class="quick-grid"><button>${icons.scan}<span>Scan</span></button><button>${icons.car}<span>Add Vehicle</span></button><button>${icons.wallet}<span>History</span></button><button>${icons.gift}<span>Offers</span></button></section>
    <section class="card"><div class="section-title"><h2>Your Vehicles</h2><a>Manage</a></div>${vehicles.map(v=>`<article class="vehicle"><span>${v.icon}</span><div><strong>${v.name}</strong><small>${v.plate}</small></div><b>${v.points} pts</b></article>`).join('')}</section>
    <section class="card scan-flow"><div class="card-kicker">SECURE VERIFICATION</div><h2>Scan your Parchi</h2><p class="muted">Take a clear photo of your fuel receipt. We check it against the station transaction before awarding points.</p><div class="receipt-frame">${icons.scan}<strong>Tap to scan receipt</strong><span>Keep the full Parchi inside the frame</span></div><div class="steps"><div><b>1</b><span>Capture</span></div><div><b>2</b><span>Read</span></div><div><b>3</b><span>Verify</span></div></div><button class="primary">Start secure scan</button></section>
    <section class="card success-card"><div class="success-head"><span class="check">✓</span><div><h2>Parchi Verified</h2><small>Points added securely</small></div></div><div class="success-grid"><span>Fuel</span><b>Petrol</b><span>Amount</span><b>₹350</b><span>Volume</span><b>3.45 L</b><span>Points</span><b class="green">+3</b><span>Vehicle</span><b>UP85AB1234</b><span>Invoice</span><b>••••5163</b></div></section>
    <section class="card"><div class="section-title"><h2>Featured Offers</h2><a>See all</a></div>${offers.map(o=>`<article class="offer"><span>${o.icon}</span><div><strong>${o.title}</strong><small>${o.desc}</small></div><em>${o.tag}</em></article>`).join('')}</section>
    <nav class="bottom-nav"><a class="active">${icons.home}<span>Home</span></a><a>${icons.scan}<span>Scan</span></a><a>${icons.car}<span>Vehicles</span></a><a>${icons.trophy}<span>Points</span></a><a>${icons.user}<span>Profile</span></a></nav>
  </div>`}
function metric(label,value,warn=''){return `<div class="metric ${warn}"><small>${label}</small><strong>${value}</strong></div>`}
function managerApp(){return `<main class="dashboard"><header><div><p class="eyebrow">MANAGER</p><h1>Fraud & Verification</h1></div><button class="primary compact">${icons.search} Search transactions</button></header><div class="metrics">${metric("Today's Sales",'₹84,250')}${metric('Verified Parchis','186')}${metric('Pending Reviews','12','warn')}${metric('Points Issued','842')}</div><section class="panel"><h2>Review Queue</h2>${['Vehicle mismatch','Mobile mismatch','Expired receipt','Duplicate redemption attempt'].map((x,i)=>`<div class="review"><span>${icons.alert}</span><div><strong>${x}</strong><small>Invoice ••••${5163+i} · UP85AB1234 · masked mobile</small></div><button>Review</button></div>`).join('')}</section></main>`}
function control(label,value){return `<div class="control"><span>${label}</span><b>${value}</b></div>`}
function ownerApp(){return `<main class="dashboard"><header><div><p class="eyebrow">OWNER</p><h1>FuelPulse Control Center</h1></div><button class="primary compact">${icons.settings} Settings</button></header><div class="metrics owner">${metric('Total Users','4,820')}${metric('Fuel Revenue','₹12.4L')}${metric('Litres','12,960')}${metric('Fraud Rate','1.8%','warn')}${metric('Points Issued','41,200')}${metric('Offers','8')}</div><section class="panel"><h2>Owner Controls</h2><div class="settings-grid">${control('Receipt validity','20 minutes')}${control('Points per litre','1')}${control('Mobile mismatch','Reject')}${control('Manual review','Enabled')}</div><div class="chart"><span>${icons.chart}</span><span>Station performance and fraud statistics</span></div></section></main>`}
function render(role='USER'){root.innerHTML = role === 'USER' ? userApp() : role === 'MANAGER' ? managerApp() : ownerApp();document.querySelectorAll('.role-switch button').forEach(b=>b.classList.toggle('selected',b.dataset.role===role));}
document.querySelectorAll('.role-switch button').forEach(b=>b.addEventListener('click',()=>render(b.dataset.role)));
render('USER');
