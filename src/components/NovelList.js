// src/components/NovelList.js
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { saveToLocalStorage } from "../utils/localStorage";
import "./NovelList.css";

const NovelList = () => {
  const [novels, setNovels] = useState([]);
  const [newNovel, setNewNovel] = useState({ title: "", lastRead: 0, link: "" });
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [isAddNewNovelVisible, setIsAddNewNovelVisible] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const q = query(collection(db, "novels"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const novelsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNovels(novelsData);
        saveToLocalStorage("novels", novelsData);
      });

      return () => {
        unsubscribe();
      };
    };

    fetchData();
  }, []);

  const addNovel = async () => {
    try {
      let updatedNovels;

      if (selectedNovel) {
        await updateDoc(doc(db, "novels", selectedNovel.id), newNovel);
        updatedNovels = novels.map((n) =>
          n.id === selectedNovel.id ? { id: selectedNovel.id, ...newNovel } : n
        );
        setSelectedNovel(null);
      } else {
        const addedDocRef = await addDoc(collection(db, "novels"), newNovel);
        updatedNovels = [...novels, { id: addedDocRef.id, ...newNovel }];
      }

      setNovels(updatedNovels);
      setNewNovel({ title: "", lastRead: 0, link: "" });
    } catch (error) {
      console.error("Error adding/updating novel: ", error);
    }
  };

  const deleteNovel = async (novelId) => {
    try {
      await deleteDoc(doc(db, "novels", novelId));
      const updatedNovels = novels.filter((novel) => novel.id !== novelId);
      setNovels(updatedNovels);
    } catch (error) {
      console.error("Error deleting novel: ", error);
    }
  };

  const editNovel = (novel) => {
    setSelectedNovel(novel);
    setNewNovel({ title: novel.title, lastRead: novel.lastRead, link: novel.link });
  };

  const cancelEdit = () => {
    setSelectedNovel(null);
    setNewNovel({ title: "", lastRead: 0, link: "" });
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleAddNewNovel = () => {
    setIsAddNewNovelVisible(!isAddNewNovelVisible);
  };

  return (
    <div className="container">
      <button onClick={toggleAddNewNovel} className="toggle-button">
        {isAddNewNovelVisible ? "Hide" : "Show"} Add New Novel
      </button>
      {isAddNewNovelVisible && (
        <div className="add-new-novel">
          <h2>{selectedNovel ? "Edit Novel" : "Add New Novel"}</h2>
          <input
            type="text"
            placeholder="Title"
            value={newNovel.title}
            onChange={(e) => setNewNovel({ ...newNovel, title: e.target.value })}
          />
          <input
            type="number"
            placeholder="Last Read Chapter"
            value={newNovel.lastRead}
            onChange={(e) => setNewNovel({ ...newNovel, lastRead: parseInt(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Link"
            value={newNovel.link}
            onChange={(e) => setNewNovel({ ...newNovel, link: e.target.value })}
          />
          <button onClick={addNovel}>{selectedNovel ? "Update Novel" : "Add Novel"}</button>
          {selectedNovel && <button onClick={cancelEdit}>Cancel</button>}
        </div>
      )}
      <h1>Novel List</h1>
      <ul>
        {novels.map((novel) => (
          <li key={novel.id}>
            <div>
              <strong>{novel.title}</strong> - Chapter {novel.lastRead}
            </div>
            <div>
              <a
                href={novel.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(novel.link);
                }}
              >
                Copy Link
              </a>
              <button onClick={() => editNovel(novel)}>Edit</button>
              <button onClick={() => deleteNovel(novel.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NovelList;
