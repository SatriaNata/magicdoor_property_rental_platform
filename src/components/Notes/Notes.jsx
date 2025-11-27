import React, { useEffect, useState } from 'react';
import { villas } from '../../villas';
import { notes } from '../../notes_data/notes'
import { RxDot } from "react-icons/rx";
import { IoIosPeople } from "react-icons/io";
import { FaBed } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { FaBath } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  // console.log("VITE_API_BASE_URL =>", import.meta.env.VITE_API_BASE_URL);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/notes/all_notes`)
        if (!res.ok) {
          throw new Error(`Failed to fetch notes: ${res.status}`);
        }
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false)
      }
    };

    fetchNotes();
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!titleInput.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setCreateLoading(true);

      const res = await fetch(`${baseUrl}/api/notes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleInput,
          content: contentInput,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Create error:", text);
        throw new Error(`Failed to create note: ${res.status}`);
      }

      const newNote = await res.json();

      // update list tanpa fetch ulang
      setNotes((prev) => [...prev, newNote]);

      // reset form
      setTitleInput("");
      setContentInput("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return <div className="page"><h1>ALL Notes</h1><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="page"><h1>ALL Notes</h1><p>Error: {error}</p></div>;
  }

  const handleDetail = (id) => {
    navigate(`/notes/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/notes/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Yakin mau hapus note ini?");
    if (!ok) return;

    try {
      const res = await fetch(`${baseUrl}/api/notes/${id}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus note");
      }

      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err.message || "Terjadi kesalahan saat hapus note");
    }
  }

  return (
    // <div className="page" id="allNotes">
    //   <h1>ALL Notes</h1>
    //   <p>{notes.length} Properties</p>
    //   <div className="notesContainer">
    //     {notes.map((element) => (
    //       <Link to={`/note/${element.id}`} className="card" key={element.id}>
    //         <span>{element.title}</span>
    //         <div className="location_text">
    //           <span><RxDot /></span>
    //           <span>{element.content}</span>
    //         </div>
    //       </Link>
    //     ))}
    //   </div>
    // </div>
    <div className="page" id="allNotes">
      <h1>ALL Notes</h1>

      {/* Form create note */}
      <form onSubmit={handleCreate} style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Title <br />
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Note title"
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Content <br />
            <textarea
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="Note content"
              rows={3}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>
        <button type="submit" disabled={createLoading}>
          {createLoading ? "Saving..." : "Add Note"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red" }}>Error: {error}</p>
      )}

      <p>{notes.length} Notes</p>
      <div className="villasContainer">
        {notes.map((element) => (
          <div className="card" key={element.id}>
            <div className="title_text">
              <span>{element.title}</span>
            </div>

            <div className="specification">
              <span><RxDot /></span>
              <span>{element.content}</span>
            </div>

            <div className="note-actions">
              <button onClick={() => handleDetail(element.id)}>Detail</button>
              <button onClick={() => handleEdit(element.id)}>Edit</button>
              <button onClick={() => handleDelete(element.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  // return (
  //   <>
  //     {/* <div className="page" id='allVillas'>
  //         <h1>ALL Notes</h1>
  //         <p>{villas.length} Properties</p>
  //         <div className="villasContainer">
  //       {villas.map((element) => {
  //         return (
  //             <Link to={`/villa/${element.id}`} className="card" key={element.id}>
  //               <img src={element.image} alt={element.name} />
  //               <div className="location_text">
  //                 <span>{element.location}</span>
  //                 <span>
  //                   <RxDot />
  //                 </span>
  //                 <span>{element.category}</span>
  //               </div>
  //               <div className="title_text">{element.name}</div>
  //               <div className="specifications">
  //                 <div className="spec">
  //                   <IoIosPeople />
  //                   <span>{element.guests}</span>
  //                   Guests
  //                 </div>
  //                 <div className="spec">
  //                   <FaBed />
  //                   <span>{element.bedrooms}</span>
  //                   Bedrooms
  //                 </div>
  //                 <div className="spec">
  //                   <BiArea />
  //                   <span>{element.squareMeter}</span>
  //                   Area
  //                 </div>
  //                 <div className="spec">
  //                   <FaBath />
  //                   <span>{element.bathrooms}</span>
  //                   Bathrooms
  //                 </div>
  //               </div>
  //               <div className="badge">
  //                 From <span>Rs.{element.dailyRent} / Day </span>
  //               </div>
  //             </Link>
  //         );
  //       })}
  //     </div>
  //       </div> */}
  //     <div className="page" id='allVillas'>
  //       <h1>ALL Notes</h1>
  //       <p>{notes.length} Properties</p>
  //       <div className="villasContainer">
  //         {notes.map((element) => {
  //           return (
  //             <Link to={`/note/${element.id}`} className="card" key={element.id}>
  //               {/* <img src={element.image} alt={element.name} /> */}
  //               <span>{element.title}</span>
  //               <div className="location_text">

  //                 <span>
  //                   <RxDot />
  //                 </span>
  //                 <span>{element.content}</span>
  //               </div>
  //             </Link>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   </>
  // )
}

export default Notes