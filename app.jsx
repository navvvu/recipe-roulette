const { useState, useEffect } = React;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // 1) Load all recipe files from the repo root
  useEffect(() => {
    (async () => {
      try {
        // Load all recipe files
        const recipeFiles = [
          "./recipes.json",
          "./recipes-telugu.json", 
          "./recipes-south-indian.json",
          "./recipes-kerala.json",
          "./recipes-kannada.json",
          "./recipes-desserts.json",
          "./recipes-north-indian.json"
        ];
        
        const allRecipes = [];
        
        for (const file of recipeFiles) {
          try {
            const res = await fetch(file, { cache: "no-store" });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                allRecipes.push(...data);
              }
            }
          } catch (e) {
            console.log(`Could not load ${file}:`, e.message);
          }
        }
        
        setRecipes(allRecipes);
      } catch (e) {
        setError(e.message || "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) Filter by title or category text
  const filtered = recipes.filter((r) => {
    if (!r || !r.title) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
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
            src={selected.id === 1 ? './images/biryani.jpg' : `./images/${selected.id}.jpg`}
            alt={selected.title}
            style={{ width: "100%", height: 360, objectFit: "cover" }}
            onError={(e) => { 
              // Simple fallback to placeholder
              if (!e.target.src.includes('placeholder')) {
                e.target.src = selected.image;
              }
            }}
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
              <img src="./images/image.jpg" alt="Cooking Pot Logo" className="logo-image" />
            </div>
            <div className="brand-text">
              <h1 className="title">food for thought</h1>
              <span className="tagline">
                and recipes to reminisce
              </span>
            </div>
          </div>

          <div className="buttons">
            <div className="logo-container right-logo">
              <img src="./images/image.jpg" alt="Cooking Pot Logo" className="logo-image" />
            </div>
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
            <img 
              src={r.id === 1 ? './images/biryani.jpg' : `./images/${r.id}.jpg`} 
              alt={r.title} 
              onError={(e) => { 
                // Simple fallback to placeholder
                if (!e.target.src.includes('placeholder')) {
                  e.target.src = r.image;
                }
              }} 
            />
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
