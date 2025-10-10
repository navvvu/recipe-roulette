const { useState, useEffect } = React;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // 1) Load recipes.json from the repo root
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("./recipes.json", { cache: "no-store" });
        if (!res.ok) throw new Error("recipes.json not found");
        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) Filter by title or category text
  const filtered = recipes.filter((r) => {
    const q = search.toLowerCase();
    const cat = Array.isArray(r.category) ? r.category.join(", ") : (r.category || "");
    return r.title.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
  });

  // ---------- Loading / Error ----------
  if (loading) return <p style={{ padding: "2rem" }}>Loading recipes…</p>;
  if (error) return <p style={{ padding: "2rem" }}>⚠️ {error}</p>;

  // ---------- Detail View ----------
  if (selected) {
    return (
      <div className="container">
        <button className="button" onClick={() => setSelected(null)}>← Back</button>

        <div className="detail" style={{ marginTop: 16 }}>
          <img
            src={selected.image}
            alt={selected.title}
            style={{ width: "100%", height: 360, objectFit: "cover" }}
          />
          <div className="detail-body">
            <h1 
              className={selected.title.includes('పె') ? 'telugu' : ''}
              style={{ marginBottom: 8 }}
            >
              {selected.title}
            </h1>
            <div className="recipe-stats">
              <span>⏱ {selected.time}</span>
              <span>👥 {selected.servings}</span>
              <span>💪 {selected.difficulty}</span>
            </div>

            <h3>Ingredients</h3>
            <ul>
              {selected.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>

            <h3>Instructions</h3>
            <ol>
              {selected.instructions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>

            {selected.credit && (
              <div
                style={{
                  marginTop: 16,
                  padding: "10px 12px",
                  border: "1px dashed #c57b57",
                  borderRadius: 10,
                  background: "#fffaf4"
                }}
              >
                🧑‍🍳 <strong>Cooking Credits:</strong>{" "}
                {selected.credit.link
                  ? <a href={selected.credit.link} target="_blank" rel="noreferrer">{selected.credit.display}</a>
                  : <span>{selected.credit.display}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Main Grid ----------
  return (
    <>
      <header className="header">
        <div className="header-row container">
          <div className="brand">
            <div className="logo-container">
              <svg className="logo" viewBox="0 0 100 100" width="40" height="40">
                {/* Pot Body */}
                <ellipse cx="50" cy="65" rx="25" ry="20" fill="#D98663" stroke="#2E2E2E" strokeWidth="2"/>
                {/* Pot Lid */}
                <ellipse cx="50" cy="45" rx="22" ry="8" fill="#D98663" stroke="#2E2E2E" strokeWidth="2"/>
                {/* Lid Knob */}
                <circle cx="50" cy="38" r="4" fill="#D98663" stroke="#2E2E2E" strokeWidth="1.5"/>
                {/* Handles */}
                <path d="M 25 55 Q 20 55 20 60 Q 20 65 25 65" fill="none" stroke="#2E2E2E" strokeWidth="2.5"/>
                <path d="M 75 55 Q 80 55 80 60 Q 80 65 75 65" fill="none" stroke="#2E2E2E" strokeWidth="2.5"/>
                {/* Decorative Bands */}
                <ellipse cx="50" cy="50" rx="20" ry="3" fill="#F5EFE6"/>
                <ellipse cx="50" cy="60" rx="22" ry="3" fill="#F5EFE6"/>
                <ellipse cx="50" cy="70" rx="20" ry="3" fill="#F5EFE6"/>
                {/* Steam */}
                <path d="M 50 35 Q 45 25 50 20 Q 55 25 50 35" fill="#EDC9A9" opacity="0.9"/>
                <path d="M 50 35 Q 55 30 60 25 Q 65 30 60 35" fill="#EDC9A9" opacity="0.7"/>
                <path d="M 50 35 Q 40 30 35 25 Q 40 30 45 35" fill="#EDC9A9" opacity="0.8"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1 className="title">food for thought</h1>
              <span className="tagline">
                and recipes to reminisce
              </span>
            </div>
          </div>

          <div className="buttons">
            <a
              className="button ghost"
              href="https://docs.google.com/forms/d/e/1FAIpQLSeNIzZZVF1-nnTq3McM1NUuOU6N9GMEt8k-iHR7w9PU2I6YZw/viewform?usp=header"
              target="_blank"
              rel="noreferrer"
            >
              Submit a Recipe
            </a>
          </div>
        </div>

        {/* Search bar */}
        <div className="search-wrap">
          <span className="search-ico">🔎</span>
          <input
            className="input"
            placeholder="Search recipes or categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="grid container">
        {filtered.map((r) => (
          <div className="card" key={r.id} onClick={() => setSelected(r)}>
            <img src={r.image} alt={r.title} />
            <div className="card-body">
              <h3>{r.title}</h3>
              <p style={{ margin: "4px 0 6px" }}>
                {(Array.isArray(r.category) ? r.category.join(", ") : r.category) || ""}
              </p>
              <span className="diff">{r.time} • {r.difficulty}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", opacity: 0.7 }}>
            No recipes yet. Add some to <code>recipes.json</code> or use the Google Form.
          </div>
        )}
      </main>

      <footer className="footer">
        Made with ❤️ for food lovers everywhere
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
