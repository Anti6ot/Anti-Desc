import React, { useState, useEffect, useContext } from "react";
import { createCommentDB, getComments } from "../../services/service.databases";
import { AuthContext } from "../../context/AuthContext";

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
        setComments(comment);
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
    <div className="comments-section">
      <h5>Комментарии</h5>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Список комментариев */}
      <ul className="list-group mb-3">
        {comments
          ? comments.map((comment) => (
              <li key={comment.CommentID} className="list-group-item">
                <strong>{comment.Author}</strong>: {comment.Content}
              </li>
            ))
          : ""}
      </ul>

      {/* Поле ввода и кнопка для добавления комментария */}
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Введите комментарий"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-primary m-1" onClick={handleAddComment}>
          Добавить
        </button>
      </div>
    </div>
  );
}
