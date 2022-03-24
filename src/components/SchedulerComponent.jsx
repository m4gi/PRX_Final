import React, { useState, useRef } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Typography } from "@mui/material";
import { ProcessedEvent, Scheduler, SchedulerHelpers } from "@aldabil/react-scheduler";

export default function App() {
  const [events, setEvents] = useState([
    {
      event_id: 1,
      title: "Event 1",
      start: new Date("2022 3 22 09:30"),
      end: new Date("2022 3 22 10:30"),
      decription: "aaa",
    },
    {
      event_id: 2,
      title: "Event 2",
      start: new Date("2022 3 20 10:00"),
      end: new Date("2022 3 20 11:00"),
      decription: "event 2",
    },
    {
      event_id: 3,
      title: "Event 3",
      start: new Date("2022 3 24 09:00"),
      end: new Date("2022 3 24 10:00"),
      decription: "",
    },
  ]);

  const handleConfirm = (event, action) => {
    if (action === "edit") {
      let editItemIndex = events.findIndex((item) => item.event_id === event.event_id);
      setEvents((prev) => {
        prev.splice(editItemIndex, 1, event);
        console.log(prev);
        return prev;
      });
      return events;
    } else if (action === "create") {
      const newID = events[events.length - 1].event_id + 1;
      event.event_id = newID;
      setEvents((prev) => {
        prev.push(event);
        console.log(prev);
        return prev;
      });
      return events;
    }
  };

  const handleDelete = async (deletedId) => {
    // Simulate http request: return the deleted id
    console.log("DELETE:", deletedId);
    // setEvents((prev) => prev.filter((event) => event.event_id != deletedId));
  };

  return (
    <Scheduler
      view="week"
      day={null}
      month={null}
      fields={[
        {
          name: "description",
          type: "input",
          default: "",
          config: { label: "Decription", multiline: true, rows: 4 },
        },
      ]}
      events={events}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
    />
  );
}
