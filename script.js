const STORE = {
  currentSection: "notes",
  notes: [
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "yellow",
      deleted: false,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "blue",
      deleted: false,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "cyan",
      deleted: false,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "white",
      deleted: false,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "turquoise",
      deleted: false,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "red",
      deleted: false,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "pink",
      deleted: false,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "green",
      deleted: false,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "white",
      deleted: true,
    },
    {
      id: uuidv4(),
      title: "A note",
      body: "A content",
      color: "white",
      deleted: true,
    },
  ],
};

function DOMHandler(parentSelector) {
  const parent = document.querySelector(parentSelector);

  if (!parent) throw new Error("Parent not found");

  return {
    load(module) {
      parent.innerHTML = module;
      module.addListeners();
    },
  };
}

function renderHeader() {
  return `
  <header class="header">
    <h1><img src="/assets/images/keepable.png" alt="Keepable" /></h1>
    <h2>Welcome to {keepable}</h2>
  </header>
  `;
}

function renderToolTip() {
  return `
  <div class="tooltip">
    <input type="hidden" name="color" />
    <a class="tooltip-trigger" href="#color"><i class="ri-palette-fill"></i></a>
    <div class="tooltip-content hidden">
      <div class="tooltip-content__body">
        <div
          data-color="white"
          class="tooltip-option tooltip-option--white"
        ></div>
        <div data-color="red" class="tooltip-option tooltip-option--red"></div>
        <div
          data-color="orange"
          class="tooltip-option tooltip-option--orange"
        ></div>
        <div
          data-color="yellow"
          class="tooltip-option tooltip-option--yellow"
        ></div>
        <div
          data-color="green"
          class="tooltip-option tooltip-option--green"
        ></div>
        <div
          data-color="turquoise"
          class="tooltip-option tooltip-option--turquoise"
        ></div>
        <div data-color="cyan" class="tooltip-option tooltip-option--cyan"></div>
        <div data-color="blue" class="tooltip-option tooltip-option--blue"></div>
        <div
          data-color="purple"
          class="tooltip-option tooltip-option--purple"
        ></div>
        <div data-color="pink" class="tooltip-option tooltip-option--pink"></div>
      </div>
    </div>
  </div>
  `;
}

function renderNote(note, isTrashed) {
  let footer = `<footer>
    ${renderToolTip()}
    <div class="trash">
      <a class="trash-trigger" href="#trash">
        <i class="ri-delete-bin-fill"></i>
      </a>
    </div>
  </footer>`;

  if (isTrashed) {
    footer = `<footer>
      <div class="delete">
        <a class="delete-trigger" href="#delete">
          <i class="ri-delete-bin-fill"></i>
        </a>
      </div>
      <div class="restore">
        <a class="restore-trigger" href="#restore">
        <i class="ri-arrow-go-back-fill"></i>
        </a>
      </div>
    </footer>`;
  }

  return `<li class="note" style="background-color: var(--${note.color})" data-id="${note.id}">
    <h3 class="note-title">${note.title}</h3>
    <p class="note-body">${note.body}</p>
    ${footer}
  </li>`;
}

function renderNotes() {
  const notes = STORE.notes.filter((note) => !note.deleted);
  if (notes.length === 0)
    return `<div class="notes notes--no-content"><h2>No notes to keep</h2></div>`;
  return `<div class="notes js-notes"><ul>${notes
    .map((note) => renderNote(note))
    .join("")}</ul></div>`;
}

function renderTrashNotes() {
  const notes = STORE.notes.filter((note) => note.deleted);
  if (notes.length === 0)
    return `<div class="notes notes--no-content"><h2>No trash notes to show</h2></div>`;
  return `<div class="notes js-notes"><ul>${notes
    .map((note) => renderNote(note, true))
    .join("")}</ul></div>`;
}

const Aside = (function () {
  const template = `
  <aside class="aside">
    <ul>
      <li data-value="notes" class="selected">
        <a href="#notes">Notes</a>
      </li>
      <li data-value="trash"><a href="#trash">Trash</a></li>
    </ul>
  </aside>
  `;

  function setSelectedAsideItem() {
    const items = document.querySelectorAll(".aside li");
    const selectedItem = Array.from(items).find(
      (item) => item.dataset.value === STORE.currentSection
    );
    items.forEach((item) => item.classList.remove("selected"));
    selectedItem.classList.add("selected");
  }

  function listenAsideClick() {
    const anchors = document.querySelectorAll(".aside a");
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        STORE.currentSection = anchor.closest("li").dataset.value;
        setSelectedAsideItem();
        loadContent();
      });
    });
  }

  return {
    toString() {
      return template;
    },
    addListeners() {
      listenAsideClick();
    },
  };
})();

