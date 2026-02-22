import * as users from "./users";
import * as sessions from "./sessions";
import * as tokens from "./tokens";
import * as accounts from "./accounts";

export {users} from "./users";
export {sessions} from "./sessions";
export {tokens} from "./tokens";
export {accounts} from "./accounts";

const schema = {...users, ...sessions, ...tokens, ...accounts};

export default schema;