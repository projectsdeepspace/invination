(() => {
  const stage = document.getElementById("stage");
  const fxLayer = document.getElementById("fxLayer");
  const toast = document.getElementById("toast");
  const petalField = document.getElementById("ambientPetals");
  const sparkleField = document.getElementById("ambientSparkles");

  const state = {
    screen: 1,
    answers: {
      gift: null,
      dinner: null,
      vibe: null,
      confirm: null
    }
  };

  // ---------- utils ----------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function setToast(msg) {
    toast.textContent = msg || "";
    if (!msg) return;
    clearTimeout(setToast._t);
    setToast._t = setTimeout(() => (toast.textContent = ""), 1500);
  }

  function setDots(n){
    for (let i=1;i<=6;i++){
      const el = document.getElementById("d"+i);
      if (el) el.classList.toggle("on", i === n);
    }
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

  // ---------- ambient fx ----------
  function randomPastel() {
    const colors = ["#ff6b9a", "#7b61ff", "#21b47e", "#ffb55c", "#52c7ff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function spawnAmbientPetal(){
    const p = el("div", "ambientPetal");
    p.style.left = `${Math.random()*100}%`;
    p.style.top = `-20px`;
    p.style.background = randomPastel();
    const dur = 9 + Math.random()*10;
    p.style.animationDuration = `${dur}s`;
    p.style.transform = `rotate(${Math.random()*80}deg)`;
    petalField.appendChild(p);
    setTimeout(() => p.remove(), (dur+0.5)*1000);
  }

  function spawnAmbientSpark(){
    const s = el("div", "spark");
    s.style.left = `${Math.random()*100}%`;
    s.style.top = `-10px`;
    s.style.background = randomPastel();
    const dur = 7 + Math.random()*9;
    s.style.animationDuration = `${dur}s`;
    sparkleField.appendChild(s);
    setTimeout(() => s.remove(), (dur+0.5)*1000);
  }

  setInterval(spawnAmbientPetal, 800);
  setInterval(spawnAmbientSpark, 1050);

  // ---------- particles ----------
  function burst(x, y, kind) {
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

  function petalsFall(durationMs = 1200) {
    const start = performance.now();
    const tick = () => {
      const t = performance.now() - start;
      if (t > durationMs) return;
      for (let i=0;i<2;i++){
        const p = el("div", "particle petal");
        p.style.left = `${Math.random()*100}%`;
        p.style.top = `-20px`;
        p.style.background = randomPastel();
        const dur = 3200 + Math.random()*2200;
        p.style.animation = `floatDown ${dur}ms linear forwards`;
        fxLayer.appendChild(p);
        setTimeout(() => p.remove(), dur+50);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- art ----------
  function girlSVG(){
    return `
      <svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">
        <defs>
          <linearGradient id="hair" x1="0" x2="1">
            <stop offset="0" stop-color="#7b61ff"/>
            <stop offset="1" stop-color="#ff6b9a"/>
          </linearGradient>
          <linearGradient id="dress" x1="0" x2="1">
            <stop offset="0" stop-color="#7b61ff"/>
            <stop offset="1" stop-color="#ff6b9a"/>
          </linearGradient>
        </defs>

        <!-- hair -->
        <path d="M70 24
                 c-22 0-40 15-40 38
                 c0 8 2 15 6 21
                 c4-18 18-31 34-31
                 c16 0 30 13 34 31
                 c4-6 6-13 6-21
                 c0-23-18-38-40-38z"
              fill="url(#hair)" opacity="0.95"/>

        <!-- head -->
        <circle cx="70" cy="58" r="22" fill="#ffe3d8"/>

        <!-- face -->
        <circle cx="62" cy="58" r="2.6" fill="#2b2b33"/>
        <circle cx="78" cy="58" r="2.6" fill="#2b2b33"/>
        <path d="M70 64 c-3 3-6 3-9 0" stroke="#2b2b3370" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="56" cy="66" r="5" fill="#ff6b9a1f"/>
        <circle cx="84" cy="66" r="5" fill="#ff6b9a1f"/>

        <!-- dress -->
        <path d="M70 80
                 c-16 0-28 12-30 28
                 h60
                 c-2-16-14-28-30-28z"
              fill="url(#dress)" opacity="0.92"/>

        <!-- arms -->
        <circle cx="42" cy="102" r="7" fill="#ffe3d8"/>
        <circle cx="98" cy="102" r="7" fill="#ffe3d8"/>
        <path d="M48 98 c8-10 14-14 22-14" stroke="#2b2b3320" stroke-width="6" stroke-linecap="round"/>
        <path d="M92 98 c-8-10-14-14-22-14" stroke="#2b2b3320" stroke-width="6" stroke-linecap="round"/>
      </svg>
    `;
  }

  function cornerArt(){
    const art = el("div","cornerArt");

    const girl = el("div","girlCard");
    girl.innerHTML = girlSVG();

    const title = el("div","travelBadge");
    title.innerHTML = `<div class="travelText">Алёна путешественница ✈️</div>`;

    art.appendChild(girl);
    art.appendChild(title);
    return art;
  }

  // ---------- drag screen builder ----------
  function buildDragScreen({
    title,
    subtitle,
    options, // [{key, emoji, fx:'petals'|'warm'|'shimmer'|'confetti'}]
    answerField,
    nextScreen,
    nextLabel = "Дальше",
    toastOnPick = "Принято ✨"
  }){
    const root = el("div","screen");
    root.appendChild(el("h1","title",{text:title}));
    if (subtitle) root.appendChild(el("p","sub",{text:subtitle}));

    const board = el("div","dragBoard");

    const avatar = el("div","avatar");
    avatar.appendChild(el("div","label",{text:"Алёна"}));

    const girl = el("div","avatarGirl");
    girl.innerHTML = girlSVG();
    avatar.appendChild(girl);

    const target = el("div","dropTarget", { tabindex:"0" });
    target.innerHTML = `<div class="dropLabel">перетащи сюда<small>к Алёне ✨</small></div>`;
    avatar.appendChild(target);

    const items = el("div","items");
    const grid = el("div","itemGrid");

    let chosen = false;
    let ghostEl = null;
    let activeDrag = null;

    function acceptPick(key, fxKind, dropPoint){
      if (chosen) return;
      chosen = true;
      state.answers[answerField] = key;

      const aRect = avatar.getBoundingClientRect();
      const centerX = Math.round(aRect.left + aRect.width * 0.62);
      const centerY = Math.round(aRect.top + aRect.height * 0.52);

      const x = dropPoint?.x ?? centerX;
      const y = dropPoint?.y ?? centerY;

      if (fxKind === "petals"){
        burst(x,y,"confetti");
        petalsFall(1100);
      } else if (fxKind === "warm"){
        burst(x,y,"confetti");
      } else if (fxKind === "shimmer"){
        const shim = el("div","shimmer");
        avatar.appendChild(shim);
        setTimeout(() => shim.remove(), 1200);
      } else {
        burst(x,y,"confetti");
      }

      setToast(toastOnPick);
      showNext();
    }

    options.forEach(opt => {
      const d = el("div","draggable iconOnly",{ "data-key": opt.key, role:"button", tabindex:"0" });
      d.innerHTML = `<div class="emoji" aria-hidden="true">${opt.emoji}</div>`;

      // tap to choose (mobile-friendly)
      d.addEventListener("click", () => {
        const rect = avatar.getBoundingClientRect();
        acceptPick(opt.key, opt.fx, { x: rect.left + rect.width*0.65, y: rect.top + rect.height*0.55 });
      });

      // keyboard
      d.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          d.click();
        }
      });

      // drag
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
        ghostEl.style.height = `${rect.height}px`;
        ghostEl.style.zIndex = "9999";
        ghostEl.style.pointerEvents = "none";
        document.body.appendChild(ghostEl);

        activeDrag = { key: opt.key, fx: opt.fx, shiftX, shiftY };
        target.classList.add("ready");
      });

      d.addEventListener("pointermove", (e) => {
        if (!activeDrag || !ghostEl) return;
        ghostEl.style.left = `${e.clientX - activeDrag.shiftX}px`;
        ghostEl.style.top = `${e.clientY - activeDrag.shiftY}px`;
      });

      async function endDrag(e){
        if (!activeDrag) return;
        target.classList.remove("ready");

        const tRect = avatar.getBoundingClientRect();
        const inside = e.clientX >= tRect.left && e.clientX <= tRect.right && e.clientY >= tRect.top && e.clientY <= tRect.bottom;

        const dropPoint = { x: e.clientX, y: e.clientY };
        if (ghostEl) ghostEl.remove();
        ghostEl = null;

        const { key, fx } = activeDrag;
        activeDrag = null;

        if (inside && !chosen){
          acceptPick(key, fx, dropPoint);
        } else {
          setToast("Чуть-чуть ниже — прямо к Алёне 🙂");
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
    root.appendChild(panel);

    const nextWrap = el("div","btnRow");
    const nextBtn = button(nextLabel,"next", () => renderScreen(nextScreen), nextLabel);
    nextBtn.style.display = "none";
    nextWrap.appendChild(nextBtn);
    root.appendChild(nextWrap);

    root.appendChild(cornerArt());

    function showNext(){
      nextBtn.style.display = "block";
      nextBtn.focus();
    }

    return root;
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
    root.appendChild(el("p","sub",{text:"Сделаем пару шагов — и будет сюрприз ✨"}));

    root.appendChild(cornerArt());

    const panel = el("div","panel");
    panel.appendChild(button("Начать","primary", () => renderScreen(2), "Начать квест"));
    root.appendChild(panel);
    return root;
  }

  function screen2(){
    return buildDragScreen({
      title: "Перед тем как получить сюрприз, давай убедимся —\nты действительно та самая Алёна?",
      subtitle: "Перетащи одну иконку к Алёне.",
      options: [
        { key:"flowers", emoji:"🌸", fx:"petals" },
        { key:"brush", emoji:"🎨", fx:"warm" },
        { key:"book", emoji:"📖", fx:"shimmer" },
      ],
      answerField: "gift",
      nextScreen: 3,
      toastOnPick: "Окей 🙂"
    });
  }

  function screen3(){
    return buildDragScreen({
      title: "Какой ужин тебе ближе?",
      subtitle: "Выбери и перетащи к Алёне.",
      options: [
        { key:"fish", emoji:"🐟", fx:"confetti" },
        { key:"meat", emoji:"🥩", fx:"confetti" },
      ],
      answerField: "dinner",
      nextScreen: 4,
      toastOnPick: "Супер ✨"
    });
  }

  function screen4(){
    return buildDragScreen({
      title: "Атмосфера вечера — это скорее…",
      subtitle: "Перетащи атмосферу к Алёне.",
      options: [
        { key:"cozy", emoji:"🕯️", fx:"warm" },
        { key:"elegant", emoji:"✨", fx:"confetti" },
        { key:"free", emoji:"🌿", fx:"petals" },
      ],
      answerField: "vibe",
      nextScreen: 5,
      toastOnPick: "Пусть будет так ✨"
    });
  }

  function screen5(){
    return buildDragScreen({
      title: "Кажется, вечер сложился.",
      subtitle: "Хочешь узнать детали? Перетащи ответ к Алёне.",
      options: [
        { key:"yes", emoji:"✅", fx:"confetti" },
        { key:"ofc", emoji:"💛", fx:"petals" },
      ],
      answerField: "confirm",
      nextScreen: 6,
      nextLabel: "Узнать",
      toastOnPick: "Открываем ✨"
    });
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
    panel.appendChild(el("p","hint",{text:"Можно поделиться ссылкой или просто сохранить у себя 🌸"}));

    const actions = el("div","finalActions");
    const saveBtn = button("Сохранить","primary", () => {
      const rect = saveBtn.getBoundingClientRect();
      burst(rect.left + rect.width/2, rect.top + rect.height/2, "confetti");
      petalsFall(900);
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
          setToast("Не получилось 😅");
        }
      }
    }, "Поделиться");

    const restartBtn = button("С начала","", () => {
      state.answers = { gift:null, dinner:null, vibe:null, confirm:null };
      renderScreen(1);
      setToast("Поехали заново 🙂");
    }, "С начала");

    actions.appendChild(saveBtn);
    actions.appendChild(shareBtn);
    actions.appendChild(restartBtn);
    panel.appendChild(actions);

    root.appendChild(panel);
    root.appendChild(cornerArt());

    setTimeout(() => {
      const rect = box.getBoundingClientRect();
      burst(rect.left + rect.width*0.6, rect.top + 40, "confetti");
      petalsFall(900);
    }, 200);

    return root;
  }

  renderScreen(1);
})();