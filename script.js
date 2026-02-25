// ============================
// CONFIG (EDITAR)
// ============================

// WhatsApp destino (Perú). Reemplaza con el número real (sin +, sin espacios).
// Ejemplo: "51987654321"
const WHATSAPP_NUMBER = "51000000000";

// Servicios (Catálogo + selector en Home)
const SERVICES = [
  {
    name: "Corte Express",
    duration: "30 min",
    includes: ["Diagnóstico rápido", "Corte + terminación", "Tip de mantenimiento"],
    tags: ["Express", "Agenda rápida"]
  },
  {
    name: "Corte + Lavado",
    duration: "45 min",
    includes: ["Lavado", "Corte", "Secado básico"],
    tags: ["Clásico", "Cuidado"]
  },
  {
    name: "Brushing / Peinado Finish",
    duration: "45–60 min",
    includes: ["Protección térmica (si aplica)", "Peinado", "Fijación ligera"],
    tags: ["Evento", "Terminación"]
  },
  {
    name: "Color (Raíz o Parcial)",
    duration: "60–90 min",
    includes: ["Diagnóstico", "Aplicación", "Registro de fórmula"],
    tags: ["Color", "Mantenimiento"]
  },
  {
    name: "Manicure",
    duration: "45 min",
    includes: ["Higiene", "Limpieza", "Terminación"],
    tags: ["Detalles", "Prolijo"]
  },
  {
    name: "Pedicure",
    duration: "60 min",
    includes: ["Higiene", "Cuidado", "Terminación"],
    tags: ["Cuidado", "Calma"]
  },
  {
    name: "Servicio Kids (Corte niño/a)",
    duration: "30 min",
    includes: ["Acompañamiento", "Corte", "Validación con tutor"],
    tags: ["Kids", "Rápido"]
  }
];

// ============================
// Helpers
// ============================
function waLink(message){
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return [...document.querySelectorAll(sel)]; }

// ============================
// Build UI: Select + Catalog
// ============================
function buildServiceSelect(){
  const select = $("#serviceSelect");
  SERVICES.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    opt.textContent = `${s.name} (${s.duration})`;
    select.appendChild(opt);
  });
}

function buildCatalog(){
  const grid = $("#catalogGrid");
  SERVICES.forEach(s => {
    const card = document.createElement("article");
    card.className = "card catalogItem reveal";

    const h = document.createElement("h3");
    h.textContent = s.name;

    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = `Duración estimada: ${s.duration}. Incluye:`;

    const ul = document.createElement("ul");
    ul.className = "bullets";
    s.includes.forEach(x => {
      const li = document.createElement("li");
      li.textContent = x;
      ul.appendChild(li);
    });

    const meta = document.createElement("div");
    meta.className = "meta";
    s.tags.forEach(t => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = t;
      meta.appendChild(pill);
    });

    const price = document.createElement("div");
    price.className = "priceBlank";
    price.textContent = "PRECIO: ________ (editar luego)";

    card.appendChild(h);
    card.appendChild(p);
    card.appendChild(ul);
    card.appendChild(meta);
    card.appendChild(price);

    grid.appendChild(card);
  });
}

// ============================
// Nav (mobile)
// ============================
function setupMobileNav(){
  const toggle = $(".navToggle");
  const mobile = $(".mobileNav");

  toggle.addEventListener("click", () => {
    const isOpen = mobile.classList.toggle("show");
    toggle.setAttribute("aria-expanded", String(isOpen));
    mobile.setAttribute("aria-hidden", String(!isOpen));
  });

  $all(".mobileNav a").forEach(a => {
    a.addEventListener("click", () => {
      mobile.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      mobile.setAttribute("aria-hidden", "true");
    });
  });
}

// ============================
// Scroll reveal animation
// ============================
function setupReveal(){
  const els = $all(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add("isVisible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// ============================
// Booking Form -> WhatsApp
// ============================
function setupForm(){
  const form = $("#bookingForm");
  const success = $("#formSuccess");

  const waBtn = $("#whatsAppBtn");
  const waBtn2 = $("#whatsAppBtn2");

  // Default WA buttons
  const defaultMsg = "Hola, quiero reservar en DEITRUM. ¿Me comparten disponibilidad, por favor?";
  waBtn.href = waLink(defaultMsg);
  waBtn2.href = waLink(defaultMsg);

  // Display WA
  const waDisplay = $("#waDisplay");
  waDisplay.textContent = `+${WHATSAPP_NUMBER}`;

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const contact = (fd.get("contact") || "").toString().trim();
    const date = (fd.get("date") || "").toString().trim();
    const kids = (fd.get("kids") || "").toString().trim();
    const service = (fd.get("service") || "").toString().trim();

    const msg =
`Hola, quiero agendar una cita en DEITRUM.
Nombre: ${name}
Contacto: ${contact}
Día preferido: ${date}
Servicio: ${service}
¿Vengo con niños?: ${kids}

¿Me confirman disponibilidad y el siguiente paso?`;

    success.hidden = false;

    const link = waLink(msg);
    window.open(link, "_blank", "noopener,noreferrer");
  });

  // Year
  $("#year").textContent = String(new Date().getFullYear());
}

// ============================
// Init
// ============================
buildServiceSelect();
buildCatalog();
setupMobileNav();
setupReveal();
setupForm();
