import React from "react";
import "./Cards.css";
import todo from "../../assets/icons_FEtask/To-do.svg";
import inProgress from "../../assets/icons_FEtask/in-progress.svg";
import backlog from "../../assets/icons_FEtask/Backlog.svg";
import done from "../../assets/icons_FEtask/Done.svg";
import cancelled from "../../assets/icons_FEtask/Cancelled.svg";
import threedot from "../../assets/icons_FEtask/3 dot menu.svg";

// Map status to the corresponding imported icons
const statusIcons = {
  done: done,
  "in progress": inProgress,
  todo: todo,
  backlog: backlog,
  cancelled: cancelled,
};

const Cards = ({ id, title, tag, status, showstatus }) => {
  return (
    <div className="card">
      {/* Card Header */}
      <div className="card-header">
        <div className="card-id">{id}</div>
        <div className="profile-pic">
          <img src="https://via.placeholder.com/50" alt="Profile" className="rounded" />
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {showstatus && (
          <span className="status-badge">
            {/* Dynamically render the correct status icon */}
            <img
              src={statusIcons[status.toLowerCase()]} // Ensure status matches the key in the mapping
              alt={status}
              className="status-icon"
            />
           
          </span>
        )}
        <span className="card-title" title={title}>{title}</span>
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        {tag ? (
            <>
             <img
             src={threedot} // Ensure status matches the key in the mapping
             className="status-icon"
           />
          <span className="tag">{tag}</span>
          </>
        ) : (
          <div className="tag-placeholder">
           
            <span className="gray-dot">•</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
