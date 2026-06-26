import * as users from "./users";
import * as sessions from "./sessions";
import * as tokens from "./tokens";
import * as accounts from "./accounts";
import * as auditLogs from "./audit-logs";

export {users} from "./users";
export {sessions} from "./sessions";
export {tokens} from "./tokens";
export {accounts} from "./accounts";
export {auditLogs} from "./audit-logs";

const schema = {...users, ...sessions, ...tokens, ...accounts, ...auditLogs};

export default schema;