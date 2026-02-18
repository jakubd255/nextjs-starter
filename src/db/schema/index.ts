import * as users from "./users";
import * as sessions from "./sessions";
import * as tokens from "./tokens";
import * as providers from "./providers";

export {users} from "./users";
export {sessions} from "./sessions";
export {tokens} from "./tokens";
export {providers} from "./providers";

const schema = {...users, ...sessions, ...tokens, ...providers};

export default schema;