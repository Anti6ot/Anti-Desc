import React, { useState, useEffect, useContext } from "react";
import { createCommentDB, getComments } from "../../services/service.databases";
import { AuthContext } from "../../context/AuthContext";
import "./comment.css";

export default function Comments({ ticketId, token }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]); // Список комментариев
  const [newComment, setNewComment] = useState(""); // Новый комментарий
  const [error, setError] = useState(""); // Ошибка, если есть
  // Загрузка комментариев с сервера при загрузке компонента
  useEffect(() => {
    async function fetchComment() {
      try {
        const comment = await getComments(ticketId, token);
        setComments(comment.reverse());
      } catch (error) {
        setError("Не удалось загрузить комментарии.");
      }
    }
    fetchComment();
  }, [ticketId, token]);

  // Обработчик добавления нового комментария
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Комментарий не может быть пустым.");
      return;
    }
    try {
      const response = await createCommentDB(ticketId, newComment, token, user);
      setComments((prevComments) => [...prevComments, response]); // Добавляем новый комментарий в список
      setNewComment(""); // Очищаем поле ввода
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Не удалось добавить комментарий.");
    }
  };

  return (
    <div className="form-container">
      <h2>Комментарии</h2>
      <div className="comments-section">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="fixed-comments-container">
          {/* Список комментариев */}
          <ul className="comments-list">
            {comments
              ?.slice() // Создаем копию массива, чтобы избежать изменения оригинального
              .map((comment) => (
                <li key={comment.CommentID} className="comment-item">
                  <strong>{comment.Author}</strong>: {comment.Content}
                </li>
              ))}
          </ul>

          {/* Поле ввода и кнопка для добавления комментария */}
          <div className="add-comment">
            <input
              type="text"
              className="comment-input"
              placeholder="Введите комментарий"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddComment}>
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
