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
          status: event.status === "Done" ? 1 : 2,
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
        status: e.status === 1 ? "Done" : "Not done",
      });
      axios.get(getUrl).then(function (response) {
        setEvents((prev) => {
          let data = [...response.data];
          let formattedData = data.map((event) => ({
            event_id: event.event_id,
            title: event.title,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            description: event.description,
            status: event.status === "Done" ? 1 : 2,
          }));
          prev = [...formattedData];
          console.log(prev);
          return prev;
        });
      });
      return events;
    } else if (action === "create") {
      await axios.post(postUrl, {
        event_id: null,
        title: e.title,
        startDate: `${e.start.getFullYear()} ${e.start.getMonth() + 1} ${e.start.getDate()} ${e.start.getHours()}:${e.start.getMinutes()}`,
        endDate: `${e.end.getFullYear()} ${e.end.getMonth() + 1} ${e.end.getDate()} ${e.end.getHours()}:${e.end.getMinutes()}`,
        description: e.description,
        status: e.status === 1 ? "Done" : "Not done",
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
        {
          name: "status",
          type: "select",
          default: 2,
          options: [
            { id: 1, text: "Done", value: 1 },
            { id: 2, text: "Not done", value: 2 },
          ],
          config: { label: "Status" },
        },
      ]}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
      // resources={[
      //   {
      //     assignee: 1,
      //     text: "User One",
      //     avatar: "https://i.pravatar.cc/300",
      //     color: "#ab2d2d",
      //   },
      // ]}
      viewerExtraComponent={(fields, event) => {
        return (
          <div>
            <p>
              Status: <b style={event.status === 1 ? { color: "green" } : { color: "red" }}>{event.status === 1 ? "Done" : "Not done"}</b>
            </p>
            <p>Description: {event.description || "Nothing..."}</p>
          </div>
        );
      }}
    />
  );
}
