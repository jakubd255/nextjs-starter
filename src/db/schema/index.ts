import * as users from "./users";
import * as emails from "./emails";
import * as sessions from "./sessions";
import * as tokens from "./tokens";

export {users} from "./users";
export {emails} from "./emails";
export {sessions} from "./sessions";
export {tokens} from "./tokens";

const schema = {...users, ...emails, ...sessions, ...tokens};

export default schema;