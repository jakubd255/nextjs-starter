import * as users from "./users";
import * as sessions from "./sessions";
import * as tokens from "./tokens";
import * as accounts from "./accounts";
import * as auditLogs from "./audit-logs";
import * as albums from "./albums";

export {users} from "./users";
export {sessions} from "./sessions";
export {tokens} from "./tokens";
export {accounts} from "./accounts";
export {auditLogs} from "./audit-logs";
export {albums} from "./albums";

const schema = {...users, ...sessions, ...tokens, ...accounts, ...auditLogs, ...albums};

export default schema;