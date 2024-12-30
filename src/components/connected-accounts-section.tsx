import GitHubAccountCard from "./github-account-card";


export default function ConnectedAccountsSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Connected accounts
            </h2>
            <GitHubAccountCard/>
        </section>
    );
}