const NoteForm = (function () {
  const template = `
  <form class="js-note-form note-form">
    <input
      name="title"
      type="text"
      class="note-form__title"
      placeholder="The title for my new note"
    />
    <textarea
      name="body"
      class="note-form__body"
      placeholder="This is the body for the note."
    ></textarea>
    <footer>
      ${renderToolTip()}
      <button type="submit">Keep it!</button>
    </footer>
  </form>
  `;

  function listenTooltip() {
    const tooltip = document.querySelector(".js-note-form .tooltip");
    tooltip.addEventListener("mouseover", (e) => {
      const trigger = tooltip.querySelector(".tooltip-trigger");
      const content = tooltip.querySelector(".tooltip-content");
      const onMouseLeave = (e) => {
        if (tooltip === e.target) {
          tooltip.removeEventListener("mouseleave", onMouseLeave);
          content.classList.add("hidden");
        }
      };
      if (trigger === e.target) {
        content.classList.remove("hidden");
        tooltip.addEventListener("mouseleave", onMouseLeave);
      }
    });
    tooltip.addEventListener("click", (e) => {
      const form = document.querySelector(".js-note-form");
      const triggers = tooltip.querySelectorAll(".tooltip-option");
      triggers.forEach((trigger) => {
        if (trigger === e.target) {
          e.preventDefault();
          const input = trigger
            .closest(".tooltip")
            .querySelector("input[name=color]");
          input.value = trigger.dataset.color;
          form.style.backgroundColor = `var(--${trigger.dataset.color})`;
        }
      });
    });
  }

  function listenFormSubmit() {
    const form = document.querySelector(".js-note-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const { title, body, color } = e.target;
      STORE.notes.push({
        id: uuidv4(),
        title: title.value,
        body: body.value,
        color: color.value,
      });
      e.target.reset();
      e.target.style.backgroundColor = "";
      loadContent();
    });
  }

  return {
    toString() {
      return template;
    },
    addListeners() {
      listenTooltip();
      listenFormSubmit();
    },
  };
})();

const NoteList = (function () {
  function listenToolTips() {
    const container = document.querySelector(".js-notes");
    if (!container) return;
    container.addEventListener("mouseover", (e) => {
      const tooltips = container.querySelectorAll(".tooltip");
      tooltips.forEach((tooltip) => {
        const trigger = tooltip.querySelector(".tooltip-trigger");
        const content = tooltip.querySelector(".tooltip-content");
        const onMouseLeave = (e) => {
          if (tooltip === e.target) {
            tooltip.removeEventListener("mouseleave", onMouseLeave);
            content.classList.add("hidden");
          }
        };
        if (trigger === e.target) {
          content.classList.remove("hidden");
          tooltip.addEventListener("mouseleave", onMouseLeave);
        }
      });
    });
    container.addEventListener("click", (e) => {
      const triggers = container.querySelectorAll(".tooltip-option");
      triggers.forEach((trigger) => {
        if (trigger === e.target) {
          e.preventDefault();
          STORE.notes = STORE.notes.map((note) => {
            if (note.id === trigger.closest(".note").dataset.id) {
              return { ...note, color: trigger.dataset.color };
            }
            return note;
          });
          loadContent();
        }
      });
    });
  }

  function listenTrash() {
    const container = document.querySelector(".js-notes");
    if (!container) return;
    container.addEventListener("click", (e) => {
      const trashBins = container.querySelectorAll(".trash-trigger");
      trashBins.forEach((trashBin) => {
        if (trashBin === e.target) {
          e.preventDefault();
          const parentNote = trashBin.closest(".note");
          parentNote.classList.add("shrinkOut");
          parentNote.addEventListener("animationend", (e) => {
            Content.load(NotesPage);
          });
          STORE.notes = STORE.notes.map((note) => {
            if (note.id === parentNote.dataset.id) {
              return { ...note, deleted: true };
            }
            return note;
          });
        }
      });
    });
  }

  return {
    toString() {
      return renderNotes();
    },
    addListeners() {
      listenToolTips();
      listenTrash();
    },
  };
})();

const TrashList = (function () {
  const template = () => renderTrashNotes();

  function listenDelete() {
    const container = document.querySelector(".js-notes");
    if (!container) return;
    container.addEventListener("click", (e) => {
      const trashBins = container.querySelectorAll(".delete-trigger");
      trashBins.forEach((trashBin) => {
        if (trashBin === e.target) {
          e.preventDefault();
          const parentNote = trashBin.closest(".note");
          parentNote.classList.add("trashOut");
          parentNote.addEventListener("animationend", (e) => {
            loadContent();
          });
          STORE.notes = STORE.notes.filter(
            (note) => note.id !== parentNote.dataset.id
          );
        }
      });
    });
  }

  function listenRestore() {
    const container = document.querySelector(".js-notes");
    if (!container) return;
    container.addEventListener("click", (e) => {
      const restoreArrows = container.querySelectorAll(".restore-trigger");
      restoreArrows.forEach((restoreArrow) => {
        if (restoreArrow === e.target) {
          e.preventDefault();
          const parentNote = restoreArrow.closest(".note");
          parentNote.classList.add("goBack");
          parentNote.addEventListener("animationend", (e) => {
            loadContent();
          });
          STORE.notes = STORE.notes.map((note) => {
            if (note.id === parentNote.dataset.id) {
              return { ...note, deleted: false };
            }
            return note;
          });
        }
      });
    });
  }

  return {
    toString() {
      return template();
    },
    addListeners() {
      listenDelete();
      listenRestore();
    },
  };
})();

const NotesPage = (function () {
  const template = () => `
  <section class="section">
    ${NoteForm}
    ${NoteList}
  </section>
  `;

  return {
    toString() {
      return template();
    },
    addListeners() {
      NoteForm.addListeners();
      NoteList.addListeners();
    },
  };
})();

const Trashpage = (function () {
  const template = () => `
  <section class="section">
    ${TrashList}
  </section>
  `;

  return {
    toString() {
      return template();
    },
    addListeners() {
      TrashList.addListeners();
    },
  };
})();

const Layout = (function () {
  const template = `
  <main class="main">
    ${renderHeader()}
    ${Aside}
    <div class="js-content content">
    </div>
  </main>
  `;

  return {
    toString() {
      return template;
    },
    addListeners() {
      Aside.addListeners();
    },
  };
})();

function loadContent() {
  switch (STORE.currentSection) {
    case "notes":
      Content.load(NotesPage);
      break;
    case "trash":
      Content.load(Trashpage);
      break;

    default:
      break;
  }
}

const App = DOMHandler("#root");
App.load(Layout);

const Content = DOMHandler(".js-content");
loadContent();
