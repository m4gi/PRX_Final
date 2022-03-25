import { Scheduler } from "@aldabil/react-scheduler";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
const data = [];
export default function App() {
  const baseUrl = "http://localhost:8080/";
  const getUrl = baseUrl + "events";
  const postUrl = baseUrl + "addEvent";
  const deleteUrl = baseUrl + "deleteEvent?id=";
  const putUrl = baseUrl + "updateEvent";

  const [events, setEvents] = useState([]);
  const [test, setTest] = useState(1);
  const [currentAction, setCurrentAction] = useState("edit");

  useEffect(() => {
    axios.get(getUrl).then(function (response) {
      setEvents((prev) => {
        let data = [...response.data];
        let formattedData = data.map((event) => ({
          event_id: event.event_id,
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          description: event.description,
        }));
        prev = [...formattedData];
        console.log(prev);
        return prev;
      });
    });
  }, [currentAction]);
  const handleConfirm = async (e, action) => {
    if (action === "edit") {
      await axios.put(putUrl, {
        event_id: e.event_id,
        title: e.title,
        startDate: `${e.start.getFullYear()} ${e.start.getMonth() + 1} ${e.start.getDate()} ${e.start.getHours()}:${e.start.getMinutes()}`,
        endDate: `${e.end.getFullYear()} ${e.end.getMonth() + 1} ${e.end.getDate()} ${e.end.getHours()}:${e.end.getMinutes()}`,
        description: e.description,
        status: e.status,
      });
      setTest(Math.random());
      setCurrentAction(action);
      return events;
    } else if (action === "create") {
      await axios.post(postUrl, {
        event_id: null,
        title: e.title,
        startDate: `${e.start.getFullYear()} ${e.start.getMonth() + 1} ${e.start.getDate()} ${e.start.getHours()}:${e.start.getMinutes()}`,
        endDate: `${e.end.getFullYear()} ${e.end.getMonth() + 1} ${e.end.getDate()} ${e.end.getHours()}:${e.end.getMinutes()}`,
        description: e.description,
        status: e.status,
      });
      setCurrentAction(action);
      return events;
    }
  };

  const handleDelete = async (deletedId) => {
    await axios.delete(deleteUrl + deletedId);
    setCurrentAction("delete");
    return events;
  };

  return (
    <Scheduler
      view="week"
      events={events}
      day={{
        startHour: 6,
        endHour: 23,
        step: 60,
      }}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 0,
        startHour: 6,
        endHour: 23,
        step: 60,
      }}
      month={null}
      fields={[
        {
          name: "description",
          type: "input",
          default: "",
          config: { label: "Description", multiline: true, rows: 4 },
        },
      ]}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
    />
  );
}
