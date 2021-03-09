import * as React from "react";

import { UserForm } from "./components/UserForm";
import { UserFalback} from "./components/UserFallback";
import { UserView} from "./components/UserView";
import { fetchGithubUser } from "./userService";

const REQUEST_STATUS = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

const userReducer = (state, action)=> {
switch (action.type) {
  case REQUEST_STATUS.PENDING:
    return {
      status: REQUEST_STATUS.PENDING,
      user: null,
      error: null,
    }
    
    case REQUEST_STATUS.RESOLVED:
      return {
        status: REQUEST_STATUS.RESOLVED,
        user: action.user,
        error: null,
      }

      case REQUEST_STATUS.REJECTED:
        return {
          status: REQUEST_STATUS.REJECTED,
          user: null,
          error: action.error,
        }

        default:
          throw Error(`Unhandled status ${state.status}`);
  }
}

const UserInfo = ({ userName }) => {
  const [state, dispatch] = React.useReducer(userReducer, {
    status: userName ? REQUEST_STATUS.PENDING : REQUEST_STATUS.IDLE,
    user: null,
    error: null,
  });

  React.useEffect(()=>{
    if(!userName) return;

    dispatch({ type: REQUEST_STATUS.PENDING });

    return fetchGithubUser(userName)
      .then(userData => {
        dispatch({ type: REQUEST_STATUS.RESOLVED, user: userData });
      })
      .catch((error)=> {
        dispatch({ type: REQUEST_STATUS.REJECTED, error });
      });
  }, [userName])

switch (state.status) { 
  case REQUEST_STATUS.IDLE:
    return `Submit user`

  case REQUEST_STATUS.PENDING:
    return <UserFalback userName={userName}/>

  case REQUEST_STATUS.RESOLVED:
    return <UserView user={state.user}/>

  case REQUEST_STATUS.REJECTED:
    return (
      <div>
        There was an error
        <pre style={{whiteSpace: 'nowrap'}}>{state.error}</pre>
      </div>
    );

  default:
    throw Error(`Unhandled status ${state.status}`);
  }
};

const UserSection = ({ onSelect, userName }) => (
  <div>
    <div className="flex justify-center ">
      <UserInfo userName={userName} />
    </div>
  </div>
);

const App = () => {
  const [userName, setUserName] = React.useState(null);
  const handleSubmit = (newUserName) => setUserName(newUserName);
  const handleSelect = (newUserName) => setUserName(newUserName);

  return (
    <div>
      <UserForm userName={userName} onSubmit={handleSubmit} />
      <hr />
      <div className="m-4">
        <UserSection onSelect={handleSelect} userName={userName} />
      </div>
    </div>
  );
};

export default App;
