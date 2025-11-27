import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1) Ambil data note berdasarkan id
  useEffect(() => {
    const controller = new AbortController();

    const fetchNote = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${baseUrl}/api/notes/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data note");
        }

        const resJson = await res.json();
        // asumsi backend kirim: { message, data: { id, title, content, ... } }
        const note = resJson.data;

        setTitle(note.title || "");
        setContent(note.content || "");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Terjadi kesalahan");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();

    return () => controller.abort();
  }, [id, baseUrl]);

  // 2) Handle submit edit (PUT /api/notes/:id)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${baseUrl}/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      

      const resJson = await res.json();

      console.log("resJson==>", resJson)

      if (!res.ok) {
        throw new Error(resJson.message || "Gagal mengupdate note");
      }

      navigate(`/notes`);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Terjadi kesalahan saat update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error && !saving && !title) {
    // error saat fetch awal
    return (
      <section className="page">
        <div className="container">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <button className="backBtn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        <h1>Edit Note</h1>

        {error && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
        )}

        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Title <br />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Content <br />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </label>
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Note"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditNote;
