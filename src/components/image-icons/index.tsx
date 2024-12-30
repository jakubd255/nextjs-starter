import Image from "next/image";
import github from "@/../public/github.svg";

export const GitHubIcon = () => {
    return(<Image src={github} alt="GitHub icon" className="dark:invert mr-2" width={25} height={25} draggable={false}/>);
}