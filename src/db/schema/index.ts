import * as users from "./users";
import * as sessions from "./sessions";
import * as tokens from "./tokens";

export {users} from "./users";
export {sessions} from "./sessions";
export {tokens} from "./tokens";

const schema = {...users, ...sessions, ...tokens};

export default schema;