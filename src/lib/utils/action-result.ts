import { toast } from "sonner";

export interface ActionResult {
    success: boolean;
    message?: string;
    errors?: Record<string, string[] | undefined>;
    [key: string]: any;
}

class ActionReply {
    protected result: ActionResult;

    constructor(success: boolean) {
        this.result = {success};
    }

    message(msg: string) {
        this.result.message = msg;
        return this;
    }

    data(value: Record<string, any>) {
        Object.assign(this.result, value);
        return this;
    }

    build(): ActionResult {
        return this.result;
    }
}

class ActionSuccess extends ActionReply {
    constructor() {
        super(true);
    }
}

class ActionFailure extends ActionReply {
    constructor(errs: Record<string, string[] | undefined> = {}) {
        super(false);
        this.result.errors = errs;
    }

    errors(errs: Record<string, string[] | undefined>) {
        this.result.errors = errs;
        return this;
    }
}

export const actionSuccess = () => new ActionSuccess();
export const actionFailure = (errs?: Record<string, string[] | undefined>) => new ActionFailure(errs);


export const handleActionResult = (result: ActionResult) => {
    if(!result.message) return result.success;

    if(result.success) {
        toast.success(result.message, {
            position: "top-center"
        });
    }

    else if(!result.success) {
        toast.error(result.message, {
            position: "top-center"
        });
    }

    return result.success;
};