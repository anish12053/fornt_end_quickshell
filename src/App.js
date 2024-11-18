import React, { useState, useEffect, useMemo } from "react";
import Cards from "./components/Cards/Cards";
import todo from "./assets/icons_FEtask/To-do.svg";
import inProgress from "./assets/icons_FEtask/in-progress.svg";
import backlog from "./assets/icons_FEtask/Backlog.svg";
import done from "./assets/icons_FEtask/Done.svg";
import cancelled from "./assets/icons_FEtask/Cancelled.svg";
import threedot from "./assets/icons_FEtask/3 dot menu.svg";
import display from "./assets/icons_FEtask/Display.svg";
import add from "./assets/icons_FEtask/add.svg";
import "./App.css";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [groupByOption, setGroupByOption] = useState(() => {
    return localStorage.getItem("groupByOption") || "status";
  });
  const [sortOption, setSortOption] = useState(() => {
    return localStorage.getItem("sortOption") || "priority";
  });

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      const groupKey = currentValue[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {});
  };

  const handleSorting = (ticketsArray, sortOption) => {
    return [...ticketsArray].sort((a, b) => {
      if (sortOption === "priority") {
        return a.priority - b.priority; // Ascending order of priority
      } else if (sortOption === "title") {
        return a.title.localeCompare(b.title); // Alphabetical order of title
      }
      return 0;
    });
  };

  useEffect(() => {
    localStorage.setItem("groupByOption", groupByOption);
    localStorage.setItem("sortOption", sortOption);
  }, [groupByOption, sortOption]);

  const groupedTickets = useMemo(() => {
    let grouped = [];
    switch (groupByOption) {
      case "status":
        grouped = groupBy(tickets, "status");
        break;
      case "user":
        grouped = groupBy(tickets, "userId");
        break;
      case "priority":
        grouped = groupBy(tickets, "priority");
        break;
      default:
        break;
    }

    // Apply sorting to tickets within each group based on selected sortOption
    const sortedGroupedTickets = Object.entries(grouped).map(([groupKey, group]) => {
      const sortedGroup = handleSorting(group, sortOption);
      return [groupKey, sortedGroup];
    });

    return sortedGroupedTickets;
  }, [tickets, groupByOption, sortOption]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Todo":
        return todo;
      case "In progress":
        return inProgress;
      case "Backlog":
        return backlog;
      case "Done":
        return done;
      case "Cancelled":
        return cancelled;
      default:
        return threedot;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 0:
        return "Urgent";
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      case 4:
        return "None";
      default:
        return "No priority";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const allStatusGroups = ["Todo", "In progress", "Backlog", "Done", "Cancelled"];

  return (
    <div className="app">
      {/* Navbar with Grouping and Sorting */}
      <div className="controls bg-white">
        <button
          className="display-button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img src={display} alt="Display icon" className="display-icon" /> Display
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            <div className="dropdown-section">
              <label>Grouping</label>
              <select
                value={groupByOption}
                onChange={(e) => {
                  setGroupByOption(e.target.value);
                  setShowDropdown(!showDropdown);
                }}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div className="dropdown-section">
              <label>Ordering</label>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setShowDropdown(!showDropdown);
                }}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="kanban-board bg-gray">
        {groupByOption === "user" ? (
          // Grouping by user (show user name filter)
          users.map((user) => {
            const userTickets = tickets.filter(
              (ticket) => ticket.userId === user.id
            );
            return (
              <div key={user.id} className="user-group">
                <div className="flex pad-sm text-sm">
                  <span>
                    {user.name} ({userTickets.length} )
                  </span>
                  <span className="icons">
                    <img src={threedot} className="gap-1" alt="Options" />
                    <img src={add} alt="Add" />
                  </span>
                </div>
                <div className="ticket-list">
                  {handleSorting(userTickets, sortOption).map((ticket) => (
                    <Cards
                      key={ticket.id}
                      id={ticket.id}
                      title={ticket.title}
                      tag={ticket.tag ? ticket.tag[0] : "No tag"}
                      status={ticket.status}
                      showstatus={true}
                      priority={getPriorityLabel(ticket.priority)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : groupByOption === "priority" ? (
          // Grouping by priority
          ["Urgent", "High", "Medium", "Low", "None"].map((priorityLabel) => {
            const priorityTickets = tickets.filter(
              (ticket) => getPriorityLabel(ticket.priority) === priorityLabel
            );
            return (
              <div key={priorityLabel} className="priority-group text-sm">
                <div className="flex pad-sm text-sm">
                  <span>
                    {priorityLabel} {priorityTickets.length}
                  </span>
                  <span className="icons">
                    <img src={threedot} className="gap-1" alt="Options" />
                    <img src={add} alt="Add" />
                  </span>
                </div>
                <div className="ticket-list">
                  {handleSorting(priorityTickets, sortOption).map((ticket) => (
                    <Cards
                      key={ticket.id}
                      id={ticket.id}
                      title={ticket.title}
                      tag={ticket.tag ? ticket.tag[0] : "No tag"}
                      status={ticket.status}
                      showstatus={true}
                      priority={priorityLabel}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Grouping by status (default)
          allStatusGroups.map((groupKey) => {
            const group = tickets.filter((ticket) => ticket.status === groupKey);
            return (
              <div key={groupKey} className="kanban-column">
                <div className="column-header">
                  <div className="flex">
                  <img src={getStatusIcon(groupKey)} alt={`${groupKey} icon`} />
                  <span className="gap-2 text-sm">{groupKey}</span>
                  </div>
                  <div className="flex">
                   
                    <span className="icons">
                      <img src={threedot} className="gap-1" alt="Options" />
                      <img src={add} alt="Add" />
                    </span>
                  </div>
                </div>
                <div className="ticket-list">
                  {handleSorting(group, sortOption).map((ticket) => (
                    <Cards
                      key={ticket.id}
                      id={ticket.id}
                      title={ticket.title}
                      tag={ticket.tag ? ticket.tag[0] : "No tag"}
                      status={ticket.status}
                      showstatus={true}
                      priority={getPriorityLabel(ticket.priority)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default App;
