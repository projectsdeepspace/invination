(() => {
  const stage = document.getElementById("stage");
  const fxLayer = document.getElementById("fxLayer");
  const toast = document.getElementById("toast");
  const toggleMotionBtn = document.getElementById("toggleMotion");
  const petalField = document.getElementById("ambientPetals");
  const sparkleField = document.getElementById("ambientSparkles");

  const state = {
    screen: 1,
    answers: {
      gift: null,
      dinner: null,
      vibe: null,
      confirm: null
    },
    motionEnabled: true,
  };

  // ---------- utilities ----------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function setToast(msg) {
    toast.textContent = msg;
    if (!msg) return;
    clearTimeout(setToast._t);
    setToast._t = setTimeout(() => (toast.textContent = ""), 1800);
  }

  function setDots(n){
    for (let i=1;i<=6;i++){
      const el = document.getElementById("d"+i);
      if (!el) continue;
      el.classList.toggle("on", i === n);
    }
  }

  function renderScreen(nextScreen) {
    state.screen = nextScreen;
    setDots(nextScreen);

    const prev = stage.firstElementChild;
    if (prev) prev.classList.add("fadeOut");

    (async () => {
      if (prev) await sleep(170);
      stage.innerHTML = "";
      const node = buildScreen(nextScreen);
      node.classList.add("fadeIn");
      stage.appendChild(node);
    })();
  }

  function el(tag, cls, attrs = {}) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    return node;
  }

  function button(text, cls, onClick, ariaLabel) {
    const b = el("button", `btn ${cls || ""}`.trim(), { type: "button" });
    b.textContent = text;
    if (ariaLabel) b.setAttribute("aria-label", ariaLabel);
    b.addEventListener("click", onClick);
    return b;
  }

  // ---------- ambient fx ----------
  function randomPastel() {
    const colors = ["#ff6b9a", "#7b61ff", "#21b47e", "#ffb55c", "#52c7ff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function spawnAmbientPetal(){
    if (!state.motionEnabled) return;
    const p = el("div", "ambientPetal");
    p.style.left = `${Math.random()*100}%`;
    p.style.top = `-20px`;
    p.style.background = randomPastel();
    p.style.filter = "blur(0.2px)";
    const dur = 9 + Math.random()*10;
    p.style.animationDuration = `${dur}s`;
    p.style.transform = `rotate(${Math.random()*80}deg)`;
    petalField.appendChild(p);
    setTimeout(() => p.remove(), (dur+0.5)*1000);
  }

  function spawnAmbientSpark(){
    if (!state.motionEnabled) return;
    const s = el("div", "spark");
    s.style.left = `${Math.random()*100}%`;
    s.style.top = `-10px`;
    s.style.background = randomPastel();
    const dur = 7 + Math.random()*9;
    s.style.animationDuration = `${dur}s`;
    sparkleField.appendChild(s);
    setTimeout(() => s.remove(), (dur+0.5)*1000);
  }

  setInterval(spawnAmbientPetal, 750);
  setInterval(spawnAmbientSpark, 980);

  toggleMotionBtn.addEventListener("click", () => {
    state.motionEnabled = !state.motionEnabled;
    setToast(state.motionEnabled ? "Анимации включены ✨" : "Анимации выключены 🌿");
  });

  // ---------- particles ----------
  function burst(x, y, kind) {
    if (!state.motionEnabled) return;

    const count = kind === "confetti" ? 26 : 18;
    for (let i=0;i<count;i++){
      const p = el("div", `particle ${kind === "petal" ? "petal" : ""}`);
      p.style.background = randomPastel();

      const angle = Math.random() * Math.PI * 2;
      const dist = (kind === "confetti" ? 120 : 90) * (0.35 + Math.random());
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist + (kind === "confetti" ? 30 : 10);

      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty("--dx", `${dx}px`);
      p.style.setProperty("--dy", `${dy}px`);

      if (kind === "petal") {
        p.style.width = `${8 + Math.random()*8}px`;
        p.style.height = `${10 + Math.random()*10}px`;
        p.style.borderRadius = "12px";
        p.style.transform = `rotate(${Math.random()*180}deg)`;
      }

      const dur = 650 + Math.random()*450;
      p.style.animation = `burst ${dur}ms ease-out forwards`;

      fxLayer.appendChild(p);
      setTimeout(() => p.remove(), dur + 50);
    }
  }

  function petalsFall(durationMs = 1400) {
    if (!state.motionEnabled) return;
    const start = performance.now();
    const tick = () => {
      const t = performance.now() - start;
      if (t > durationMs) return;
      for (let i=0;i<2;i++){
        const p = el("div", "particle petal");
        p.style.left = `${Math.random()*100}%`;
        p.style.top = `-20px`;
        p.style.background = randomPastel();
        const dur = 3500 + Math.random()*2500;
        p.style.animation = `floatDown ${dur}ms linear forwards`;
        fxLayer.appendChild(p);
        setTimeout(() => p.remove(), dur+50);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- screens ----------
  function buildScreen(n){
    switch(n){
      case 1: return screen1();
      case 2: return screen2();
      case 3: return screen3();
      case 4: return screen4();
      case 5: return screen5();
      case 6: return screen6();
      default: return screen1();
    }
  }

  function screen1(){
    const root = el("div","screen");
    root.appendChild(el("h1","title",{text:"Небольшое путешествие начинается…"}));
    root.appendChild(el("p","sub",{text:"Нужно пройти пару шагов.\nВ конце — кое-что приятное."}));

    const art = cornerArt();
    root.appendChild(art);

    const panel = el("div","panel");
    panel.appendChild(button("Начать","primary", () => renderScreen(2), "Начать квест"));
    root.appendChild(panel);
    return root;
  }

  function screen2(){
    const root = el("div","screen");
    root.appendChild(el("h1","title",{text:"Перед тем как получить сюрприз, давай убедимся — ты действительно та самая Алёна?"}));
    root.appendChild(el("p","sub",{text:"Перетащи предмет к персонажу."}));

    const board = el("div","dragBoard");

    const avatar = el("div","avatar");
    avatar.appendChild(el("div","label",{text:"Алёна"}));
    const girl = el("div","avatarGirl");
    girl.innerHTML = girlSVG();
    avatar.appendChild(girl);
    const target = el("div","dropTarget", { tabindex:"0" });
    target.innerHTML = "сюда ✨<br><span style='font-weight:700;opacity:.85'>перетащи</span>";
    avatar.appendChild(target);

    const items = el("div","items");
    items.appendChild(el("div","hint",{text:"Варианты:"}));
    const grid = el("div","itemGrid");

    const options = [
      { key:"flowers", emoji:"🌸", title:"Цветы" },
      { key:"brush", emoji:"🎨", title:"Кисть" },
      { key:"book", emoji:"📖", title:"Книга" },
    ];

    let chosen = false;
    let ghostEl = null;
    let activeDrag = null;

    options.forEach(opt => {
      const d = el("div","draggable",{ "data-key": opt.key, role:"button", tabindex:"0" });
      d.innerHTML = `
        <div class="emoji" aria-hidden="true">${opt.emoji}</div>
        <b>${opt.title}</b>
      `;

      d.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (chosen) return;
          pickGift(opt.key, target, avatar, () => {
            chosen = true;
            showNext();
          }, { x: avatar.getBoundingClientRect().left + avatar.getBoundingClientRect().width/2,
               y: avatar.getBoundingClientRect().top + 120 });
        }
      });

      d.addEventListener("pointerdown", (e) => {
        if (chosen) return;
        e.preventDefault();
        d.setPointerCapture(e.pointerId);

        const rect = d.getBoundingClientRect();
        const shiftX = e.clientX - rect.left;
        const shiftY = e.clientY - rect.top;

        ghostEl = d.cloneNode(true);
        ghostEl.classList.add("ghost");
        ghostEl.style.position = "fixed";
        ghostEl.style.left = `${rect.left}px`;
        ghostEl.style.top = `${rect.top}px`;
        ghostEl.style.width = `${rect.width}px`;
        ghostEl.style.zIndex = "9999";
        ghostEl.style.pointerEvents = "none";
        document.body.appendChild(ghostEl);

        activeDrag = { key: opt.key, shiftX, shiftY };
        target.classList.add("ready");
      });

      d.addEventListener("pointermove", (e) => {
        if (!activeDrag || !ghostEl) return;
        const x = e.clientX - activeDrag.shiftX;
        const y = e.clientY - activeDrag.shiftY;
        ghostEl.style.left = `${x}px`;
        ghostEl.style.top = `${y}px`;
      });

      async function endDrag(e){
        if (!activeDrag) return;
        target.classList.remove("ready");

        const tRect = target.getBoundingClientRect();
        const inside = e.clientX >= tRect.left && e.clientX <= tRect.right && e.clientY >= tRect.top && e.clientY <= tRect.bottom;

        const dropPoint = { x: e.clientX, y: e.clientY };
        if (ghostEl) ghostEl.remove();
        ghostEl = null;

        const key = activeDrag.key;
        activeDrag = null;

        if (inside && !chosen){
          chosen = true;
          pickGift(key, target, avatar, () => showNext(), dropPoint);
        } else {
          setToast("Почти! Попробуй перетащить на персонажа 🐰");
        }
      }

      d.addEventListener("pointerup", endDrag);
      d.addEventListener("pointercancel", endDrag);

      grid.appendChild(d);
    });

    items.appendChild(grid);

    board.appendChild(avatar);
    board.appendChild(items);

    const panel = el("div","panel");
    panel.appendChild(board);
    panel.appendChild(el("p","hint",{text:"Любой вариант — правильный 💛"}));

    root.appendChild(panel);

    const nextWrap = el("div", "btnRow");
    const nextBtn = button("Дальше", "next", () => renderScreen(3), "Дальше");
    nextBtn.style.display = "none";
    nextWrap.appendChild(nextBtn);
    root.appendChild(nextWrap);

    function showNext(){
      nextBtn.style.display = "block";
      nextBtn.focus();
    }

    target.addEventListener("click", () => {
      if (!chosen) setToast("Выбери предмет и перетащи сюда ✨");
    });

    return root;
  }

  function pickGift(key, target, avatar, done, dropPoint){
    state.answers.gift = key;

    const aRect = avatar.getBoundingClientRect();
    const centerX = Math.round(aRect.left + aRect.width * 0.62);
    const centerY = Math.round(aRect.top + aRect.height * 0.58);

    const labelMap = { flowers:"🌸 Цветы", brush:"🎨 Кисть", book:"📖 Книга" };
    target.innerHTML = `выбрано: <b style="color:#2b2b33">${labelMap[key]}</b>`;

    if (key === "flowers"){
      burst(dropPoint?.x ?? centerX, dropPoint?.y ?? centerY, "confetti");
      petalsFall(1400);
      setToast("Цветы! 🌸");
    } else if (key === "brush"){
      const ring = el("div","glowRing");
      ring.style.left = "58%";
      ring.style.top = "56%";
      ring.style.animation = "glowPulse 1.2s ease-out 0s 1";
      avatar.appendChild(ring);
      setTimeout(() => ring.remove(), 1250);
      setToast("Тепло и уютно 🎨");
    } else {
      const shim = el("div","shimmer");
      avatar.appendChild(shim);
      setTimeout(() => shim.remove(), 1400);
      setToast("Книга — мягкое мерцание 📖");
    }

    setTimeout(done, 650);
  }

  function screen3(){
    const root = el("div","screen");
    root.appendChild(el("h1","title",{text:"Какой ужин тебе ближе?"}));

    const group = el("div","choiceGroup");
    const a = choice("👩‍🍳 Приготовим вместе", "together");
    const b = choice("🍷 Приготовлю я", "me");

    group.appendChild(a);
    group.appendChild(b);

    const panel = el("div","panel");
    panel.appendChild(group);
    root.appendChild(panel);

    const nextBtn = button("Дальше","next", () => renderScreen(4), "Дальше");
    nextBtn.disabled = true;
    root.appendChild(nextBtn);

    function select(key){
      state.answers.dinner = key;
      [a,b].forEach(x => x.classList.remove("selected"));
      (key === "together" ? a : b).classList.add("selected");
      nextBtn.disabled = false;
      setToast("Принято 💛");
    }

    a.addEventListener("click", () => select("together"));
    b.addEventListener("click", () => select("me"));


    return root;
  }

  function screen4(){
    const root = el("div","screen");
    root.appendChild(el("h1","title",{text:"Атмосфера вечера — это скорее…"}));

    const group = el("div","choiceGroup");
    const c1 = choice("🕯 Уютно", "cozy");
    const c2 = choice("✨ Элегантно", "elegant");
    const c3 = choice("🌿 Свободно", "free");

    group.appendChild(c1);
    group.appendChild(c2);
    group.appendChild(c3);

    const panel = el("div","panel");
    panel.appendChild(group);
    root.appendChild(panel);

    const nextBtn = button("Дальше","next", () => renderScreen(5), "Дальше");
    nextBtn.disabled = true;
    root.appendChild(nextBtn);

    function select(key){
      state.answers.vibe = key;
      [c1,c2,c3].forEach(x => x.classList.remove("selected"));
      const pick = key === "cozy" ? c1 : key === "elegant" ? c2 : c3;
      pick.classList.add("selected");
      nextBtn.disabled = false;

      if (state.motionEnabled){
        const rect = pick.getBoundingClientRect();
        burst(rect.left + rect.width*0.7, rect.top + rect.height*0.5, "confetti");
      }
      setToast("Пусть будет так ✨");
    }

    c1.addEventListener("click", () => select("cozy"));
    c2.addEventListener("click", () => select("elegant"));
    c3.addEventListener("click", () => select("free"));

    return root;
  }

  function screen5(){
    const root = el("div","screen");
    root.appendChild(el("h1","title",{text:"Кажется, вечер сложился."}));
    root.appendChild(el("p","sub",{text:"Хочешь узнать детали?"}));

    const panel = el("div","panel");
    const row = el("div","btnRow");
    row.appendChild(button("Да","primary", () => { state.answers.confirm="yes"; renderScreen(6); }, "Да"));
    row.appendChild(button("Конечно","primary", () => { state.answers.confirm="ofc"; renderScreen(6); }, "Конечно"));
    panel.appendChild(row);
    root.appendChild(panel);

    root.appendChild(cornerArt());
    return root;
  }

  function screen6(){
    const root = el("div","screen");
    root.appendChild(el("h1","title",{text:"✨"}));

    const finalText =
`Ты приглашена на домашний ужин.

📅 Дата: с 22 февраля
🕖 Время: обговаривается
🏠 Место: моя квартира

Буду рад провести этот вечер вместе.`;

    const box = el("div","finalBox", { text: finalText });
    root.appendChild(box);

    const panel = el("div","panel");
    panel.appendChild(el("p","hint",{text:"Можно поделиться ссылкой или просто сохранить у себя ✨"}));

    const actions = el("div","finalActions");
    const saveBtn = button("Сохранить","primary", () => {
      if (state.motionEnabled){
        const rect = saveBtn.getBoundingClientRect();
        burst(rect.left + rect.width/2, rect.top + rect.height/2, "confetti");
        petalsFall(900);
      }
      setToast("Сохранено 💛");
    }, "Сохранить");

    const shareBtn = button("Поделиться","", async () => {
      const url = window.location.href;
      const text = "У меня для тебя маленькая открытка ✨";
      try{
        if (navigator.share){
          await navigator.share({ title: "Открытка", text, url });
          setToast("Отправлено ✨");
        } else {
          await navigator.clipboard.writeText(url);
          setToast("Ссылка скопирована 📎");
        }
      } catch(e){
        try{
          await navigator.clipboard.writeText(url);
          setToast("Ссылка скопирована 📎");
        } catch(_) {
          setToast("Не получилось скопировать 😅");
        }
      }
    }, "Поделиться");

    const restartBtn = button("С начала","", () => {
      state.answers = { gift:null, dinner:null, vibe:null, confirm:null };
      renderScreen(1);
      setToast("Поехали заново ✨");
    }, "С начала");

    actions.appendChild(saveBtn);
    actions.appendChild(shareBtn);
    actions.appendChild(restartBtn);
    panel.appendChild(actions);

    root.appendChild(panel);

    root.appendChild(cornerArt());

    if (state.motionEnabled){
      setTimeout(() => {
        const rect = box.getBoundingClientRect();
        burst(rect.left + rect.width*0.6, rect.top + 40, "confetti");
        petalsFall(900);
      }, 200);
    }

    return root;
  }

  function choice(label, key){
    const c = el("div","choice", { role:"button", tabindex:"0", "data-key": key });
    c.innerHTML = `
      <div class="left">
        <span class="badge" aria-hidden="true">✨</span>
        <span>${label}</span>
      </div>
      <div class="tick" aria-hidden="true">✓</div>
    `;
    c.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.click(); }
    });
    return c;
  }

  function cornerArt(){
    const art = el("div","cornerArt");

    const girlCard = el("div","girlCard");
    girlCard.innerHTML = girlSVG();

    const badge = el("div","travelBadge");
    badge.innerHTML = `<div class="travelText">Алёна путешественница ✈️</div>`;

    if (state.motionEnabled){
      girlCard.animate([{transform:"translateY(0)"},{transform:"translateY(-3px)"},{transform:"translateY(0)"}],
        { duration: 2200, iterations: Infinity, easing: "ease-in-out" });
      badge.animate([{transform:"translateY(0)"},{transform:"translateY(-2px)"},{transform:"translateY(0)"}],
        { duration: 2400, iterations: Infinity, easing: "ease-in-out" });
    }

    art.appendChild(girlCard);
    art.appendChild(badge);
    return art;
  }

  function girlSVG(){
    return `
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
        <defs>
          <linearGradient id="dress" x1="0" x2="1">
            <stop offset="0" stop-color="#ff6b9a"/>
            <stop offset="1" stop-color="#7b61ff"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="120" height="120" fill="none"/>
        <circle cx="60" cy="38" r="18" fill="#ffe3d8" stroke="#00000014"/>
        <path d="M42 36 C46 18, 74 18, 78 36" fill="#2b2b3322"/>
        <path d="M45 58 C52 48, 68 48, 75 58 L84 96 C84 102, 36 102, 36 96 Z" fill="url(#dress)" opacity="0.95"/>
        <circle cx="54" cy="38" r="2.2" fill="#2b2b33"/>
        <circle cx="66" cy="38" r="2.2" fill="#2b2b33"/>
        <path d="M60 44 C58 46, 62 46, 60 44 Z" fill="#ff6b9a88"/>
        <path d="M53 46 C57 50, 63 50, 67 46" fill="none" stroke="#2b2b3370" stroke-width="2" stroke-linecap="round"/>
        <path d="M34 66 C28 74, 28 84, 36 90" fill="none" stroke="#2b2b3320" stroke-width="6" stroke-linecap="round"/>
        <path d="M86 66 C92 74, 92 84, 84 90" fill="none" stroke="#2b2b3320" stroke-width="6" stroke-linecap="round"/>
        <circle cx="28" cy="90" r="6" fill="#ffb55c55"/>
        <circle cx="92" cy="90" r="6" fill="#52c7ff55"/>
      </svg>
    `;
  }

  function bunnySVG(){
    return `
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#fff2f6"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="120" height="120" fill="none"/>
        <ellipse cx="44" cy="26" rx="12" ry="22" fill="url(#g1)" stroke="#00000014"/>
        <ellipse cx="74" cy="26" rx="12" ry="22" fill="url(#g1)" stroke="#00000014"/>
        <ellipse cx="44" cy="28" rx="6" ry="15" fill="#ff6b9a22"/>
        <ellipse cx="74" cy="28" rx="6" ry="15" fill="#ff6b9a22"/>
        <circle cx="60" cy="62" r="30" fill="url(#g1)" stroke="#00000014"/>
        <circle cx="46" cy="70" r="7" fill="#ff6b9a1f"/>
        <circle cx="74" cy="70" r="7" fill="#ff6b9a1f"/>
        <circle cx="50" cy="60" r="3.5" fill="#2b2b33"/>
        <circle cx="70" cy="60" r="3.5" fill="#2b2b33"/>
        <circle cx="49" cy="59" r="1.2" fill="#fff"/>
        <circle cx="69" cy="59" r="1.2" fill="#fff"/>
        <path d="M60 67 C57 65, 63 65, 60 67 Z" fill="#ff6b9a88"/>
        <path d="M60 67 C59 72, 54 73, 52 71" fill="none" stroke="#2b2b3370" stroke-width="2" stroke-linecap="round"/>
        <path d="M60 67 C61 72, 66 73, 68 71" fill="none" stroke="#2b2b3370" stroke-width="2" stroke-linecap="round"/>
        <g transform="translate(18 90)">
          <circle cx="12" cy="10" r="3" fill="#ffb55c"/>
          <circle cx="8" cy="8" r="4" fill="#7b61ff55"/>
          <circle cx="16" cy="8" r="4" fill="#ff6b9a55"/>
          <circle cx="8" cy="14" r="4" fill="#21b47e55"/>
          <circle cx="16" cy="14" r="4" fill="#52c7ff55"/>
        </g>
      </svg>
    `;
  }

  function flowerSVG(){
    return `
      <svg viewBox="0 0 220 110" width="220" height="110" aria-hidden="true">
        <defs>
          <linearGradient id="fbg" x1="0" x2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#f5fbff"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="220" height="110" rx="22" fill="url(#fbg)"/>
        <g opacity="0.95">
          <g transform="translate(35 55)">
            <circle cx="0" cy="0" r="8" fill="#ffb55c"/>
            <circle cx="-10" cy="-10" r="12" fill="#ff6b9a33"/>
            <circle cx="10" cy="-10" r="12" fill="#7b61ff33"/>
            <circle cx="-10" cy="10" r="12" fill="#21b47e33"/>
            <circle cx="10" cy="10" r="12" fill="#52c7ff33"/>
          </g>
          <g transform="translate(110 48)">
            <circle cx="0" cy="0" r="7" fill="#ffb55c"/>
            <circle cx="-9" cy="-9" r="10" fill="#7b61ff2b"/>
            <circle cx="9" cy="-9" r="10" fill="#ff6b9a2b"/>
            <circle cx="-9" cy="9" r="10" fill="#52c7ff2b"/>
            <circle cx="9" cy="9" r="10" fill="#21b47e2b"/>
          </g>
          <g transform="translate(175 62)">
            <circle cx="0" cy="0" r="6.5" fill="#ffb55c"/>
            <circle cx="-8" cy="-8" r="9" fill="#21b47e2b"/>
            <circle cx="8" cy="-8" r="9" fill="#52c7ff2b"/>
            <circle cx="-8" cy="8" r="9" fill="#ff6b9a2b"/>
            <circle cx="8" cy="8" r="9" fill="#7b61ff2b"/>
          </g>
        </g>
        <text x="110" y="98" text-anchor="middle"
              font-family="Nunito, system-ui, sans-serif"
              font-weight="800" font-size="14" fill="#2b2b33" opacity="0.8">
          нежно и мило 🌸
        </text>
      </svg>
    `;
  }

  renderScreen(1);
})();