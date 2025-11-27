import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SingleNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

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

        const redponse = await res.json();
        setNote(redponse.data);
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
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!note) return <p>Note tidak ditemukan</p>;

  return (
    <>
      <section id="singleNote" className="page">
        <div className="container">
          <h1>Detail Notes</h1>
          <button className="backBtn" onClick={() => navigate(-1)}>
            &larr; Back
          </button>

          <div className="title_text">
            <span>{note.title}</span>
          </div>

          <div className="specification">
            <span>{note.content}</span>
          </div>

          <p>
            Dibuat:{" "}
            {note.createdAt && new Date(note.createdAt).toLocaleString()}
            {note.updatedAt && (
              <>
                {" "}
                | Terakhir diupdate:{" "}
                {new Date(note.updatedAt).toLocaleString()}
              </>
            )}
          </p>
        </div>
      </section>
    </>
  );
};

export default SingleNote;