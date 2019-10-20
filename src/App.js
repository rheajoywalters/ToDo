import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import { auth, db } from "./firebase";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot(snapshot => {
          const user_tasks = snapshot.docs.map(qs => {
            const user_task = {
              id: qs.id,
              text: qs.data().text,
              complete: qs.data().complete
            };
            return user_task;
          });
          setTasks(user_tasks);
        });
    }
    return unsubscribe;
  }, [user]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  if (!user) return <div />;

  const addTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .add({ text: newTask, checked: false })
      .then(() => {
        setNewTask("");
      });
  };

  const deleteTask = task_id => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .delete();
  };

  const changeCheck = (checked, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ checked: checked });
  };

  return (
    <div>
      <AppBar color="secondary" position="static">
        <Toolbar>
          <Typography
            color="inherit"
            variant="h6"
            style={{ marginLeft: 15, flexGrow: 1 }}
          >
            To Do List
          </Typography>
          <Typography color="inherit" style={{ marginRight: 30 }}>
            DON'T BE STRESSED {user.email}!:)
          </Typography>
          <Button onClick={handleSignOut} color="inherit">
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
        <Paper
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "30px",
            marginTop: "40px"
          }}
        >
          <Typography color="secondary" variant="h6">
            To Do List
          </Typography>
          <div style={{ display: "flex", marginTop: 30 }}>
            <TextField
              fullWidth={true}
              placeholder="Be Calm and Task On:"
              style={{ marginRight: "30px" }}
              value={newTask}
              onChange={e => {
                setNewTask(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "30px" }}
              onClick={addTask}
            >
              Add
            </Button>
          </div>
          <List>
            {tasks.map(value => (
              <ListItem key={value.id}>
                <ListItemIcon>
                  <Checkbox
                    checked={value.checked}
                    onChange={(e, checked) => {
                      changeCheck(checked, value.id);
                    }}
                    // checked = seomthing
                  />
                </ListItemIcon>
                <ListItemText primary={value.text} />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      deleteTask(value.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}
