import React, { useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Typography } from "@mui/material";
import {
  ProcessedEvent,
  Scheduler,
  SchedulerHelpers,
} from "@aldabil/react-scheduler";

const EVENTS = [
  {
    event_id: 1,
    title: "Event 1",
    start: new Date("2022 3 22 09:30"),
    end: new Date("2022 3 22 10:30"),
    decription: "aaa",
  },
  // {
  //   event_id: 2,
  //   title: "Event 2",
  //   start: new Date("2022 3 22 10:00"),
  //   end: new Date("2022 3 22 11:00"),
  //   decription: "",
  // },
  // {
  //   event_id: 3,
  //   title: "Event 3",
  //   start: new Date("2022 3 22 09:00"),
  //   end: new Date("2022 3 22 10:00"),
  //   decription: "",
  // },
];

export default function App() {

  const [state, setState] = useState(EVENTS)

  // const fetchRemote = async (query) => {
  //   console.log("Query: ", query);
  //   /**Simulate fetchin remote data */
  //   return new Promise((res) => {
  //     setTimeout(() => {
  //       res(state);
  //     }, 300);
  //   });
  // };





  const handleConfirm = async (event, action) => {
    event.event_id = event?.event_id || EVENTS.length+1;
    console.log("getOneEvent",event, action);
    if (action === "edit") {
      // console.log("getAllEvent",EVENTS, action);
      setState(
        ...EVENTS,
        {
          event_id : event.event_id,
          title: event.title,
          start:event.start,
          end:event.end,
          decription:event.decription
        },
      )
      /** PUT event to remote DB */
    } else if (action === "create") {
      /**POST event to remote DB */
      EVENTS.push(event);
      console.log(EVENTS, action);
    }
    return await new Promise((res, rej) => {
      setTimeout(() => {
        res({
          ...event,
          event_id: event.event_id || Math.random(),
        });
        console.log("STATE:",state);
      }, 300);
    });
  };

  const handleDelete = async (deletedId) => {
    // Simulate http request: return the deleted id
    console.log("DELETE:",deletedId)
    for(let item of EVENTS){
      if(item.event_id = deletedId){
        console.log("ITEM",item)

      }
    }
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(deletedId);
        console.log("STATE in delete:", state)
      }, 300);
    });
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
          config: { label: "Decription", multiline: true, rows: 4 }
        }
      ]}
      viewerExtraComponent={(fields, event) => {
        return (
          <div>
            {fields.map((field, i) => {
              if (field.name === "admin_id") {
                const admin = field.options.find(
                  (fe) => fe.id === event.admin_id
                );
                return (
                  <Typography
                    key={i}
                    style={{ display: "flex", alignItems: "center" }}
                    color="textSecondary"
                    variant="caption"
                    noWrap
                  >
                    <PersonRoundedIcon /> {admin.text}
                  </Typography>
                );
              } else {
                return "";
              }
            })}
          </div>
        );
      }}
      events={EVENTS}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
    />
  );
}
