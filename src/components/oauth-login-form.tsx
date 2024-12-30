import GitHubLoginForm from "./forms/github-login-form";

export default function OAuthLoginForm() {
    return(
        <div className="flex flex-col gap2">
            <GitHubLoginForm/>
        </div>
    );
}